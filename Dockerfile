#!/bin/echo docker build . -f
# -*- coding: utf-8 -*-
# Copyright: 2018-present Samsung Electronics France SAS, and other contributors

FROM ubuntu:16.04
MAINTAINER Philippe Coval (p.coval@samsung.com)

ENV DEBIAN_FRONTEND noninteractive
ENV LC_ALL en_US.UTF-8
ENV LANG ${LC_ALL}

RUN echo "# log: Configuring locales" \
  && set -x \
  && apt-get update -y \
  && apt-get install -y locales \
  && echo "${LC_ALL} UTF-8" | tee /etc/locale.gen \
  && locale-gen ${LC_ALL} \
  && dpkg-reconfigure locales \
  && sync

RUN echo "# log: Setup system" \
  && set -x \
  && dpkg --get-selections > ~/packages-pre.lst \
  && apt-get update -y \
  && apt-get install -y \
     apt-transport-https \
     git \
     lsb-release \
     sudo \
     ttf-mscorefonts-installer \
     checkinstall \
  && apt-get clean \
  && sync

WORKDIR /usr/local/opt/depot_tools
RUN echo "# log: ${project}: Preparing sources" \
  && set -x \
  && git clone --recursive --depth 1 \
     https://chromium.googlesource.com/chromium/tools/depot_tools . \
  && sync

ENV project castanets
ENV url https://github.com/tizenteam/castanets
ENV branch sandbox/rzr/castanets_63/devel/master
 
WORKDIR /usr/local/opt/${project}/src/${project}/src
RUN echo "# log: ${project}: Preparing sources" \
  && set -x \
  && git clone --depth 1 --recursive -b ${branch} ${url} .\
  && sync

WORKDIR /usr/local/opt/${project}/src/${project}/src
RUN echo "# log: ${project}: Preparing sources" \
  && set -x \
  && export PATH="${PATH}:/usr/local/opt/depot_tools" \
  && yes | build/install-build-deps.sh \
  && sync

WORKDIR /usr/local/opt/${project}/src/${project}/src
RUN echo "# log: ${project}: Preparing sources" \
  && set -x \
  && export PATH="${PATH}:/usr/local/opt/depot_tools" \
  && build/create_gclient.sh \
  && sync

WORKDIR /usr/local/opt/${project}/src/${project}/src
RUN echo "# log: ${project}: Preparing sources" \
  && set -x \
  && export PATH="${PATH}:/usr/local/opt/depot_tools" \
  && gclient sync --with_branch_head \
  && sync

WORKDIR /usr/local/opt/${project}/src/${project}/src
RUN echo "# log: ${project}: Building sources" \
  && set -x \
  && export PATH="${PATH}:/usr/local/opt/depot_tools" \
  && gn gen out/Default \
  && echo 'enable_castanets=true' | tee out/Default/args.gn \
  && echo 'enable_nacl=false' | tee -a out/Default/args.gn \
  && gn args --list out/Default \
  && cat out/Default/args.gn \
  && ninja -C out/Default chrome \
  && ./out/Default/chrome -version \
  && sync

WORKDIR /usr/local/opt/${project}/src/${project}/src
RUN echo "# log: ${project}: Cleanup" \
  && set -x \
  && make checkinstall/debian \
  && dpkg --get-selections > ~/packages-post.lst \
  && diff -u ~/packages-pre.lst ~/packages-post.lst | tee packages.diff \
  && cat ~/packages-pre.lst ~/packages-post.lst  | sort -n | uniq -u | cut -f1 \
  | while read package ; do apt-get remove ${package} -y ; done \
  && install *.deb /usr/local/opt/${project} \
  && rm -rf /usr/local/opt/${project}/src \
  && sync

WORKDIR /usr/local/opt/${project}
RUN echo "# log: ${project}: Installing" \
  && dpkg -i --force-all *.deb \
  && sudo apt-get install -f -y \
  && dpkg -i *.deb \
  && apt-get clean \
  && sync

ENTRYPOINT [ "/usr/lib/castanets/chrome" ]
CMD [ "--version" ]
