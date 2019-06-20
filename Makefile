#!/bin/make -f
# -*- makefile -*-
# SPDX-License-Identifier: Apache-2.0
# Copyright: 2018-present Samsung Electronics France SAS, and contributors

default: help iotjs/run

example_file=index.js
runtime?=iotjs
iotjs_modules_dir?=${CURDIR}/iotjs_modules

eslint_file?=node_modules/eslint/bin/eslint.js
port?=8886
base_url?=http://localhost:${port}

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
base_topic=io.github.rzr
pub_topic=${base_topic}/relay/0/set
sub_topic=${base_topic}/data
run_args+=${port}
run_args+=${mqtt_host}


help:
	@echo "Usage:"
	@echo "# make run"

${webthing-iotjs_dir}: # Makefile
	rm -rf $@
	git clone --recursive --depth 1 ${webthing-iotjs_url} -b ${webthing-iotjs_revision} $@
	make -C $@ deploy deploy_modules_dir=${iotjs_modules_dir}

iotjs_modules: ${iotjs_modules}
	mkdir -p $@
	ls $@

iotjs/start: ${example_file} ${iotjs_modules_dirs}
	iotjs $< ${run_args}

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

start: ${runtime}/start
	sync

client/sub:
	mosquitto_sub -h "${mqtt_host}" -t "${sub_topic}"

client/pub:
	mosquitto_pub -h "${mqtt_host}" -p 1883  -t "${pub_topic}" -m "0"
	sleep 1
	mosquitto_pub -h "${mqtt_host}" -p 1883  -t "${pub_topic}" -m "1"

client/pub/test:
	mosquitto_pub -h "${mqtt_host}" -p 1883  -t "${sub_topic}" -m "{}"
