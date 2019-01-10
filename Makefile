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

V?=1
export V

machine?=stm32f767zi
nuttx_dir?=nuttx
nuttx_config?=nucleo-f767zi/nsh
nuttx_url?=file:///${HOME}/mnt/nuttx
nuttx_url?=https://bitbucket.org/nuttx/nuttx
nuttx_branch=sandbox/rzr/devel/stm32f7/master


image_file?=nuttx/nuttx.bin
monitor_rate?=115200

LDSCRIPT ?= f767-flash.ld
#machine?=stm32f4dis
#nuttx_config?=nucleo-f303re/hello



-include rules/st.mk

${nuttx_dir}:
	git clone --depth 1 --recursive --branch ${nuttx_branch} ${nuttx_url} 
	ls $@
apps:
	git clone --depth 1 --recursive https://bitbucket.org/nuttx/apps
	ls $@

help:
	echo " make devel"

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


rule/nuttx/diff:
	ls nuttx/.config.old nuttx/.config
	diff nuttx/.config.old nuttx/.config

configure: nuttx/.config
	ls $<

build: nuttx/Make.defs
	which arm-none-eabi-gcc || sudo apt-get install gcc-arm-none-eabi
	${MAKE} -C ${<D} LDSCRIPT=f767-flash.ld

${image_file}: build
	ls -l $@

prep: nuttx apps patch
	sync

stm32/deploy: ${image_file} ${st-flash}
	-lsusb # 0483:374b STMicroelectronics ST-LINK/V2.1 (Nucleo-F103RB)
	${st-flash} write ${image_file} 0x8000000


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

dev_file?=/dev/disk/by-id/usb-MBED_microcontroller_066EFF323535474B43065221-0:0

deploy:
	ls -l ${dev_file}
	sudo umount -f ${dev_file} || echo $$?
	udisksctl mount -b ${dev_file} ||:
	cp -av nuttx/nuttx.bin /media/philippe/NODE_F767ZI1/
	sleep 10

monitor: /dev/ttyACM0 # deploy
	${sudo} screen $< ${monitor_rate}

devel: menuconfig build deploy monitor


ref_file?=./nuttx/configs/stm32f746g-disco/nsh-ethernet/defconfig
ref_file?=./nuttx/configs/stm32f769i-disco/nsh-ethernet/defconfig 

diff: ${nuttx_dir}
	meld ${ref_file} \
./nuttx/configs/${nuttx_config}/defconfig


