iotjs_machine?=${machine}
iotjs_machine?=stm32f7nucleo
iotjs_dir=iotjs
iotjs_config_dir?=iotjs/config/nuttx/${iotjs_machine}
iotjs_config_file?=${iotjs_config_dir}/config.default
iotjs_nuttx_dir?=${nuttx_apps_dir}/system/iotjs
IOTJS_ROOT_DIR="${iotjs_dir}"
export IOTJS_ROOT_DIR
IOTJS_ABSOLUTE_ROOT_DIR="${CURDIR}/${iotjs_dir}"
export IOTJS_ABSOLUTE_ROOT_DIR

iotjs_url?=https://github.com/Samsung/iotjs
iotjs_url=https://github.com/tizenteam/iotjs
iotjs_branch?=sandbox/rzr/devel/${iotjs_machine}/master
iotjs_url=file:///home/${USER}/mnt/iotjs
iotjs_branch=sandbox/rzr/devel/stm32f7nucleo/good/master

#nuttx_include_file?=${nuttx_dir}/include/nuttx/config.h


iotjs/%:
	git clone --recursive -b ${iotjs_branch} ${iotjs_url}
	@echo "TODO: --depth 1"
	ls $@

iotjs: ${iotjs_config_file}
	ls $^

#rule/nuttx/configure: nuttx/tools/configure.sh ${iotjs_config_file}
#	ls apps
#	cd ${nuttx_dir} && bash -x ${CURDIR}/$< ${nuttx_config}
#	cp -av ${iotjs_config_file} ${nuttx_config_file} # TODO
#	-grep -i BOARD ${nuttx_config_file}

rule/iotjs/build/base: ${nuttx_dir}/.config
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

rule/iotjs/config: ${iotjs_dir}
	ls ${nuttx_dir}/.config
	make -C ${nuttx_dir} savedefconfig
	-diff -u ${nuttx_dir}/defconfig ${iotjs_config_file}
	cp -av ${nuttx_dir}/defconfig ${iotjs_config_file}
	cp ${nuttx_dir}/.config ${iotjs_dir}/config/nuttx/${iotjs_machine}/config.default
#	grep -v '#' nuttx/.config

rule/iotjs/configure: iotjs
	cp -av ${nuttx_dir}/defconfig ${iotjs_config_file}
	-rm ${nuttx_apps_dir}/Kconfig
#	-rm -rfv ${nuttx_config_file}
	rm -rfv ${nuttx_dir}/.config
#	${MAKE} rule/iotjs/cleanall
#	${MAKE} rule/nuttx/configure
	cp -av ${iotjs_config_file} ${nuttx_config_file}
	@echo 'CONFIG_IOTJS=y' >> ${nuttx_config_file}
	${MAKE} menuconfig

rule/iotjs/base:
	${MAKE} ${nuttx_dir}
	${MAKE} distclean
	-rm -rfv ${iotjs_nuttx_dir}
	${MAKE} rule/nuttx/configure
	cp -av ${nuttx_config_file} ${nuttx_config_file}._pre.tmp
	echo 'CONFIG_ARCH_FPU=y' >> ${nuttx_config_file}
	echo 'CONFIG_ARCH_DPFPU=y' >> ${nuttx_config_file}
	echo 'CONFIG_ARM_MPU=y' >> ${nuttx_config_file}
	echo 'CONFIG_PIPES=y' >> ${nuttx_config_file}
	echo 'CONFIG_NET_TCPBACKLOG_CONNS=y' >> ${nuttx_config_file}
	echo 'CONFIG_PTHREAD_MUTEX_TYPES=y' >> ${nuttx_config_file}
#
	echo 'CONFIG_NET_IPv6=y'  >> ${nuttx_config_file}
	echo 'CONFIG_NET_ICMPv6=y' >> ${nuttx_config_file}
	echo 'CONFIG_NET_ICMPv6_NEIGHBOR=y' >> ${nuttx_config_file}
	echo 'CONFIG_FS_ROMFS=y' >> ${nuttx_config_file}
