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

main_project?=twins
os?=nuttx

-include rules/${os}/index.mk

-include rules/devel/index.mk
-include rules/iotjs/index.mk
#-include rules/webthing-iotjs/index.mk
-include rules/${main_project}/index.mk


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

deploy: rule/${os}/deploy
	sync

configure: nuttx/.config
	ls $<

reconfigure:
	mv nuttx/.config 

prep: nuttx apps patch
	sync

all: prep configure build
	sync

monitor: rule/${os}/monitor
	sync

run: deploy monitor
	sync

build: rule/${os}/build
	sync

menuconfig: rule/${os}/menuconfig rule/${os}/savedefconfig
	ls ${nuttx_config_file}

oldconfig: rule/${os}/oldconfig rule/${os}/savedefconfig
	ls ${nuttx_config_file}
