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

default: help
	sync

V?=1
export V

#machine?=stm32f767zi
machine?=stm32f7nucleo

nuttx_dir?=nuttx
#nuttx_url?=https://bitbucket.org/nuttx/nuttx
#nuttx_branch?=master
nuttx_url?=file:///${HOME}/mnt/nuttx
nuttx_branch?=sandbox/rzr/review/master
#nuttx_branch=sandbox/rzr/devel/${machine}/master
#nuttx_branch=sandbox/rzr/devel/stm32f7/master
#nuttx_config?=nucleo-144/f767-netnsh
nuttx_config?=nucleo-144/f767-nsh
nuttx_config_file=${nuttx_dir}/.config
nuttx_defconfig_file=${nuttx_dir}/configs/${nuttx_config}/defconfig
#nuttx_config?=stm32f7nucleo/nsh


image_file?=nuttx/nuttx.bin
monitor_rate?=115200

#LDSCRIPT ?= f767-flash.ld
#machine?=stm32f4dis
#nuttx_config?=nucleo-f303re/hello



-include rules/st.mk

${nuttx_dir}:
	ls $@ || git clone --recursive --branch ${nuttx_branch} ${nuttx_url} 
	ls $@
#	# --depth 1

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

nuttx/%: ${nuttx_dir}
	ls $@

nuttx/.config: nuttx/tools/configure.sh apps
	cd ${@D} && ${CURDIR}/$< ${nuttx_config}
	ls $<
	grep -i BOARD $@


rule/nuttx/configure: nuttx/tools/configure.sh apps
	cd ${nuttx_dir} && bash -x ${CURDIR}/$< ${nuttx_config}
	grep -i BOARD ${nuttx_config_file}

meld:
	meld 


configure: nuttx/.config
	ls $<

reconfigure:
	mv nuttx/.config 

rule/nuttx/build: nuttx/Make.defs
	which arm-none-eabi-gcc || sudo apt-get install gcc-arm-none-eabi
	${MAKE} -C ${<D} # LDSCRIPT=f767-flash.ld

#nuttx: rule/nuttx/build

${image_file}: build
	ls -l $@

prep: nuttx apps patch
	sync

all: prep configure build

run: deploy monitor

docker/run:
	docker-compose up ||:
	docker build -t "rzrwip_default" .
	docker run --privileged --rm -ti "rzrwip_default" run

menuconfig:
	ls nuttx/Kconfig
#	ls nuttx/.config || make configure
#	ls nuttx/.config
	make -C nuttx ${@}

#meld: iotjs/config/nuttx/stm32f4dis/config.default nuttx/.config
#	$@ $^

patch/%: patches/% tmp/done/patch/%
	wc -l $<

patch:
	ls $^

rule/nuttx/%:
	make -C ${nuttx_dir} ${@F}

rule/%: nuttx
	make rule/nuttx/${@F}


rule/nuttx/diff:
	ls nuttx/.config.old nuttx/.config
	diff nuttx/.config.old nuttx/.config


distclean: rule/nuttx/distclean
	find . -iname "*.a" -exec rm {} \;
#	rm -fv nuttx/staging/*.a
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

include rules/iotjs/index.mk

include rules/devel/index.mk


#  make -C apps Kconfig
# make -C apps Kconfig TOPDIR=$CURDIR/nuttx
# make -C apps system/Kconfig TOPDIR=$CURDIR/nuttx APPDIR=$CURDIR/apps