#
	echo 'CONFIG_NETUTILS_TELNETD=y' >> ${nuttx_config_file}
	echo 'CONFIG_PTABLE_PARTITION=y' >> ${nuttx_config_file}
	echo 'CONFIG_NSH_ROMFSDEVNO=y' >> ${nuttx_config_file}
	echo 'CONFIG_EXAMPLES_MODULE_ROMFS=y' >> ${nuttx_config_file}
	echo 'CONFIG_STM32F7_RNG=y' >> ${nuttx_config_file}
	echo 'CONFIG_SYSTEM_NSH_CXXINITIALIZE=y' >> ${nuttx_config_file}
	echo 'CONFIG_SYSLOG_NONE=y' >> ${nuttx_config_file}
	echo 'CONFIG_EXPERIMENTAL=y' >> ${nuttx_config_file}
#	echo 'CONFIG_FS_PROCFS_EXCLUDE_VERSION=n' >> ${nuttx_config_file}
#	echo 'CONFIG_FS_HOSTFS=y' >> ${nuttx_config_file}
# 	echo 'CONFIG_STM32_ROMFS=y' >> ${nuttx_config_file}
# 	echo 'CONFIG_STM32_ROMFS_IMAGEFILE=y' >> ${nuttx_config_file}
#TODO: MTD PARTS TELNET MUTEX
# CONFIG_CDCACM=y
#CONFIG_FAT_LFN=y
#CONFIG_FS_FAT=y
#CONFIG_LIBM=y
#CONFIG_MMCSD=y
#CONFIG_NETDEVICES=y
#CONFIG_NETDEV_LATEINIT=y
#CONFIG_NET_LOCAL=y
#CONFIG_NET_TCP_WRITE_BUFFERS=y
#CONFIG_NSH_LIBRARY=y

	${MAKE} menuconfig
	-diff -u ${nuttx_dir}/defconfig ${iotjs_config_file}
	${MAKE} rule/nuttx/build
	${MAKE} deploy monitor # TODO
#	${MAKE} rule/iotjs/config # TODO
#	ls ${nuttx_include_file}

rule/iotjs/build: ${iotjs_config_file}
#	grep FPU ${iotjs_config_file}
	ls ${nuttx_include_file}
	cd ${iotjs_dir} && ./tools/build.py \
--target-arch=arm \
--target-os=nuttx \
--nuttx-home=../${nuttx_dir} \
--target-board=${iotjs_machine} \
--jerry-heaplimit=78

rule/iotjs/lib:
	rm -rf ${iotjs_dir}/build
	${MAKE} rule/iotjs/build

rule/iotjs/link:
	${MAKE} ${nuttx_app_dir}/system/iotjs
	${MAKE} rule/iotjs/configure
	${MAKE} rule/iotjs/nuttx/build
	${MAKE} deploy monitor

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

apps/system/iotjs: iotjs ${nuttx_apps_dir}
	@mkdir -p $@
	cp -rf iotjs/config/nuttx/${iotjs_machine}/app/* $@/
	make -C ${nuttx_apps_dir} Kconfig TOPDIR=${CURDIR}/${nuttx_dir}

iotjs/meld: iotjs/config/nuttx/stm32f4dis/config.default ${nuttx_dir}/.config
	$@ $^

iotjs/clean:
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

rule/iotjs/devel: rule/iotjs/base rule/iotjs/lib rule/iotjs/link


rule/iotjs/distclean:
	rm -rf iotjs/build
	find . -iname "*.obj" -exec rm -v {} \;
	rm -rf ${nuttx_apps_dir}/system/iotjs/lib*.a

#build rule/iotjs/patch rule/iotjs/patch rule/iotjs/build

#rule/iotjs/meld: iotjs/config/nuttx/stm32f4dis/config.default 
#	$@ $^

devel: rule/iotjs/devel
