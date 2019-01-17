#machine?=stm32f767zi
machine?=stm32f7nucleo

nuttx_dir?=nuttx
nuttx_url?=https://bitbucket.org/nuttx/nuttx
nuttx_branch?=master
nuttx_config=nucleo-144/f767-netnsh

# nuttx_url=file:///${HOME}/mnt/nuttx
# nuttx_branch?=sandbox/rzr/review/master
# nuttx_branch=sandbox/rzr/devel/${machine}/master
# nuttx_branch=sandbox/rzr/devel/stm32f7/master

nuttx_apps_dir?=apps
nuttx_apps_url?=https://bitbucket.org/nuttx/apps

nuttx_config_file=${nuttx_dir}/.config
nuttx_defconfig_file=${nuttx_dir}/configs/${nuttx_config}/defconfig
#nuttx_config?=stm32f7nucleo/nsh

image_file?=nuttx/nuttx.bin
monitor_rate?=115200

dev_file?=/dev/disk/by-id/usb-MBED_microcontroller_066EFF323535474B43065221-0:0
deploy_dir?=/media/${USER}/NODE_F767ZI1/

#LDSCRIPT ?= f767-flash.ld
#machine?=stm32f4dis
#nuttx_config?=nucleo-f303re/hello

${nuttx_apps_dir}/%:
	git clone --depth 1 --recursive ${nuttx_apps_url} ${nuttx_apps_dir}
	ls $@

${nuttx_dir}/%: ${nuttx_apps_dir}/Makefile
	git clone \
  --recursive \
  --depth 1 \
  --branch ${nuttx_branch} \
  ${nuttx_url} ${nuttx_dir}
	ls $@
#	# 

${nuttx_dir}: ${nuttx_dir}/Makefile # ${nuttx_apps_dir}
	ls $<

${nuttx_dir}/Make.defs: ${nuttx_dir}/tools/configure.sh apps/Makefile ${nuttx_defconfig_file}
	cd ${@D} && ${CURDIR}/$< ${nuttx_config}
	ls $<
	-grep -i BOARD ${nuttx_config}

${nuttx_dir}/.config: ${nuttx_dir}/Make.defs
	ls $@
#	ls $@ || 

rule/nuttx/configure: nuttx/tools/configure.sh ${nuttx_apps_dir}/Make.defs
	ls $^
	cd ${nuttx_dir} && bash -x ${CURDIR}/$< ${nuttx_config}
#	cp -av ${iotjs_config_file} ${nuttx_config_file} # TODO
	-grep -i BOARD ${nuttx_config_file}

${nuttx_apps_dir}/Kconfig: rule/nuttx/configure
	ls $@

rule/nuttx/build: nuttx/Make.defs nuttx/Kconfig
	which arm-none-eabi-gcc || sudo apt-get install gcc-arm-none-eabi
	${MAKE} -C ${<D} # LDSCRIPT=f767-flash.ld

#nuttx: rule/nuttx/build

${image_file}: build
	ls -l $@

#nuttx/include/arch: rule/nuttx/menuconfig
#	ls $@

rule/nuttx/menuconfig: ${nuttx_dir}/Make.defs
#	ls nuttx/.config || make configure
#	ls nuttx/.config
	cp -av ${nuttx_config_file} ${nuttx_config_file}._pre.tmp
	make -C ${nuttx_dir} ${@F}
	make -C ${nuttx_dir} savedefconfig
#	meld ${nuttx_dir}/defconfig ${nuttx_defconfig_file}
	cp -av ${nuttx_config_file} ${nuttx_config_file}._post.tmp
	-diff -u ${nuttx_config_file}._pre.tmp ${nuttx_config_file}._post.tmp | tee ${nuttx_config_file}.diff
	-diff -u ${nuttx_defconfig_file} ${nuttx_dir}/defconfig | tee ${nuttx_dir}/defconfig.diff

rule/nuttx/%: ${nuttx_dir}
	make -C $< ${@F}

rule/nuttx/%:
	make -C ${nuttx_dir} ${@F}


rule/nuttx/diff:
	ls nuttx/.config.old nuttx/.config
	diff nuttx/.config.old nuttx/.config

deploy:
	ls -l ${dev_file}sudo umount -f ${dev_file} ${deploy_dir} || echo $$?
	udisksctl mount -b ${dev_file} ||:
	cp -av nuttx/nuttx.bin  ${deploy_dir}
	sleep 6

rule/nuttx/diff: nuttx/defconfig ${nuttx_defconfig_file}
	meld $^

rule/nuttx/devel: rule/nuttx/menuconfig build deploy monitor rule/nuttx/savedefconfig
	@echo "#TODO: # cp -av ${nuttx_dir}/.config ${nuttx_defconfig_file}"
