#!/bin/make -f
# -*- makefile -*-
# SPDX-License-Identifier: Apache-2.0
# Copyright: 2018-present Samsung Electronics France SAS, and contributors

default: help iotjs/run

example?=index.js
eslint_file?=node_modules/eslint/bin/eslint.js
port?=8888
base_url?=http://localhost:${port}
webthing_url?=https://github.com/rzr/webthing-iotjs

iotjs_modules+=iotjs_modules/webthing-iotjs
node_modules+=node_modules/webthing-iotjs

help:
	@echo "Usage:"
	@echo "# make run"

iotjs_modules/webthing-iotjs/%:
	@mkdir -p iotjs_modules/webthing-iotjs
	git clone --depth 1 --recursive ${webthing_url} iotjs_modules/webthing-iotjs

iotjs_modules/webthing-iotjs: iotjs_modules/webthing-iotjs/index.js
	@ls $@


iotjs_modules: ${iotjs_modules}
	mkdir -p $@
	ls $@

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

cleanall:
	rm -rf iotjs_modules node_modules

${eslint_file}:
	npm install eslint --save-dev
	npm install babel-eslint --save-dev

eslint: ${eslint_file} .eslintrc.js
	${eslint_file} --no-color --fix .
	${eslint_file} --no-color .

lint: eslint

