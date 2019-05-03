iotjs_machine?=${machine}
iotjs_machine_family?=stm32
iotjs_machine?=stm32f7nucleo
iotjs_reference_machine?=stm32f4dis
iotjs_dir=iotjs
iotjs_config_dir?=iotjs/config/nuttx/${iotjs_machine}
iotjs_config_file?=${iotjs_config_dir}/config.default
iotjs_nuttx_dir?=${nuttx_apps_dir}/system/iotjs
iotjs_app_dir?=iotjs/config/nuttx/${iotjs_reference_machine}/app/
IOTJS_ROOT_DIR="${iotjs_dir}"
export IOTJS_ROOT_DIR
IOTJS_ABSOLUTE_ROOT_DIR="${CURDIR}/${iotjs_dir}"
export IOTJS_ABSOLUTE_ROOT_DIR

iotjs_url?=https://github.com/Samsung/iotjs
iotjs_branch?=master

#TODO:
#iotjs_url=https://github.com/tizenteam/iotjs
#iotjs_branch=sandbox/rzr/review/master
iotjs_branch=sandbox/rzr/devel/master
#iotjs_branch=sandbox/rzr/devel/${iotjs_machine}/master
#iotjs_branch=sandbox/rzr/devel/${iotjs_machine}/good/master

#TODO:
iotjs_url=file:///${HOME}/mnt/iotjs
#iotjs_branch=sandbox/rzr/devel/${iotjs_machine}/master

iotjs_lib_file?=iotjs/build/arm-nuttx/debug/lib/libiotjs.a
iotjs_nuttx_config_file?=${nuttx_config_file}._iotjs.config

iotjs/%:
	git clone --recursive -b ${iotjs_branch} ${iotjs_url}
	@echo "TODO: --depth 1"
	ls $@

iotjs: ${iotjs_app_dir}
	ls $^

rule/iotjs/nuttx/build: ${iotjs_nuttx_config_file}
	cp -av $< ${nuttx_config_file}
	${MAKE} rule/nuttx/build

rule/iotjs/link: ${iotjs_nuttx_config_file} ${iotjs_lib_file} ${nuttx_apps_dir}/system/iotjs
	cp -av $< ${nuttx_config_file}
	@echo 'CONFIG_IOTJS=y' >> ${nuttx_config_file}
	${MAKE} \
 IOTJS_ABSOLUTE_ROOT_DIR=${IOTJS_ABSOLUTE_ROOT_DIR} \
 IOTJS_ROOT_DIR=../${IOTJS_ROOT_DIR} \
 -C ${nuttx_dir}

rule/iotjs/prep: ${apps_dir}/system/iotjs/Kconfig
	ls $<

iotjs/build/arm-nuttx/debug/lib/%: rule/iotjs/build
	ls $@


rule/iotjs/config: ${iotjs_dir}
	ls ${nuttx_dir}/.config
	make -C ${nuttx_dir} savedefconfig
#	-diff -u ${nuttx_dir}/defconfig ${iotjs_config_file}
#	cp -av ${nuttx_dir}/defconfig ${iotjs_config_file}
	cp ${nuttx_dir}/.config ${iotjs_dir}/config/nuttx/${iotjs_machine}/config.default
#	grep -v '#' nuttx/.config

rule/iotjs/configure: iotjs
#	cp -av ${nuttx_dir}/defconfig ${iotjs_config_file}
	-rm ${nuttx_apps_dir}/Kconfig
#	-rm -rfv ${nuttx_config_file}
	rm -rfv ${nuttx_dir}/.config
#	${MAKE} rule/iotjs/cleanall
#	${MAKE} rule/nuttx/configure
	cp -av ${iotjs_config_file} ${nuttx_config_file}
#	@echo 'CONFIG_IOTJS=y' >> ${nuttx_config_file}
	${MAKE} menuconfig

rule/iotjs/configured: ${nuttx_config_file}
	grep 'CONFIG_NET_LOCAL=y' ${nuttx_config_file}
#	grep 'CONFIG_NET_TCPBACKLOG=y' ${nuttx_config_file}
#	-grep 'IPV6' ${nuttx_config_file}


${iotjs_nuttx_config_file}: ${nuttx_config_file}
	ls ${nuttx_config_file} || ${MAKE} ${nuttx_config_file} 
	cp -av ${nuttx_config_file} ${nuttx_config_file}._pre.tmp
	cat ./rules/iotjs/defconfig.in >>  ${nuttx_config_file} # iotjs inspired stm32
	cat ./rules/iotjs/defconfig-*.in >>  ${nuttx_config_file}
	${MAKE} rule/iotjs/configured
	${MAKE} menuconfig
	${MAKE} rule/iotjs/configured
	-diff -u ${nuttx_dir}/defconfig ${iotjs_config_file} | tee ${iotjs_config_file}.diff.tmp
	grep -v 'CONFIG_IOTJS=y' ${nuttx_config_file} > $@
	grep 'CONFIG_NET_LOCAL=y' $@
	ls $@

rule/iotjs/nuttx/configure: ${iotjs_nuttx_config_file}
	ls $<

rule/iotjs/base: rule/iotjs/prep 
#	${MAKE} ${nuttx_dir}
#	-${MAKE} distclean
#	-rm -rfv ${iotjs_nuttx_dir}
#	${MAKE} rule/nuttx/configure
	${MAKE} rule/iotjs/nuttx/build
