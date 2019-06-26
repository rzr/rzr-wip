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

iotjs_machine?=${machine}
iotjs_machine_family?=stm32
iotjs_machine?=stm32f7nucleo
iotjs_reference_machine?=stm32f4dis
iotjs_dir=iotjs
iotjs_config_dir?=iotjs/config/nuttx/${iotjs_machine}
iotjs_config_file?=${iotjs_config_dir}/config.default
iotjs_nuttx_dir?=${nuttx_apps_dir}/system/iotjs
iotjs_app_dir?=iotjs/config/nuttx/${iotjs_reference_machine}/app/

iotjs_url?=https://github.com/Samsung/iotjs
iotjs_branch?=master
iotjs_lib_file?=iotjs/build/arm-nuttx/debug/lib/libiotjs.a
iotjs_nuttx_config_file?=${nuttx_config_file}._iotjs.config

iotjs_build_args?=\
 --target-arch=arm \
 --target-os=nuttx \
 --nuttx-home=../${nuttx_dir} \
 --target-board=${iotjs_machine} \
 --jerry-heaplimit=78 \
 --profile=config/nuttx/${iotjs_machine}/nuttx.profile \
 #eol

iotjs_build_args+=--buildtype=debug
iotjs_build_args+=--cmake-param="-DCMAKE_VERBOSE_MAKEFILE=ON"

#TODO
nuttx_rc_file?=rules/iotjs/rcS.template.sh

IOTJS_ROOT_DIR="${iotjs_dir}"
export IOTJS_ROOT_DIR
IOTJS_ABSOLUTE_ROOT_DIR="${CURDIR}/${iotjs_dir}"
export IOTJS_ABSOLUTE_ROOT_DIR


rule/iotjs/%:
	${make} %
	sync

rule/iotjs/nuttx/%: nuttx/%
	sync

rule/iotjs/devel: rule/nuttx/cleanall rule/iotjs/base rule/iotjs/lib rule/iotjs/link deploy monitor
	cp -a ${nuttx_dir}/defconfig rules/iotjs
	-git diff

${iotjs_dir}/%:
	git clone --recursive -b ${iotjs_branch} ${iotjs_url}
	@echo "TODO: --depth 1"
	ls $@

${iotjs_dir}: ${iotjs_app_dir}
	ls $^

rule/iotjs/nuttx/build: ${iotjs_nuttx_config_file} ${nuttx_defconfig_file}
	cp -av $< ${nuttx_config_file}
	${MAKE} rule/nuttx/roms rule/nuttx/build
	ls ${nuttx_romfs_file}

rule/iotjs/link: ${iotjs_nuttx_config_file} ${iotjs_lib_file} ${nuttx_apps_dir}/system/iotjs rule/nuttx/roms
	cp -av $< ${nuttx_config_file}
	@echo 'CONFIG_IOTJS=y' >> ${nuttx_config_file}
	${MAKE} \
 IOTJS_ABSOLUTE_ROOT_DIR=${IOTJS_ABSOLUTE_ROOT_DIR} \
 IOTJS_ROOT_DIR=../${IOTJS_ROOT_DIR} \
 -C ${nuttx_dir}

rule/iotjs/prep: rules/iotjs/rcS.template.sh ${nuttx_apps_dir}/system/iotjs/Kconfig
	ls $<

rules/iotjs/rcS.template.sh:
	echo "echo \"~~~ $(shell date -u)\"" > $@

#TODO
${iotjs_dir}/build/arm-nuttx/debug/lib/%: rule/iotjs/build
	ls $@

rule/iotjs/config: ${iotjs_dir}
	ls ${nuttx_dir}/.config
	make -C ${nuttx_dir} savedefconfig
	cp ${nuttx_dir}/.config ${iotjs_dir}/config/nuttx/${iotjs_machine}/config.default

