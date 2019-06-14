# SPDX-License-Identifier: MPL-2.0
project?=twins

target_host?=192.168.1.13
target_url?=http://${target_host}:8888

deploy_dir?=${twins_www_dir}
#deploy_dir=${CURDIR}/tmp/deploy
deploy_modules_dir=${deploy_dir}/iotjs_modules
example_file=${deploy_dir}/index.js
nuttx_rc_file=rules/twins/rcS.template
ftp_url?=ftp://ftp@localhost
gateway_host=gateway.local

twins_url?=https://github.com/rzr/twins
twins_branch?=master
twins_dir?=twins

rule/twins/help:
	@echo "# make rule/twins/devel"
	@echo "# make rule/twins/prep"

rule/twins/prep: rules/twins/rcS.template rule/twins/romfs
	ls $<

rule/twins/devel: rule/twins/prep rule/iotjs/devel
	sync

rule/twins/property/%:
	curl ${target_url}/properties/${@F}
	curl -X PUT -d '{ "${@F}": ${value} }' ${target_url}/properties/${@F}
	sleep 2

rule/twins/test/%:
	curl -X PUT -d '{ "${@F}": -90 }' ${target_url}/properties/${@F}
	sleep 1
	curl -X PUT -d '{ "${@F}": 90 }' ${target_url}/properties/${@F}
	sleep 1

rule/twins/test: \
 rule/twins/test/torso \
 rule/twins/test/shoulder \
 rule/twins/test/arm \
 rule/twins/test/hand \
 #eol

make?=make -f rules/twins/index.mk
rule/twins/robot:
	curl ${target_url}/properties
	${make} ${@D}/property/torso value=0
	${make} ${@D}/property/shoulder value=0
	${make} ${@D}/property/arm value=0
	${make} ${@D}/property/hand value=0
	${make} ${@D}/torso
	${make} ${@D}/shoulder
	${make} ${@D}/arm
	${make} ${@D}/hand

rule/twins/%:
	${make} rule/twins/property/${@F} value=0
	${make} rule/twins/property/${@F} value=-90
	${make} rule/twins/property/${@F} value=0
	${make} rule/twins/property/${@F} value=90
	${make} rule/twins/property/${@F} value=0

rule/twins/shoulder: #[ -90, 45]
	${make} rule/twins/property/shoulder value=-90
	${make} rule/twins/property/shoulder value=10
	${make} rule/twins/property/shoulder value=30
	${make} rule/twins/property/shoulder value=45
	${make} rule/twins/property/shoulder value=0

rule/twins/arm: # [-45 +45]
	${make} rule/twins/property/${@F} value=0
	${make} rule/twins/property/${@F} value=45
	${make} rule/twins/property/${@F} value=-45
	${make} rule/twins/property/${@F} value=0

rule/twins/hand: # [0 45]
	${make} rule/twins/property/${@F} value=0
	${make} rule/twins/property/${@F} value=40
#	${make} rule/twins/property/${@F} value=10
	${make} rule/twins/property/${@F} value=-5
	${make} rule/twins/property/${@F} value=0


rule/twins/demo:
	${make} rule/twins/property/hand value=0
	${make} rule/twins/property/hand value=20
	${make} rule/twins/property/arm value=15
	${make} rule/twins/property/shoulder value=-20
	${make} rule/twins/property/shoulder value=-40
	${make} rule/twins/property/shoulder value=-60
	${make} rule/twins/property/hand value=-5
	${make} rule/twins/property/shoulder value=45
	${make} rule/twins/property/arm value=10
	${make} rule/twins/property/arm value=-15


${twins_dir}: rules/webthing-iotjs
	rm -rf $@
	cd ~/mnt/webthing-iotjs && make deploy deploy_modules_dir=${@}
	cp -av $</*.js $@
	cp -av $</*.json $@


${twins_dir}:
	mkdir -p ${@D}
	git clone ${twins_url} --branch ${twins_branch} --depth 1 $@

${nuttx_config_rc_file}: ${nuttx_rc_file}
	cp -av ${nuttx_rc_file} $@

${nuttx_romfs_file}: ${nuttx_config_rc_file}
	cd ${<D} && ../../../tools/mkromfsimg.sh -nofat  ../../..
	ls -l $@

${deploy_modules_dir}: ${twins_dir}
	make -C $< deploy deploy_modules_dir=$@

rule/twins/deploy: ${deploy_modules_dir}
	install rules/twins/index.js ${example_file}
	du -ksc $<

rule/twins/deploy/clean: ${deploy_modules_dir} rule/twins/deploy 
	du -ksc $<
	rm -rfv $</webthing-iotjs/example
	du -ksc $<

rule/twins/romfs: ${nuttx_romfs_dir}
	${make} rule/twins/deploy/clean deploy_dir="$<"
	install rules/twins/index.js $</
	rm -rfv ${nuttx_romfs_img_file}
	${make} rule/nuttx/romfs.img

iotjs/start: ${example_file}
	cd ${<D} && iotjs ${<F}


