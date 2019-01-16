#machine?=stm32f767zi
machine?=stm32f7nucleo

nuttx_dir?=nuttx
nuttx_url?=https://bitbucket.org/nuttx/nuttx
nuttx_branch?=master
#nuttx_url?=file:///${HOME}/mnt/nuttx
#nuttx_branch?=sandbox/rzr/review/master
#nuttx_branch=sandbox/rzr/devel/${machine}/master
#nuttx_branch=sandbox/rzr/devel/stm32f7/master
nuttx_config=nucleo-144/f767-netnsh
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



${nuttx_dir}:
	ls $@ || git clone --recursive --branch ${nuttx_branch} ${nuttx_url} 
	ls $@
#	# --depth 1

${nuttx_apps_dir}:
	git clone --depth 1 --recursive ${nuttx_apps_url}
	ls $@

nuttx/%: ${nuttx_dir} apps
	ls $@

nuttx/.config: nuttx/tools/configure.sh apps
	cd ${@D} && ${CURDIR}/$< ${nuttx_config}
	ls $<
	grep -i BOARD $@

rule/nuttx/configure: nuttx/tools/configure.sh
	ls apps
	cd ${nuttx_dir} && bash -x ${CURDIR}/$< ${nuttx_config}
#	cp -av ${iotjs_config_file} ${nuttx_config_file} # TODO
	grep -i BOARD ${nuttx_config_file}

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
	ls nuttx/.config
	make -C nuttx ${@F}

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
	sleep 10

rule/nuttx/diff: nuttx/defconfig ${nuttx_defconfig_file}
	meld $^