#	${MAKE} deploy monitor # TODO
#	${MAKE} rule/iotjs/config # TODO
#	ls ${nuttx_include_file} #TODO rm

rule/iotjs/lib: ${nuttx_include_file} ${nuttx_config_file}._iotjs.config 
	cd ${iotjs_dir} && ./tools/build.py \
 --target-arch=arm \
 --target-os=nuttx \
 --nuttx-home=../${nuttx_dir} \
 --target-board=${iotjs_machine} \
 --jerry-heaplimit=78 \
 #eol
# --buildtype=debug


#rule/iotjs/lib:
#	rm -rf ${iotjs_dir}/build
#	${MAKE} rule/iotjs/build

${iotjs_lib_file}: rule/iotjs/lib
	ls $@

#rule/iotjs/build/base: ${nuttx_dir}/.config


rule/iotjs/menuconfig:
	ls ${nuttx_config_file}
#	${MAKE} menuconfig
#	make -C ${nuttx_dir} savedefconfig
# cp nuttx/defconfig iotjs/config/nuttx/nucleo-f767zi/
#	-grep CONFIG_IOTJS ${nuttx_config_file}
#	grep PIPES ${nuttx_config_file}

#${nuttx_dir}/include/nuttx/config.h:
#	grep -v CONFIG_IOTJS nuttx/.config > nuttx/base.config
#	cp -av nuttx/base.config nuttx/.config
#	make rule/nuttx/build

#$ rm -rfv iotjs/build

#${image_file}: build
#	ls -l $@

#prep: nuttx apps stlink patch
#	sync

#monitor: /dev/ttyACM0 deploy
#	screen $< ${monitor_rate}

#all: prep configure build

${nuttx_apps_dir}/system/iotjs: iotjs ${nuttx_apps_dir}
	@mkdir -p $@
	cp -rf ${iotjs_app_dir}/* $@/
	make -C ${nuttx_apps_dir} Kconfig TOPDIR=${CURDIR}/${nuttx_dir}


${nuttx_apps_dir}/system/iotjs/%: ${nuttx_apps_dir}/system/iotjs
	ls $@

rule/iotjs/stm32/meld: iotjs/config/nuttx/${iotjs_reference_machine}/config.default ${nuttx_dir}/.config
	ls ${<D}/..
	${@F} $^

rule/iotjs/tizenrt/meld: ${HOME}/mnt/TizenRT/build/configs/artik053s/iotjs/defconfig ${nuttx_dir}/.config
	ls ${<D}/../..
	${@F} $^

rule/iotjs/clean:
	rm -rf iotjs/build


tmp/done/patch/iotjs/%: patches/iotjs/% iotjs
	cd iotjs && git am ${CURDIR}/$<
	mkdir -p ${@D}
	touch $@

tmp/done/patch/libtuv/%: patches/libtuv/% iotjs/deps/libtuv
	cd iotjs/deps/libtuv && patch -p1 < ${CURDIR}/$<
	mkdir -p ${@D}
	touch $@

patch/%: patches/% tmp/done/patch/%
	wc -l $<

rule/iotjs/patch:
	echo TODO

todo/rule/iotjs/patch: \
 tmp/done/patch/iotjs/0001-STM32F3-support.patch \
 tmp/done/patch/libtuv/0001-STM32F3-support.patch \
 # EOL
 # TODO: tmp/done/patch/iotjs/0002-wip.patch 
	ls $^

rule/build/iotjs: ${nuttx_apps_dir}/system/iotjs menuconfig build

rule/iotjs/cleanall:
	rm -rf iotjs/build


apps/system/Kconfig: ${apps_dir}/Kconfig ${apps_dir}/system/iotjs/Kconfig
	ls $@

# philippe@wsf1127:rzr-wip (sandbox/rzr/nuttx/devel/master %)$ mv apps/system/Kconfig  apps/system/Kconfig.mine



todo:
	cp ${nuttx_dir}/defconfig iotjs/config/nuttx/nucleo-f767zi/config.default
	meld iotjs/config/nuttx/stm32f4dis/  iotjs/config/nuttx/nucleo-f767zi/

rule/iotjs/meld: iotjs/config/nuttx/${iotjs_machine}/config.alloptions
	meld $< ${nuttx_config_file}
	meld $< ${nuttx_defconfig_file}


rule/iotjs/stm32f4dis: iotjs/config/nuttx/stm32f4dis/config.alloptions
	meld $< ${nuttx_config_file}
	meld $< ${nuttx_defconfig_file}

#	ls iotjs/config/nuttx/${iotjs_machine}

# uses VFP register arguments


# iotjs/devel: menuconfig build run

rule/iotjs/devel: rule/iotjs/base rule/iotjs/lib rule/iotjs/link deploy monitor
	cp -a ${nuttx_dir}/defconfig rules/iotjs
	-git diff

rule/iotjs/distclean:
	rm -rf iotjs/build
	find . -iname "*.obj" -exec rm -v {} \;
	rm -rf ${nuttx_apps_dir}/system/iotjs/lib*.a

#build rule/iotjs/patch rule/iotjs/patch rule/iotjs/build

#rule/iotjs/meld: iotjs/config/nuttx/stm32f4dis/config.default 
#	$@ $^

devel: rule/iotjs/devel
