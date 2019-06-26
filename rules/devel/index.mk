#!/bin/make -f
# -*- makefile -*-
# SPDX-License-Identifier: Apache-2.0
#{
# Copyright 2018-present Samsung Electronics France SAS, and other contributors
#}

main_project?=webthing-iotjs
iotjs_machine?=stm32f7nucleo

nuttx_dev_id?=066EFF323535474B43065221
nuttx_deploy_dir?=/media/${USER}/NODE_F767ZI1/
#nuttx_url?=file:///home/${USER}/mnt/nuttx/
#nuttx_branch?=sandbox/rzr/devel/${iotjs_machine}/master
#nuttx_branch?=sandbox/rzr/review/master

#iotjs_url?=https://github.com/tizenteam/iotjs
#iotjs_url?=file:///home/${USER}/mnt/iotjs
#iotjs_branch?=sandbox/rzr/${iotjs_machine}/master

webthing-iotjs_url?=https://github.com/tizenteam/webthing-iotjs
webthing-iotjs_branch?=sandbox/rzr/devel/master

rule/docker/run:
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

devel: rule/${main_project}/devel
	sync
