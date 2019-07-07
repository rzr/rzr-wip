##!/bin/make -f
# -*- makefile -*-
# SPDX-License-Identifier: MPL-2.0
#{
# Copyright 2018-present Samsung Electronics France SAS, and other contributors
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.*
#}

project=twins

target_host?=TODO.target.host
target_url?=http://${target_host}:8888

#TODO
#twins_deploy_dir?=${twins_www_dir}
twins_deploy_dir?=${CURDIR}/tmp/deploy
deploy_modules_dir=${twins_deploy_dir}/iotjs_modules
example_file=${twins_deploy_dir}/index.js
nuttx_rc_file=rules/twins/rcS.template.sh
gateway_host=gateway.local

twins_url?=https://github.com/rzr/twins
twins_revision?=v0.0.1
twins_dir?=deps/twins
#TODO: rename
twins_make?=make -f rules/twins/index.mk
twins_deploy_files?=$(shell ls rules/twins/*.js | sort)

rule/twins/help:
	@echo "# make rule/twins/devel"
	@echo "# make rule/twins/prep"

rule/twins/prep: rules/twins/rcS.template.sh rule/twins/romfs
	ls $<

rule/twins/devel: rule/nuttx/cleanall rule/twins/prep rule/iotjs/devel
	sync

${twins_dir}: rules/webthing-iotjs
	rm -rf $@
	make -C ${webthing-iotjs_dir} deploy deploy_modules_dir=${@}
	cp -av $</*.js $@
	cp -av $</*.json $@

${twins_dir}:
	@mkdir -p "${@D}"
	git clone --branch "${twins_revision}" --depth 1 "${twins_url}" "$@"


${deploy_modules_dir}: ${twins_dir}
	make -C $< deploy deploy_modules_dir=$@

rule/twins/deploy: ${deploy_modules_dir} ${twins_dir}
	make -C ${twins_dir}/iotjs_modules/webthing-iotjs deploy \
 deploy_modules_dir=$</webthing-iotjs/example/platform/iotjs_modules
	@echo "TODO"
#	install rules/stm32/stm32.js $</webthing-iotjs/example/platform/board/
	install rules/twins/index.js $</
	du -ksc $<

rule/twins/deploy/clean: ${deploy_modules_dir} rule/twins/deploy 
	du -ksc $<
	rm -rfv $</webthing-iotjs/example
	du -ksc $<

rule/twins/romfs: ${nuttx_romfs_dir} ${twins_deploy_files}
	${twins_make} rule/twins/deploy deploy_modules_dir="$</iotjs_modules"
	install ${twins_deploy_files} ${<}
	rm -rfv ${nuttx_romfs_img_file}
	${twins_make} rule/nuttx/romfs.img
