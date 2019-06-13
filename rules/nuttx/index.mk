#machine?=stm32f767zi
machine?=stm32f7nucleo

nuttx_url?=https://bitbucket.org/nuttx/nuttx
nuttx_branch?=master
nuttx_dir?=nuttx
nuttx_platform=nucleo-144
nuttx_config=${nuttx_platform}/f767-netnsh
nuttx_config_file=${nuttx_dir}/.config
nuttx_defconfig_file=${nuttx_dir}/configs/${nuttx_config}/defconfig

# TODO
#nuttx_url=https://github.com/TizenTeam/nuttx
#nuttx_url=file:///${HOME}/mnt/nuttx
#nuttx_branch=sandbox/rzr/devel/master
#nuttx_branch=sandbox/rzr/devel/stm32f7nucleo/master
# nuttx_branch?=sandbox/rzr/review/master
# nuttx_branch=sandbox/rzr/devel/${machine}/master
# nuttx_branch=sandbox/rzr/devel/stm32f7/master

nuttx_apps_url?=https://bitbucket.org/nuttx/apps
nuttx_apps_dir?=apps
nuttx_apps_dir?=apps-dir
nuttx_configure?=${nuttx_dir}/tools/configure.sh
configure?=${nuttx_configure}
#nuttx_config?=stm32f7nucleo/nsh
nuttx_include_file?=${nuttx_dir}/include/nuttx/config.h
nuttx_config_rc_file?=${nuttx_dir}/configs/${nuttx_platform}/include/rcS.template
nuttx_romfs_file?=${nuttx_dir}/configs/${nuttx_platform}/include/nsh_romfsimg.h

image_file?=${nuttx_dir}/nuttx.bin
monitor_rate?=115200
monitor_file?=$(shell ls /dev/ttyACM* | sort -n | tail -n1)

# TODO: keep private in ~/
dev_id?=066EFF323535474B43065221
dev_file?=/dev/disk/by-id/usb-MBED_microcontroller_${dev_id}-0:0
deploy_dir?=/media/${USER}/NODE_F767ZI1/

#LDSCRIPT ?= f767-flash.ld
#machine?=stm32f4dis
#nuttx_config?=nucleo-f303re/hello


${nuttx_apps_dir}: ${nuttx_dir}/Makefile
	mkdir -p ${@D}
	git clone --depth 1 --recursive ${nuttx_apps_url} $@
	ls $@

${nuttx_apps_dir}/%: ${nuttx_apps_dir}
	ls $@


${nuttx_dir}:
	mkdir -p ${@D}
	git clone \
  --recursive \
  --depth 1 \
  --branch ${nuttx_branch} \
  ${nuttx_url} ${@}
	ls $@
#	# 

${nuttx_dir}/Makefile: ${nuttx_dir}
	ls $@

#${nuttx_dir}: ${nuttx_dir}/Makefile # ${nuttx_apps_dir}
#	ls $<

.PHONY: rule/nuttx/configure

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

#${nuttx_dir}/Make.defs
#	ls $@ || make rule/nuttx/configure

#rule/nuttx/configure:
#	ls ${nuttx_config_file} || ${MAKE} ${nuttx_config_file}

nuttx/config: ${nuttx_config_file}
	ls $<

#${apps_dir}/Kconfig: ${apps_dir}
#	ls $@

rule/nuttx/build: ${nuttx_dir}/Make.defs ${nuttx_dir}/Kconfig
	which arm-none-eabi-gcc || sudo apt-get install gcc-arm-none-eabi
	${MAKE} -C ${<D} # LDSCRIPT=f767-flash.ld

#nuttx: rule/nuttx/build

${image_file}: build
	ls -l $@


${nuttx_romfs_file}: ${nuttx_config_rc_file}
	cd ${<D} && ../../../tools/mkromfsimg.sh -nofat  ../../../
	ls -l $@

rule/nuttx/romfs: ${nuttx_romfs_file}
	ls -l $<

nuttx_romfs_img_file?=/local/home/philippe/var/cache/url/git/ssh/github.com/rzr/rzr-wip/src/rzr-wip/nuttx/configs/nucleo-144/src/../../../rom.img

${nuttx_romfs_img_file}.dir:
	mkdir -p $@
	touch ${@}/README.md

${nuttx_romfs_img_file}: ${nuttx_romfs_img_file}.dir
	genromfs -d "${@}.dir" -f $@

rule/nuttx/romfs.img: ${nuttx_romfs_img_file}
	ls $<

#${nuttx_dir}/include/arch: rule/nuttx/menuconfig
#	ls $@

apps_dir?=apps



rule/nuttx/menuconfig: ${nuttx_config_file} #${nuttx_dir}/Make.defs apps/system/Kconfig
#	ls ${nuttx_dir}/.config || make configure
#	ls ${nuttx_dir}/.config
	cp -av ${nuttx_config_file} ${nuttx_config_file}._pre.tmp
	make -C ${nuttx_dir} ${@F}
	make -C ${nuttx_dir} savedefconfig
#	meld ${nuttx_dir}/defconfig ${nuttx_defconfig_file}
	cp -av ${nuttx_config_file} ${nuttx_config_file}._post.tmp
	-diff -u ${nuttx_config_file}._pre.tmp ${nuttx_config_file}._post.tmp | tee ${nuttx_config_file}.diff
	-diff -u ${nuttx_defconfig_file} ${nuttx_dir}/defconfig | tee ${nuttx_dir}/defconfig.diff

rule/nuttx/reconfigure: distclean rule/nuttx/menuconfig
	ls -l ${nuttx_config_file}

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

deploy:
	sudo sync
	ls -l ${dev_file}
	sudo umount -f ${dev_file} ${deploy_dir} || echo $$?
	udisksctl mount -b ${dev_file} ||:
	cp -av ${nuttx_dir}/nuttx.bin  ${deploy_dir}
	sleep 6


rule/nuttx/devel: rule/nuttx/menuconfig build deploy monitor rule/nuttx/savedefconfig
	@echo "#TODO: # cp -av ${nuttx_dir}/.config ${nuttx_defconfig_file}"
