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

machine?=stm32f4dis
nuttx_config?=nucleo-f303re/hello

machine?=stm32f767zi
nuttx_url?=https://bitbucket.org/nuttx/nuttx
nuttx_config?=nucleo-f767zi/nsh

iotjs_dir=iotjs
IOTJS_ROOT_DIR="${iotjs_dir}"
export IOTJS_ROOT_DIR
IOTJS_ABSOLUTE_ROOT_DIR="${CURDIR}/${iotjs_dir}"
export IOTJS_ABSOLUTE_ROOT_DIR

${nuttx_dir}:
	git clone --depth 1 --recursive ${nuttx_url}
	ls $@
apps:
	git clone --depth 1 --recursive https://bitbucket.org/nuttx/apps
	ls $@

stlink:
	git clone --depth 1 --recursive https://github.com/texane/stlink
	ls $@

iotjs:
	git clone --depth 1 --recursive https://github.com/Samsung/iotjs
	ls $@

st-flash: stlink
	make -C $< || cat $</build/Release/CMakeFiles/CMakeError.log
	find . -iname "st-flash"

help:
	echo TODO

setup/stlink: stlink
	make -C $<

setup/debian:
	sudo apt-get update -y 
	sudo apt-get install -y \
gcc-arm-none-eabi \
git \
make \
sudo \
libusb-dev \
stlink-tools \
screen \
#EOL

nuttx/%: nuttx
	ls $@

nuttx/.config: nuttx/tools/configure.sh apps/system/iotjs
	cd ${@D} && ${CURDIR}/$< ${nuttx_config}
	ls $<

configure: nuttx/.config
	ls $<

build/base: nuttx/.config
	which arm-none-eabi-gcc || sudo apt-get install gcc-arm-none-eabi
	${MAKE} \
 IOTJS_ABSOLUTE_ROOT_DIR=${IOTJS_ABSOLUTE_ROOT_DIR} \
 IOTJS_ROOT_DIR=../${IOTJS_ROOT_DIR} \
 -C ${nuttx_dir}

iotjs/build/arm-nuttx/debug/lib/%: iotjs/build
	ls $@

build: nuttx/.config build/base iotjs/build
	which arm-none-eabi-gcc || sudo apt-get install gcc-arm-none-eabi
	${MAKE} \
 IOTJS_ABSOLUTE_ROOT_DIR=${IOTJS_ABSOLUTE_ROOT_DIR} \
 IOTJS_ROOT_DIR=../${IOTJS_ROOT_DIR} \
 -C ${nuttx_dir}

${image_file}: build
	ls -l $@

prep: nuttx apps stlink patch
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
	make -C ${<D} ${@}

apps/system/iotjs: iotjs apps
	@mkdir -p $@
	cp -rf iotjs/config/nuttx/stm32f4dis/app/* $@/

meld: iotjs/config/nuttx/stm32f4dis/config.default nuttx/.config
	$@ $^

iotjs/build: iotjs/config/nuttx/stm32f4dis/config.default ${nuttx_dir}
	cd iotjs && ./tools/build.py \
--target-arch=arm \
--target-os=nuttx \
--nuttx-home=../${nuttx_dir} \
--target-board=${machine} \
--jerry-heaplimit=78

iotjs/clean:
	rm -rf iotjs/build

devel: menuconfig build run


tmp/done/patch/iotjs/%: patches/iotjs/% iotjs
	cd iotjs && git am ${CURDIR}/$<
	mkdir -p ${@D}
	touch $@

tmp/done/patch/libtuv/%: patches/libtuv/% iotjs/deps/libtuv
	cd iotjs/deps/libtuv && patch -p1 < ${CURDIR}/$<
	mkdir -p ${@D}
	touch $@

patch/%: patches/% tmp/done/patch/%
	wc -l $<

patch: \
 tmp/done/patch/iotjs/0001-STM32F3-support.patch \
 tmp/done/patch/libtuv/0001-STM32F3-support.patch \
 # EOL
 # TODO: tmp/done/patch/iotjs/0002-wip.patch 
	ls $^

build/iotjs: apps/system/iotjs menuconfig build
