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


-include rules/st.mk
-include rules/nuttx/index.mk

help:
	@echo " make devel"

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


configure: nuttx/.config
	ls $<

reconfigure:
	mv nuttx/.config 

prep: nuttx apps patch
	sync

all: prep configure build

run: deploy monitor

docker/run:
	docker-compose up ||:
	docker build -t "rzrwip_default" .
	docker run --privileged --rm -ti "rzrwip_default" run

patch/%: patches/% tmp/done/patch/%
	wc -l $<

patch:
	ls $^

distclean: rule/nuttx/distclean
	find . -iname "*.a" -exec rm {} \;
#	rm -fv nuttx/staging/*.a
	sync


build: rule/nuttx/build

rule/nuttx/devel: rule/nuttx/menuconfig build deploy monitor rule/nuttx/savedefconfig
	@echo "#TODO: # cp -av ${nuttx_dir}/.config ${nuttx_defconfig_file}"



#  make -C apps Kconfig
# make -C apps Kconfig TOPDIR=$CURDIR/nuttx
# make -C apps system/Kconfig TOPDIR=$CURDIR/nuttx APPDIR=$CURDIR/apps

monitor: /dev/ttyACM0 # deploy
	echo "# TODO: use C-a k to quit"
	sleep 10
	${sudo} screen $< ${monitor_rate}


menuconfig: rule/nuttx/menuconfig




include rules/devel/index.mk

meld: ${nuttx_dir}/configs/nucleo-144/f767-nsh/defconfig \
 ${nuttx_dir}/configs/nucleo-144/f767-netnsh/defconfig 
	meld $^

devel: rule/nutt/devel

#include rules/iotjs/index.mk
