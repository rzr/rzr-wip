#!/bin/make -f
# -*- makefile -*-
# SPDX-License-Identifier: Apache-2.0
# Copyright: 2018-present Samsung Electronics France SAS, and contributors

default: help iotjs/run

example?=index.js
eslint_file?=node_modules/eslint/bin/eslint.js
port?=8886
base_url?=http://localhost:${port}

runtime?=iotjs

webthing-iotjs_url?=https://github.com/rzr/webthing-iotjs
#TODO: pin version
webthing-iotjs_revision?=master
webthing-iotjs_dir?=${iotjs_modules_dir}/webthing-iotjs
iotjs_modules_dirs+=${webthing-iotjs_dir}



deploy_modules_dir?=${CURDIR}/tmp/deploy/iotjs_modules
deploy_module_dir?= ${deploy_modules_dir}/${project}
deploy_dirs+= ${deploy_module_dir}
deploy_dirs+= ${deploy_modules_dir}/webthing-iotjs
deploy_srcs+= $(addprefix ${deploy_module_dir}/, ${srcs})


help:
	@echo "Usage:"
	@echo "# make run"

${webthing-iotjs_dir}: Makefile
	rm -rf $@
	git clone --recursive --depth 1 ${webthing-iotjs_url} -b ${webthing-iotjs_revision} $@
	make -C $@ deploy deploy_modules_dir=${iotjs_modules_dir}

iotjs_modules: ${iotjs_modules}
	mkdir -p $@
	ls $@

iotjs/run: ${example} iotjs_modules
	iotjs $<

node_modules: ${node_modules}
	mkdir -p $@
	ls $@

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

cleanall:
	rm -rf iotjs_modules node_modules

${eslint_file}:
	npm install eslint --save-dev
	npm install babel-eslint --save-dev

eslint: ${eslint_file} .eslintrc.js
	${eslint_file} --no-color --fix .
	${eslint_file} --no-color .

lint: eslint

start: ${runtime}/run
	sync
