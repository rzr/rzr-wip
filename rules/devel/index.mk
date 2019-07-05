#!/bin/make -f
# -*- makefile -*-
# SPDX-License-Identifier: Apache-2.0
#{
# Copyright 2018-present Samsung Electronics France SAS, and other contributors
#}

#main_project?=webthing-iotjs
main_project?=twins
iotjs_machine?=stm32f7nucleo

nuttx_dev_id?=066EFF323535474B43065221
nuttx_deploy_dir?=/media/${USER}/NODE_F767ZI1/
nuttx_revision?=master
nuttx_apps_revision?=master

#nuttx_url?=file:///home/${USER}/mnt/nuttx/
#nuttx_revision?=sandbox/rzr/devel/${iotjs_machine}/master
#nuttx_revision?=sandbox/rzr/review/master
#nuttx_revision?=a54f9d5b2af681255ac4e6bfe9b7cd29efdc9768

#nuttx_revision?=nuttx-7.30

#iotjs_url?=https://github.com/tizenteam/iotjs
#iotjs_url?=file:///home/${USER}/mnt/iotjs
#iotjs_revision?=sandbox/rzr/${iotjs_machine}/master

#webthing-iotjs_url?=https://github.com/tizenteam/webthing-iotjs
#webthing-iotjs_url?=file:///home/${USER}/mnt/webthing-iotjs
#webthing-iotjs_revision?=sandbox/rzr/devel/master
#webthing-iotjs_revision?=sandbox/rzr/next/master
#webthing-iotjs_revision?=sandbox/rzr/master


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
