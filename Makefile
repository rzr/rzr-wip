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
	echo "TODO"

st-flash?=/usr/bin/st-flash
image_file?=nuttx/nuttx.bin
monitor_rate?=115200

nuttx:
	git clone --depth 1 --recursive https://bitbucket.org/nuttx/nuttx
	ls $@

apps: nuttx
	git clone --depth 1 --recursive https://bitbucket.org/nuttx/apps
	ls $@

stlink:
	git clone --depth 1 --recursive https://github.com/texane/stlink
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
 aptitude \
 gcc-arm-none-eabi \
 git \
 make \
 sudo \
 libusb-dev \
 screen \
 # EOL
	sudo aptitude install -y \
 stlink-tools \
 kconfig-frontends \
# EOL


setup/debian/amd64/1.5.0+ds-2~bpo9+1:
	wget -c http://ftp.us.debian.org/debian/pool/main/s/stlink/libstlink1_${@F}_amd64.deb
	wget -c http://http.us.debian.org/debian/pool/main/s/stlink/stlink-tools_${@F}_amd64.deb
	sudo dpkg -i *.deb

dsc/stlink:
	sudo apt-get install libusb-1.0-0-dev libgtk-3-dev sudo devscripts cmake
	dget -xu http://deb.debian.org/debian/pool/main/s/stlink/stlink_1.5.0+ds-2~bpo9+1.dsc
	cd stlink* && debuild -uc -us && sudo debi

dsc/kconfig-frontends/4.11.0.1+dfsg-2:
	sudo apt-get install  flex bison gperf libncurses5-dev libglade2-dev
	dget -xu http://deb.debian.org/debian/pool/main/k/kconfig-frontends/kconfig-frontends_${@F}.dsc
	cd kconfig-frontends* && debuild -uc -us && sudo debi

dsc: dsc/kconfig-frontends/4.11.0.1+dfsg-2

nuttx/.config: nuttx/tools/configure.sh
	cd ${@D} && ${CURDIR}/$< nucleo-f303re/hello
	ls $<
	cp -av configs/F303/.config $@

configure: nuttx/.config
	ls $<

build: nuttx
	which arm-none-eabi-gcc || sudo apt-get install gcc-arm-none-eabi
	make -C $<

${image_file}: build
	ls $@

prep: nuttx apps stlink
	ls $^

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
clean:
	rm -f nuttx/.config

menuconfig: nuttx/Kconfig
	ls nuttx/.config || make configure
	make -C ${<D} ${@}