rule/iotjs/configure: iotjs
	-rm ${nuttx_apps_dir}/Kconfig
	rm -rfv ${nuttx_dir}/.config
	cp -av ${iotjs_config_file} ${nuttx_config_file}
	${MAKE} menuconfig

rule/iotjs/configured: ${nuttx_config_file}
	grep 'CONFIG_NET_LOCAL=y' ${nuttx_config_file}

iotjs_defconfigs_files?=$(shell ls rules/iotjs/defconfig*.in | sort)

${iotjs_nuttx_config_file}: ${nuttx_config_file} ${iotjs_defconfigs_files}
	ls ${nuttx_config_file} || ${MAKE} ${nuttx_config_file} 
	cp -av ${nuttx_config_file} ${nuttx_config_file}._pre.tmp
#	cat ./rules/iotjs/defconfig.in >>  ${nuttx_config_file} # iotjs inspired stm32
#	cat ./rules/iotjs/defconfig-*.in >>  ${nuttx_config_file}
	cat ${iotjs_defconfigs_files} >>  ${nuttx_config_file}
	${MAKE} rule/iotjs/configured
	${MAKE} menuconfig
	${MAKE} rule/iotjs/configured
	-diff -u ${nuttx_dir}/defconfig ${iotjs_config_file} | tee ${iotjs_config_file}.diff.tmp
	grep -v 'CONFIG_IOTJS=y' ${nuttx_config_file} > $@
	grep 'CONFIG_NET_LOCAL=y' $@
	grep '^CONFIG_' rules/iotjs/defconfig* \
 | cut -d: -f2 \
 | grep -v 'CONFIG_IOTJS=y'\
 | while read line ; do grep "$${line}" $@ ; done
	ls $@

#${nuttx_config_file}: ${iotjs_nuttx_config_file}
#	cp -av $< $@

rule/iotjs/nuttx/configure: ${iotjs_nuttx_config_file}
	ls $<

rule/iotjs/base: rule/iotjs/prep
	${MAKE} rule/iotjs/nuttx/build

rule/iotjs/lib: ${nuttx_include_file} ${nuttx_config_file}._iotjs.config 
	cd ${iotjs_dir} && ./tools/build.py ${iotjs_build_args}

${iotjs_lib_file}: rule/iotjs/lib
	ls $@

rule/iotjs/menuconfig:
	ls ${nuttx_config_file}

${nuttx_apps_dir}/system/iotjs: iotjs ${nuttx_apps_dir}
	@mkdir -p $@
	cp -rf ${iotjs_app_dir}/* $@/
	make -C ${nuttx_apps_dir} Kconfig TOPDIR=${CURDIR}/${nuttx_dir}

${nuttx_apps_dir}/system/iotjs/%: ${nuttx_apps_dir}/system/iotjs
	ls $@

rule/iotjs/clean:
	rm -rf iotjs/build

rule/build/iotjs: ${nuttx_apps_dir}/system/iotjs menuconfig build

rule/iotjs/cleanall:
	rm -rf iotjs/build


apps/system/Kconfig: ${apps_dir}/Kconfig ${apps_dir}/system/iotjs/Kconfig
	ls $@

rule/iotjs/meld: iotjs/config/nuttx/${iotjs_machine}/config.alloptions
	meld $< ${nuttx_config_file}
	meld $< ${nuttx_defconfig_file}


rule/iotjs/stm32f4dis: iotjs/config/nuttx/stm32f4dis/config.alloptions
	meld $< ${nuttx_config_file}
	meld $< ${nuttx_defconfig_file}

rule/iotjs/devel: rule/iotjs/base rule/iotjs/lib rule/iotjs/link deploy monitor
	cp -a ${nuttx_dir}/defconfig rules/iotjs
	-git diff

rule/iotjs/distclean:
	rm -rf iotjs/build
	find . -iname "*.obj" -exec rm -v {} \;
	rm -rf ${nuttx_apps_dir}/system/iotjs/lib*.a

rule/iotjs/roms:
