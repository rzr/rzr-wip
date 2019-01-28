#!/bin/make -f
# -*- makefile -*-
# SPDX-License-Identifier: Apache-2.0
# Copyright: 2018-present Samsung Electronics France SAS, and contributors


base_url?=http://localhost:8888
webthing_url?=https://github.com/rzr/webthing-iotjs

iotjs_modules/webthing-iotjs:
	@mkdir -p $@
	git clone --depth 1 --recursive ${webthing_url} $@

iotjs_modules/webthing-iotjs/%: iotjs_modules/webthing-iotjs
	@ls $@

iotjs/run: index.js iotjs_modules/webthing-iotjs/index.js
	iotjs $<
#	IOTJS_EXTRA_MODULE_PATH=../.. 

iotjs/debug:
#	rm -rf node_modules
	NODE_PATH=iotjs_modules:../.. node index.js

test:
	curl ${base_url}
	@echo
	curl ${base_url}/properties
	@echo
	curl ${base_url}/properties/level
	@echo
	curl -H "Content-Type: application/json" -X PUT --data '{"level": 42}' http://localhost:8888/properties/level
	curl ${base_url}/properties/level
	@echo

node_modules: package.json
	npm install

node/run: node_modules
	npm start

run: iotjs/run
	@echo "# $@: $^"

cleanall:
	rm -rf iotjs_modules node_modules
