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

www_host?=192.168.1.12
www_url?=http://${www_host}/~${USER}/${www_dir}
www_dir?=d
target_host?=192.168.1.13
target_url?=http://${target_host}:8888

webthing-iotjs_dir?=${CURDIR}/iotjs_modules/webthing-iotjs
webthing-iotjs_url?=https://github.com/rzr/webthing-iotjs
#TODO: pin version
webthing-iotjs_branch?=master
webthing_iotjs_www_dir?=${HOME}/public_html/${www_dir}

rule/webthing-iotjs/prep: rules/webthing-iotjs/rcS.template
	ls $<

rules/webthing-iotjs/rcS.template: rules/webthing-iotjs/rcS.template.in
	sed -e "s|\$${base_url}|${www_url}|g" < $< > $@
	cat $@

rule/webthing-iotjs/www: ${webthing_iotjs_www_dir}
	ls $^

${webthing_iotjs_www_dir}: rules/webthing-iotjs
	rm -rf $@
	cd ~/mnt/webthing-iotjs && make deploy deploy_modules_dir=${@}
	cp -av $</*.js $@
	cp -av $</*.json $@

rule/webthing-iotjs/www/wget:
	mkdir -p ${HOME}/public_html/tmp/wt
	cd ${HOME}/public_html/tmp/wt && \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/webthing.js && \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/index.js && \
wget https://raw.githubusercontent.com/SamsungInternet/iotjs-express/master/lib/express.js && \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/lib/property.js && \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/lib/server.js && \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/lib/thing.js && \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/lib/utils.js && \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/lib/value.js && \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/example/simplest-thing.js && \
wget https://raw.githubusercontent.com/SamsungInternet/iotjs-express/master/iotjs-express.js \
sync

rule/webthing-iotjs/devel: rule/webthing-iotjs/prep rule/webthing-iotjs/www rule/iotjs/devel
	sync

rule/webthing-iotjs/webpack: ${webthing_iotjs_www_dir}
	cd ${webthing_iotjs_www_dir} && ls package.json || npm init -y \
&& npm install --only=dev webpack-cli && npm install
	cd ${webthing_iotjs_www_dir} && npm run build

rule/webthing-iotjs/property/%:
	curl ${target_url}/properties/${@F}
	curl -X PUT -d '{ "${@F}": ${value} }' ${target_url}/properties/${@F}
	sleep 2


rule/webthing-iotjs/test/%:
	curl -X PUT -d '{ "${@F}": -90 }' ${target_url}/properties/${@F}
	sleep 1
	curl -X PUT -d '{ "${@F}": 90 }' ${target_url}/properties/${@F}
	sleep 1

rule/webthing-iotjs/test: rule/webthing-iotjs/test/angle

webthing_iotjs_make?=make -f rules/webthing-iotjs/index.mk

rule/webthing-iotjs/%:
	${webthing-iotjs_make} rule/webthing-iotjs/property/${@F} value=0

${webthing-iotjs_dir}:
	mkdir -p ${@D}
	git clone ${webthing-iotjs_url} --branch ${webthing-iotjs_branch} --depth 1 $@
