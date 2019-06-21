# SPDX-License-Identifier: MPL-2.0
project=stm32

target_host?=TODO.target.host
target_url?=http://${target_host}:8888


st-flash?=/usr/bin/st-flash

stm/monitor:
	screen 


#TODO
#stm32_deploy_dir?=${stm32_www_dir}
stm32_deploy_dir?=${CURDIR}/tmp/deploy
stm32_dir?=stm32
deploy_modules_dir=${stm32_deploy_dir}/iotjs_modules
example_file=${stm32_deploy_dir}/index.js
nuttx_rc_file=rules/stm32/rcS.template
gateway_host=gateway.local

make?=make -f rules/stm32/index.mk
stm32_deploy_files?=$(shell ls rules/stm32/*.js | sort)


stm32/setup/debian:
	sudo apt-get install -y stlink-tools


deploy_address?=0x8000000
nuttx_image_file?=${CURDIR}/nuttx/nuttx.bin

stm/deploy: ${nuttx_image_file}
	-lsusb # 0483:374b STMicroelectronics ST-LINK/V2.1 (Nucleo-F103RB)
#	/usr/bin/st-flash write ${<} ${deploy_address}
	cp $< /media/philippe/NODE_F767ZI1/
# 0483:374b STMicroelectronics ST-LINK/V2.1 (Nucleo-F103RB)

baud?=115200

rule/stm32/help:
	@echo "# make rule/stm32/devel"
	@echo "# make rule/stm32/prep"

rule/stm32/prep: rules/stm32/rcS.template rule/stm32/romfs
	ls $<

rule/stm32/devel: rule/nuttx/cleanall rule/stm32/prep rule/iotjs/devel
	sync


${stm32_dir}: rules/stm32/ ${webthing-iotjs_dir}
	rm -rf $@
	install -d $@
	cp -av $</*.js $@
#	cp -av $</*.json $@

${deploy_modules_dir}: ${stm32_dir}
	make -C ${CURDIR} deploy deploy_modules_dir=${@}
#	
	ls $@
#	make -C $< deploy deploy_modules_dir=$@


${nuttx_config_rc_file}: ${nuttx_rc_file}
	cp -av ${nuttx_rc_file} $@

${nuttx_romfs_file}: ${nuttx_config_rc_file}
	cd ${<D} && ../../../tools/mkromfsimg.sh -nofat  ../../..
	ls -l $@


rule/stm32/deploy: ${deploy_modules_dir}
	make -C stm32/iotjs_modules/webthing-iotjs deploy \
 deploy_modules_dir=$</webthing-iotjs/example/platform/iotjs_modules
	@echo "TODO"
	install rules/stm32/stm32.js $</webthing-iotjs/example/platform/board/
	install rules/stm32/index.js $</
	du -ksc $<

rule/stm32/deploy/clean: ${deploy_modules_dir} rule/stm32/deploy 
	du -ksc $<
	rm -rfv $</webthing-iotjs/example
	du -ksc $<

rule/stm32/romfs: ${nuttx_romfs_dir} ${stm32_deploy_files}
	${make} rule/stm32/deploy deploy_modules_dir="$</iotjs_modules"
	install ${stm32_deploy_files} ${<}
	rm -rfv ${nuttx_romfs_img_file}
	${make} rule/nuttx/romfs.img

iotjs/start: ${example_file}
	cd ${<D} && iotjs ${<F}


rule/stm32/property/%:
	curl ${target_url}/properties/${@F}
	curl -X PUT -d '{ "${@F}": ${value} }' ${target_url}/properties/${@F}
	sleep 2

rule/stm32/test/%:
	curl -X PUT -d '{ "${@F}": -90 }' ${target_url}/properties/${@F}
	sleep 1
	curl -X PUT -d '{ "${@F}": 90 }' ${target_url}/properties/${@F}
	sleep 1

