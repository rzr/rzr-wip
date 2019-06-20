#!/bin/make -f
# -*- makefile -*-
# SPDX-License-Identifier: Apache-2.0
# Copyright: 2018-present Samsung Electronics France SAS, and contributors

default: help iotjs/run
	sync

example_file=index.js
runtime?=iotjs
iotjs_modules_dir?=${CURDIR}/iotjs_modules

base_url?=http://localhost:8888
webthing_url?=https://github.com/rzr/webthing-iotjs

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
#mqtt_host = 'broker.hivemq.com'

mqtt_host=localhost
mqtt_port=1883
mqtt_base_topic=io.github.rzr

run_args+=${port}
run_args+=${mqtt_base_topic}
run_args+=${mqtt_host}
run_args+=${mqtt_port}

help:
	@echo "Usage:"
	@echo "# make start"

${webthing-iotjs_dir}: # Makefile
	rm -rf $@
	git clone --recursive --depth 1 ${webthing-iotjs_url} -b ${webthing-iotjs_revision} $@
	make -C $@ deploy deploy_modules_dir=${iotjs_modules_dir}

iotjs_modules: ${iotjs_modules}
	mkdir -p $@
	ls $@

iotjs/start: ${example_file} ${iotjs_modules_dirs}
	iotjs $< ${run_args}

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

start: ${runtime}/start
	sync

cleanall:
	rm -rf iotjs_modules node_modules
