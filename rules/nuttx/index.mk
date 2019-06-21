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


rule/nuttx/default: rule/nuttx/help
	sync

nuttx_platform?=nucleo-144
nuttx_config?=${nuttx_platform}/f767-netnsh
nuttx_dir?=nuttx
nuttx_url?=https://bitbucket.org/nuttx/nuttx
nuttx_branch?=master

nuttx_config_file=${nuttx_dir}/.config
nuttx_defconfig_file=${nuttx_dir}/configs/${nuttx_config}/defconfig

nuttx_apps_url?=https://bitbucket.org/nuttx/apps
nuttx_apps_dir?=apps
nuttx_configure?=${nuttx_dir}/tools/configure.sh

nuttx_include_file?=${nuttx_dir}/include/nuttx/config.h
nuttx_config_rc_file?=${nuttx_dir}/configs/${nuttx_platform}/include/rcS.template
nuttx_image_file?=${nuttx_dir}/nuttx.bin
nuttx_mkromfsimg?=${CURDIR}/nuttx/tools/mkromfsimg.sh

nuttx_romfs_file?=${nuttx_dir}/configs/${nuttx_platform}/include/nsh_romfsimg.h
nuttx_romfs_img_file?=${nuttx_dir}/rom.img
nuttx_romfs_dir?=${CURDIR}/${nuttx_romfs_img_file}.dir.tmp

# TODO: keep private in ~/
nuttx_dev_id?=TODO

#TODO: move to stm32
nuttx_deploy_dir?=/media/${USER}/NODE_TODO
nuttx_deploy_dev?=/dev/disk/by-id/usb-MBED_microcontroller_${nuttx_dev_id}-0:0
nuttx_deploy_delay?=6

machine?=stm32f7nucleo
monitor_rate?=115200
monitor_file?=$(shell ls /dev/ttyACM* | sort -n | tail -n1)

# TODO
image_file?=${nuttx_image_file}
apps_dir?=${nuttx_apps_dir} # TODO
configure?=${nuttx_configure}


rule/nuttx/help:
	@echo "Usage: "


${nuttx_apps_dir}: ${nuttx_dir}/Makefile
	mkdir -p ${@D}
	git clone --depth 1 --recursive ${nuttx_apps_url} $@
	ls $@

${nuttx_apps_dir}/%: ${nuttx_apps_dir}
	ls $@

${nuttx_dir}:
	mkdir -p ${@D}
	git clone --recursive  --depth 1 --branch ${nuttx_branch} ${nuttx_url} ${@}
	ls $@

${nuttx_dir}/Makefile: ${nuttx_dir}
	ls $@

rule/nuttx/configure: ${configure} ${nuttx_defconfig_file}
	ls -l $<
	cd ${nuttx_dir} && ${CURDIR}/$< ${nuttx_config}
	ls $<
	-grep -i "BOARD" ${nuttx_config_file}

${nuttx_dir}/Make.defs:
	ls ${@} || ${make} rule/nuttx/configure
	-ls $@

${nuttx_config_file}:
	ls ${@} || ${make} rule/nuttx/configure
	-ls $@

#${nuttx_dir}/.config: ${nuttx_dir}/Make.defs
#	ls $@ || ${MAKE} rule/nuttx/configure
#	ls $@

${nuttx_configure}: ${nuttx_apps_dir}/Makefile
	ls $@

${nuttx_include_file}: rule/nuttx/build
	ls $@

${nuttx_apps_dir}/Kconfig: #rule/nuttx/configure
	ls $@

#TODO
${CURDIR}/nuttx/.config: ${nuttx_dir}/.config
	ls $@

${nuttx_config_file}:

rule/nuttx/config: ${nuttx_config_file}
	ls $<


rule/nuttx/build: ${nuttx_dir}/Make.defs ${nuttx_dir}/Kconfig # rule/nuttx/roms
	@echo '#TODO: disabled by default: if romfs is not configured'
	which arm-none-eabi-gcc || sudo apt-get install gcc-arm-none-eabi
	${MAKE} -C ${<D} # LDSCRIPT=f767-flash.ld

