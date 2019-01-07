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

default: help all
	sync

st-flash?=/usr/bin/st-flash
image_file?=nuttx/nuttx.bin
monitor_rate?=115200
nuttx_dir?=nuttx
V?=1
export V

#machine?=stm32f4dis
#nuttx_config?=nucleo-f303re/hello

machine?=stm32f767zi
nuttx_config?=nucleo-f767zi/nsh
nuttx_url?=file:///${HOME}/mnt/nuttx
nuttx_url?=https://bitbucket.org/nuttx/nuttx

-include rules/st.mk

${nuttx_dir}:
	git clone --depth 1 --recursive ${nuttx_url}
	ls $@
apps:
	git clone --depth 1 --recursive https://bitbucket.org/nuttx/apps
	ls $@



help:
	echo TODO

setup/debian:
	sudo apt-get update -y 
	sudo apt-get install -y \
gcc-arm-none-eabi \
git \
make \
sudo \
libusb-dev \
screen \
#EOL

nuttx/%: nuttx
	ls $@

nuttx/.config: nuttx/tools/configure.sh apps
	cd ${@D} && ${CURDIR}/$< ${nuttx_config}
	ls $<
	grep -i BOARD $@

configure: nuttx/.config
	ls $<

build/base: nuttx/.config
	which arm-none-eabi-gcc || sudo apt-get install gcc-arm-none-eabi
	${MAKE} -C ${<D}

build: nuttx/.config build/base
	which arm-none-eabi-gcc || sudo apt-get install gcc-arm-none-eabi
	${MAKE} \
 -C ${nuttx_dir}

${image_file}: build
	ls -l $@

prep: nuttx apps patch
	sync

deploy: ${image_file} ${st-flash}
	-lsusb # 0483:374b STMicroelectronics ST-LINK/V2.1 (Nucleo-F103RB)
	${st-flash} write ${image_file} 0x8000000

monitor: /dev/ttyACM0 deploy
	screen $< ${monitor_rate}

all: prep configure build

run: deploy monitor

docker/run:
	docker-compose up ||:
	docker build -t "rzrwip_default" .
	docker run --privileged --rm -ti "rzrwip_default" run

menuconfig: nuttx/Kconfig
	ls nuttx/.config || make configure
	ls nuttx/.config
	make -C ${<D} ${@}

meld: iotjs/config/nuttx/stm32f4dis/config.default nuttx/.config
	$@ $^

devel: menuconfig build run

patch/%: patches/% tmp/done/patch/%
	wc -l $<

patch:
	ls $^

rule/nuttx/%: nuttx
	make -C $< ${@F}

rule/%: nuttx
	make rule/nuttx/${@F}

distclean: rule/nuttx/distclean
	sync


