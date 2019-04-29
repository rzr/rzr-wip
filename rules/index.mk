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
	@echo "# make devel"
	@echo "# nuttx_defconfig_file=${nuttx_defconfig_file}"

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


build: rule/nuttx/build


#  make -C apps Kconfig
# make -C apps Kconfig TOPDIR=$CURDIR/nuttx
# make -C apps system/Kconfig TOPDIR=$CURDIR/nuttx APPDIR=$CURDIR/apps

monitor: ${monitor_file} # deploy
	echo "# TODO: use C-a k to quit"
	sleep 1
	${sudo} screen $< ${monitor_rate}

${monitor_file}:
	lsusb
	ls $@

menuconfig: rule/nuttx/menuconfig rule/nuttx/savedefconfig
	ls ${nuttx_config_file}

-include rules/devel/index.mk
-include rules/iotjs/index.mk


