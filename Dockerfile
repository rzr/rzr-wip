#!/bin/echo docker build . -f
# -*- coding: utf-8 -*-
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions
# are met:
#
# 1. Redistributions of source code must retain the above copyright
#    notice, this list of conditions and the following disclaimer.
# 2. Redistributions in binary form must reproduce the above copyright
#    notice, this list of conditions and the following disclaimer in
#    the documentation and/or other materials provided with the
#    distribution.
# 3. Neither the name NuttX nor the names of its contributors may be
#    used to endorse or promote products derived from this software
#    without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
# FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
# COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
# INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
# BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS
# OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
# AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
# LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
# ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
# POSSIBILITY OF SUCH DAMAGE.
#
############################################################################

FROM debian:testing
MAINTAINER Philippe Coval (philippe.coval@osg.samsung.com)

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
  && sync

ENV project rzr-wip

RUN echo "#log: Preparing system for ${project}" \
  && set -x \
  && apt-get update -y \
  && apt-get install -y \
  bash \
  cmake \
  debian-archive-keyring \
  debian-keyring \
  git \
  make \
  screen \
  sudo \
  usbutils \
  && apt-get clean \
  && sync

ADD https://github.com/TizenTeam/kconfig-frontends/archive/sandbox/pcoval/on/master/devel.tar.gz /usr/local/src/kconfig-frontends_0.0.0.orig.tar.gz
WORKDIR /usr/local/src/
RUN echo "#log: ${project}: Setup system" \
  && set -x \
  && cd /usr/local/src/ \
  && ls -l \
  && tar xvfz kconfig-frontends*.tar.gz \
  && cd /usr/local/src/kconfig-frontends*/debian/.. \
  && ./debian/rules \
  && debi \
  && sync

ARG app
ENV app ${app:-base}

ARG machine
ENV machine ${machine:-qemu}

ADD . /usr/local/src/${project}
WORKDIR /usr/local/src/${project}
RUN echo "#log: ${project}: Setup system" \
  && set -x \
  && make setup/debian \
  && sync

WORKDIR /usr/local/src/${project}
RUN echo "#log: ${project}: Setup system" \
  && set -x \
  && make all \
  && sync

WORKDIR /usr/local/src/${project}
ENTRYPOINT [ "/usr/bin/make" ]
CMD [ "run" ]
