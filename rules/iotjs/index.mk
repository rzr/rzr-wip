iotjs_machine?=${machine}
iotjs_machine?=stm32f7nucleo
iotjs_dir=iotjs
iotjs_config_dir?=iotjs/config/nuttx/${iotjs_machine}
iotjs_config_file?=${iotjs_config_dir}/config.default
iotjs_nuttx_dir?=apps/system/iotjs
IOTJS_ROOT_DIR="${iotjs_dir}"
export IOTJS_ROOT_DIR
IOTJS_ABSOLUTE_ROOT_DIR="${CURDIR}/${iotjs_dir}"
export IOTJS_ABSOLUTE_ROOT_DIR


#iotjs_url?=https://github.com/Samsung/iotjs
#iotjs_url?=https://github.com/tizenteam/iotjs
itojs_url?=file:///home/${USER}/mnt/iotjs
iotjs_branch?=sandbox/rzr/devel/${iotjs_machine}/master


iotjs:
	git clone --recursive -b ${iotjs_branch} ${iotjs_url}
	@echo "TODO: --depth 1"
	ls $@

rule/iotjs/build/base: nuttx/.config
	which arm-none-eabi-gcc || sudo apt-get install gcc-arm-none-eabi
	${MAKE} \
 IOTJS_ABSOLUTE_ROOT_DIR=${IOTJS_ABSOLUTE_ROOT_DIR} \
 IOTJS_ROOT_DIR=../${IOTJS_ROOT_DIR} \
 -C ${nuttx_dir}

iotjs/build/arm-nuttx/debug/lib/%: rule/iotjs/build
	ls $@

rule/iotjs/nuttx/build: #nuttx/.config #build/base iotjs/build
	which arm-none-eabi-gcc || sudo apt-get install gcc-arm-none-eabi
	${MAKE} \
 IOTJS_ABSOLUTE_ROOT_DIR=${IOTJS_ABSOLUTE_ROOT_DIR} \
 IOTJS_ROOT_DIR=../${IOTJS_ROOT_DIR} \
 -C ${nuttx_dir}

rule/iotjs/build: ${iotjs_config_file} ${nuttx_dir}
	cd iotjs && ./tools/build.py \
--target-arch=arm \
--target-os=nuttx \
--nuttx-home=../${nuttx_dir} \
--target-board=${iotjs_machine} \
--jerry-heaplimit=78

#$ rm -rfv iotjs/build

#${image_file}: build
#	ls -l $@

#prep: nuttx apps stlink patch
#	sync

#monitor: /dev/ttyACM0 deploy
#	screen $< ${monitor_rate}

#all: prep configure build

apps/system/iotjs: iotjs apps
	@mkdir -p $@
	cp -rf iotjs/config/nuttx/${iotjs_machine}/app/* $@/
	make -C apps Kconfig TOPDIR=${CURDIR}/nuttx

iotjs/meld: iotjs/config/nuttx/stm32f4dis/config.default nuttx/.config
	$@ $^

iotjs/clean:
	rm -rf iotjs/build

iotjs/devel: menuconfig build run


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

rule/build/iotjs: apps/system/iotjs menuconfig build

rule/iotjs/cleanall:
	rm -rf iotjs/build


# philippe@wsf1127:rzr-wip (sandbox/rzr/nuttx/devel/master %)$ mv apps/system/Kconfig  apps/system/Kconfig.mine

rule/iotjs/config:
	ls nuttx/.config
	make -C ${nuttx_dir} savedefconfig
	cp -av ${nuttx_dir}/defconfig ${iotjs_config_file}
#	grep -v '#' nuttx/.config

rule/iotjs/menuconfig:
	ls ${nuttx_config_file}
#	${MAKE} menuconfig
#	make -C ${nuttx_dir} savedefconfig
# cp nuttx/defconfig iotjs/config/nuttx/nucleo-f767zi/
#	-grep CONFIG_IOTJS ${nuttx_config_file}
#	grep PIPES ${nuttx_config_file}


todo:
	cp nuttx/defconfig iotjs/config/nuttx/nucleo-f767zi/config.default
	meld iotjs/config/nuttx/stm32f4dis/  iotjs/config/nuttx/nucleo-f767zi/

#meld  iotjs/config/nuttx/stm32f4dis/  iotjs/config/nuttx/nucleo-f767zi/

# uses VFP register arguments

rule/iotjs/configure:
	${MAKE} rule/nuttx/configure
	cp -av ${iotjs_config_file} ${nuttx_config_file}
	@echo 'CONFIG_IOTJS=y' >> ${nuttx_config_file}
	${MAKE} menuconfig

rule/iotjs/devel: #build rule/iotjs/patch rule/iotjs/patch rule/iotjs/build
	${MAKE} nuttx apps
	${MAKE} distclean
	-rm -rfv ${iotjs_nuttx_dir}
	${MAKE} rule/nuttx/configure
	echo 'CONFIG_ARCH_FPU=y' >> ${nuttx_config_file}
	echo 'CONFIG_ARCH_DPFPU=y' >> ${nuttx_config_file}
	echo 'CONFIG_ARM_MPU=y' >> ${nuttx_config_file}
	echo 'CONFIG_PIPES=y' >> ${nuttx_config_file}
	echo 'CONFIG_NET_TCPBACKLOG_CONNS=y' >> ${nuttx_config_file}
	${MAKE} menuconfig
	${MAKE} rule/nuttx/build
#	${MAKE} rule/iotjs/config
	${MAKE} rule/iotjs/cleanall
	${MAKE} rule/iotjs/build
	${MAKE} apps/system/iotjs
	-rm apps/Kconfig
	-rm -rfv ${nuttx_config_file}
	${MAKE} rule/iotjs/configure
	${MAKE} rule/iotjs/nuttx/build
	${MAKE} deploy monitor