${nuttx_image_file}: rule/nuttx/build
	ls -l $@

rule/nuttx/menuconfig: ${nuttx_config_file} #${nuttx_dir}/Make.defs apps/system/Kconfig
	cp -av ${nuttx_config_file} ${nuttx_config_file}._pre.tmp
	make -C ${nuttx_dir} ${@F}
	make -C ${nuttx_dir} savedefconfig
	cp -av ${nuttx_config_file} ${nuttx_config_file}._post.tmp
	-diff -u ${nuttx_config_file}._pre.tmp ${nuttx_config_file}._post.tmp | tee ${nuttx_config_file}.diff
	-diff -u ${nuttx_defconfig_file} ${nuttx_dir}/defconfig | tee ${nuttx_dir}/defconfig.diff

rule/nuttx/reconfigure: distclean rule/nuttx/menuconfig
	ls -l ${nuttx_config_file}

rule/nuttx/cleanall: rule/nuttx/clean
	rm -rf ${nuttx_dir}/rom.img
	rm -rf ${nuttx_dir}/rom.img.dir.tmp

${nuttx_dir}/defconfig: ${nuttx_dir}
	make -C $< savedefconfig

rule/nuttx/%: ${nuttx_dir}
	make -C $< ${@F}

rule/nuttx/%:
	make -C ${nuttx_dir} ${@F}

rule/nuttx/defconfig/diff: ${nuttx_dir}/defconfig ${nuttx_defconfig_file}
	meld $^

rule/nuttx/diff:
	ls ${nuttx_dir}/.config.old ${nuttx_dir}/.config
	diff ${nuttx_dir}/.config.old ${nuttx_dir}/.config

rule/nuttx/deploy: ${nuttx_image_file}
	-lsusb
	sudo sync
#	May contain % in file so it cant be used as dep
	ls -l ${nuttx_deploy_dev}
	-sudo umount -f ${nuttx_deploy_dev}
	-sudo umount -f ${nuttx_deploy_dir}
	-udisksctl mount -b ${nuttx_deploy_dev}
	cp -av $<  ${nuttx_deploy_dir}
	sleep ${nuttx_deploy_delay}

rule/nuttx/devel: rule/nuttx/menuconfig build rule/nuttx/deploy monitor rule/nuttx/savedefconfig
	@echo "#TODO: # cp -av ${nuttx_dir}/.config ${nuttx_defconfig_file}"

${nuttx_config_rc_file}: ${nuttx_rc_file}
	echo "#TTTTOL: $@"
	cp -av ${nuttx_rc_file} $@

#TODO

${nuttx_romfs_file}: ${nuttx_config_rc_file} ${nuttx_mkromfsimg}
	cd ${<D} && ../../../tools/mkromfsimg.sh -nofat  ../../../
	ls -l $@

#rule/nuttx/romfs: ${nuttx_romfs_file}
#	ls -l $<

${nuttx_romfs_dir}:  ${nuttx_dir}
	mkdir -p $@

${nuttx_romfs_img_file}: ${nuttx_romfs_dir}
	test -d $<
	genromfs -d "$<" -f $@
	ls $@

rule/nuttx/romfs.img: ${nuttx_romfs_img_file}
	ls $<

rule/nuttx/roms: ${nuttx_romfs_file} ${nuttx_romfs_img_file}
	ls $<

${nuttx_romfs_file}: ${nuttx_config_rc_file} ${nuttx_mkromfsimg}
	ls -l $<
	pwd ${<D}/../../../
	cd ${<D} && ${nuttx_mkromfsimg} -nofat  ../../..
# {nuttx_dir}
	ls -l $@

rule/nuttx/monitor: ${monitor_file} # deploy
	echo "# TODO: use C-a k to quit"
	sleep 1
	${sudo} screen $< ${monitor_rate}

${monitor_file}:
	lsusb
	ls $@

.PHONY: rule/nuttx/configure
