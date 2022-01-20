#!/bin/echo docker build . -f
#
# SPDX-License-Identifier: CC-BY-4.0
# SPDX-License-URL: https://spdx.org/licenses/CC-BY-4.0.html
# SPDX-FileCopyrightText: Huawei Inc.

FROM debian:11
LABEL maintainer="Philippe Coval (https://purl.org/rzr)"
ENV project oniro-presentations

ENV DEBIAN_FRONTEND noninteractive
ENV LC_ALL en_US.UTF-8
ENV LANG ${LC_ALL}

RUN echo "#log: Configuring locales" \
 && set -x \
 && apt-get update \
 && apt-get install -y locales \
 && echo "${LC_ALL} UTF-8" | tee /etc/locale.gen \
 && locale-gen ${LC_ALL} \
 && dpkg-reconfigure locales \
 && date -u

RUN echo "#log: Preparing system for ${project}" \
 && set -x \
 && apt-get update -y \
 && apt-get install -y \
  make \
  sudo \
  python3 \
 && date -u

ENV workdir /usr/local/opt/${project}/src/${project}
ADD Makefile ${workdir}/
WORKDIR ${workdir}

RUN echo "#log: Setup ${project}" \
 && set -x \
 && make help \
 && make setup/debian sudo="" \
 && make setup \
 && date -u

ADD . ${workdir}/
WORKDIR ${workdir}

RUN echo "#log: Building ${project}" \
 && set -x \
 && make \
 && date -u

WORKDIR "${workdir}"
ENTRYPOINT [ "/usr/bin/make" ]
CMD [ "run" ]
