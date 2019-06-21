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
nuttx_rc_file=rules/twins/rcS.template
gateway_host=gateway.local

twins_url?=https://github.com/rzr/twins
twins_branch?=master
twins_dir?=twins
#TODO: rename
make?=make -f rules/twins/index.mk
twins_deploy_files?=$(shell ls rules/twins/*.js | sort)

rule/twins/help:
	@echo "# make rule/twins/devel"
	@echo "# make rule/twins/prep"

rule/twins/prep: rules/twins/rcS.template rule/twins/romfs
	ls $<

rule/twins/devel: rule/nuttx/cleanall rule/twins/prep rule/iotjs/devel
	sync


${twins_dir}: rules/webthing-iotjs
	rm -rf $@
	make -C ${webthing-iotjs_dir} deploy deploy_modules_dir=${@}
	cp -av $</*.js $@
	cp -av $</*.json $@

${twins_dir}:
	mkdir -p ${@D}
	git clone ${twins_url} --branch ${twins_branch} --depth 1 $@


${deploy_modules_dir}: ${twins_dir}
	make -C $< deploy deploy_modules_dir=$@

rule/twins/deploy: ${deploy_modules_dir}
	make -C twins/iotjs_modules/webthing-iotjs deploy \
 deploy_modules_dir=$</webthing-iotjs/example/platform/iotjs_modules
	@echo "TODO"
	install rules/twins/stm32.js $</webthing-iotjs/example/platform/board/
	install rules/twins/index.js $</
	du -ksc $<

rule/twins/deploy/clean: ${deploy_modules_dir} rule/twins/deploy 
	du -ksc $<
	rm -rfv $</webthing-iotjs/example
	du -ksc $<

rule/twins/romfs: ${nuttx_romfs_dir} ${twins_deploy_files}
	${make} rule/twins/deploy deploy_modules_dir="$</iotjs_modules"
	install ${twins_deploy_files} ${<}
	rm -rfv ${nuttx_romfs_img_file}
	${make} rule/nuttx/romfs.img

iotjs/start: ${example_file}
	cd ${<D} && iotjs ${<F}


rule/twins/property/%:
	curl ${target_url}/properties/${@F}
	curl -X PUT -d '{ "${@F}": ${value} }' ${target_url}/properties/${@F}
	sleep 2

rule/twins/test/%:
	curl -X PUT -d '{ "${@F}": -90 }' ${target_url}/properties/${@F}
	sleep 1
	curl -X PUT -d '{ "${@F}": 90 }' ${target_url}/properties/${@F}
	sleep 1

rule/twins/test: \
 rule/twins/test/torso \
 rule/twins/test/shoulder \
 rule/twins/test/arm \
 rule/twins/test/hand \
 #eol


rule/twins/robot:
	curl ${target_url}/properties
	${make} ${@D}/property/torso value=0
	${make} ${@D}/property/shoulder value=0
	${make} ${@D}/property/arm value=0
	${make} ${@D}/property/hand value=0
	${make} ${@D}/torso
	${make} ${@D}/shoulder
	${make} ${@D}/arm
	${make} ${@D}/hand

rule/twins/%:
	${make} rule/twins/property/${@F} value=0
	${make} rule/twins/property/${@F} value=-90
	${make} rule/twins/property/${@F} value=0
	${make} rule/twins/property/${@F} value=90
	${make} rule/twins/property/${@F} value=0

rule/twins/shoulder: #[ -90, 45]
	${make} rule/twins/property/shoulder value=-90
	${make} rule/twins/property/shoulder value=10
	${make} rule/twins/property/shoulder value=30
	${make} rule/twins/property/shoulder value=45
	${make} rule/twins/property/shoulder value=0

rule/twins/arm: # [-45 +45]
	${make} rule/twins/property/${@F} value=0
	${make} rule/twins/property/${@F} value=45
	${make} rule/twins/property/${@F} value=-45
	${make} rule/twins/property/${@F} value=0

rule/twins/hand: # [0 45]
	${make} rule/twins/property/${@F} value=0
	${make} rule/twins/property/${@F} value=40
#	${make} rule/twins/property/${@F} value=10
	${make} rule/twins/property/${@F} value=-5
	${make} rule/twins/property/${@F} value=0

rule/twins/demo:
	${make} rule/twins/property/hand value=0
	${make} rule/twins/property/hand value=20
	${make} rule/twins/property/arm value=15
	${make} rule/twins/property/shoulder value=-20
	${make} rule/twins/property/shoulder value=-40
	${make} rule/twins/property/shoulder value=-60
	${make} rule/twins/property/hand value=-5
	${make} rule/twins/property/shoulder value=45
	${make} rule/twins/property/arm value=10
	${make} rule/twins/property/arm value=-15
