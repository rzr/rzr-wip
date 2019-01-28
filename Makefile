#!/bin/make -f
# -*- makefile -*-
# SPDX-License-Identifier: Apache-2.0
# Copyright: 2018-present Samsung Electronics France SAS, and contributors

default: help iotjs/run

example?=index.js

help:
	@echo "Usage:"
	@echo "# make run"

iotjs_modules:
	mkdir -p $@
	ls $@

iotjs/run: ${example} iotjs_modules
	iotjs $<

nodejs/run: ${example} nodejs_modules
	node $<

iotjs/debug: ${example}
	echo rm -rf node_modules
	NODE_PATH=iotjs_modules:../.. node 

test:

package.json:
	npm init

node_modules: package.json
	npm install

node/run: node_modules
	npm start

run: iotjs/run
	@echo "# $@: $^"

cleanall:
	rm -rf iotjs_modules node_modules
