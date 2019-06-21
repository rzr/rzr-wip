#!/bin/make -f
# -*- makefile -*-
# SPDX-License-Identifier: MPL-2.0
#{
# Copyright 2018-present Samsung Electronics France SAS, and other contributors
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.*
#}

default: help
	sync

V?=1
export V

make?=make -C rules
export make

-include rules/devel/index.mk
-include rules/st.mk
-include rules/nuttx/index.mk

main_project=stm32

help:
	@echo "# make devel"
	@echo "# nuttx_defconfig_file=${nuttx_defconfig_file}"

setup/debian:
	sudo apt-get update -y 
	sudo apt-get install -y \
gcc-arm-none-eabi \
git \
libusb-dev \
make \
screen \
sudo \
#EOL


configure: nuttx/.config
	ls $<

reconfigure:
	mv nuttx/.config 

prep: nuttx apps patch
	sync

all: prep configure build

run: deploy monitor
	sync

build: rule/nuttx/build

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
-include rules/webthing-iotjs/index.mk
-include rules/${main_project}/index.mk

deploy: rule/nuttx/deploy
	sync
