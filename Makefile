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

default: help iotjs/run
	@echo "log: $@: $^"

runtime?=iotjs
example_file=index.js
iotjs_modules_dir?=${CURDIR}/iotjs_modules

eslint_file?=node_modules/eslint/bin/eslint.js

port?=8888
base_url?=http://localhost:${port}

webthing_url?=https://github.com/rzr/webthing-iotjs
webthing-iotjs_url?=https://github.com/rzr/webthing-iotjs
#TODO: pin version
webthing-iotjs_revision?=master
webthing-iotjs_dir?=${iotjs_modules_dir}/webthing-iotjs
iotjs_modules_dirs+=${webthing-iotjs_dir}

node_modules+=node_modules/webthing-iotjs

deploy_modules_dir?=${CURDIR}/tmp/deploy/iotjs_modules
deploy_module_dir?= ${deploy_modules_dir}/${project}
deploy_dirs+= ${deploy_module_dir}
deploy_dirs+= ${deploy_modules_dir}/webthing-iotjs
deploy_srcs+= $(addprefix ${deploy_module_dir}/, ${srcs})

run_args+=${port}


help:
	@echo "Usage:"
	@echo "# make start"

${webthing-iotjs_dir}: # Makefile
	rm -rf $@
	git clone --recursive --depth 1 ${webthing-iotjs_url} -b ${webthing-iotjs_revision} $@
	make -C $@ deploy deploy_modules_dir=${iotjs_modules_dir}

iotjs/modules: ${iotjs_modules_dirs}
	ls $<

${deploy_module_dir}/%: %
	@echo "# TODO: minify: $< to $@"
	install -d ${@D}
	install $< $@

${deploy_modules_dir}/webthing-iotjs: ${iotjs_modules_dir}/webthing-iotjs
	make -C $< deploy deploy_modules_dir="${deploy_modules_dir}"

deploy: ${deploy_srcs} ${deploy_dirs}
	ls $<

iotjs/start: ${example_file} ${iotjs_modules_dirs}
	iotjs $< ${run_args}


iotjs/run: ${example} iotjs_modules
	iotjs $<

node/run: ${example} node_modules
	node $<

iotjs/debug: ${example}
	echo rm -rf node_modules
	NODE_PATH=iotjs_modules:../.. node 

test:
	curl ${base_url}
	@echo
	curl ${base_url}/properties

package.json:
	npm init

node_modules/%: package.json
	npm install

node_modules: package.json
	npm install

node/run: node_modules
	npm start

run: iotjs/run
	@echo "# $@: $^"

start: ${runtime}/start
	sync

cleanall:
	rm -rf iotjs_modules node_modules

${eslint_file}:
	npm install eslint --save-dev
	npm install babel-eslint --save-dev

eslint: ${eslint_file} .eslintrc.js
	${eslint_file} --no-color --fix .
	${eslint_file} --no-color .

lint: eslint

