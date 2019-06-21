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

nuttx_dev_id?=066EFF323535474B43065221
nuttx_deploy_dir?=/media/${USER}/NODE_F767ZI1/

iotjs_machine?=stm32f7nucleo


#iotjs_url?=https://github.com/tizenteam/iotjs
#iotjs_url?=file:///home/user/mnt/iotjs
#iotjs_branch?=sandbox/rzr/${iotjs_machine}/master

docker/run:
	docker-compose up ||:
	docker build -t "rzrwip_default" .
	docker run --privileged --rm -ti "rzrwip_default" run

patch/%: patches/% tmp/done/patch/%
	wc -l $<

patch:
	ls $^

clean:
	-find . -iname "*.a" -exec rm {} \;

distclean: clean
	-${MAKE} rule/nuttx/distclean
	sync

devel: rule/twins/devel
	sync
