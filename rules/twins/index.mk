#!/bin/make -f
# -*- makefile -*-
# SPDX-License-Identifier: Apache-2.0
# Copyright 2018-present Samsung Electronics France SAS, and other contributors

rule/twins/default: rules/twins/help
	@echo "# $@: $^"


project?=twins

twins_url?=https://github.com/rzr/twins
twins_revision?=v0.0.1
twins_dir?=deps/twins
# TODO: check tmp dir
twins_deploy_dir?=${CURDIR}/tmp/deploy
twins_deploy_files?=$(shell ls rules/twins/*.js | sort)
twins_example_src_file?=rules/twins/index.js
twins_nuttx_rc_file?=rules/twins/rcS.template.sh

# TODO: rename
deploy_modules_dir=${twins_deploy_dir}/iotjs_modules
example_file?=${twins_example_src_file}
example_file=${twins_deploy_dir}/index.js
nuttx_rc_file=${twins_nuttx_rc_file}


rule/twins/help:
	@echo "# make rule/twins/devel"
	@echo "# make rule/twins/prep"

rule/twins/prep: ${twins_nuttx_rc_file} rule/twins/romfs
	ls $<

rule/twins/devel: rule/nuttx/cleanall rule/twins/prep rule/iotjs/devel
	@echo "# $@: $^"

rule/twins/all: rule/nuttx/cleanall rule/twins/prep rule/iotjs/all
	@echo "# $@: $^"

${twins_dir}: rules/twins/index.mk
	@rm -rf "$@/../twins"
	git clone \
  --recursive --branch "${twins_revision}" --depth 1 "${twins_url}" "${twins_dir}" \
 || git clone --recursive --branch "${twins_revision}" "${twins_url}" "${twins_dir}" \
 || git clone --recursive "${twins_url}" "${twins_dir}"
	cd "${twins_dir}" && git reset --hard "${twins_revision}"
	ls "$@"

${deploy_modules_dir}: ${twins_dir}
	${MAKE} -C "$<" deploy deploy_modules_dir="$@"

rule/twins/deploy: ${deploy_modules_dir} ${twins_dir} ${twins_example_src_file}
	@echo "TODO"
 #	make -C ${twins_dir}/iotjs_modules/webthing-iotjs deploy \
 #deploy_modules_dir=$</webthing-iotjs/example/platform/iotjs_modules
	install ${twins_example_src_file} $<
	du -ksc $<

rule/twins/deploy/clean: ${deploy_modules_dir} rule/twins/deploy 
	du -ksc $<
	@echo "TODO: Add rule to strip in module"
	rm -rfv $</webthing-iotjs/example
	du -ksc $<

rule/twins/romfs: ${nuttx_romfs_dir} ${twins_deploy_files}
	${MAKE} rule/twins/deploy deploy_modules_dir="$</iotjs_modules"
	install ${twins_deploy_files} ${<}
	rm -rfv ${nuttx_romfs_img_file}
	${MAKE} rule/nuttx/romfs.img

rule/twins/prep: rule/${os}/prep
	@echo "# $@: $^"
