# SPDX-License-Identifier: MPL-2.0
project?=twins

#TODO
www_host?=rzr.online.fr
www_dir?=tmp/${project}
www_url?=http://${www_host}/${www_dir}

#TODO
www_host=192.168.1.12
www_url=http://${www_host}/~${USER}/${www_dir}
www_dir=tmp/${project}

target_host?=192.168.1.13
target_url?=http://${target_host}:8888
twins_www_dir?=${HOME}/public_html/${www_dir}

deploy_dir?=${twins_www_dir}
#deploy_dir=${CURDIR}/tmp/deploy
deploy_modules_dir=${deploy_dir}/iotjs_modules
example_file=${deploy_dir}/index.js
nuttx_rc_file=rules/twins/rcS.template
ftp_url?=ftp://ftp@localhost
gateway_host=gateway.local


rule/twins/help:
	@echo "# make rule/twins/devel"
	@echo "# make rule/twins/www"
	@echo "# make rule/twins/www/ftp"
	@echo "# make rule/twins/deploy/clean"
	@echo "# make rule/twins/prep"

rule/twins/prep: rules/twins/rcS.template rule/twins/romfs
	ls $<

rules/twins/rcS.template: rules/twins/rcS.template.in
	sed -e "s|\$${base_url}|${www_url}|g" < $< > $@
	cat $@

rule/twins/www: ${twins_www_dir}
	ls $^

rule/twins/www/ftp: ${twins_www_dir}
	command wput || sudo apt-get install wpu
	cd $^ && wput "${ftp_url}/${www_dir}/" .

rule/twins/www/scp: ${twins_www_dir}
	scp -R $< ${gateway_host}/home/pi/mozilla-iot/gateway/build/static/
	curl --insecure https://${gateway_host}:4443/${project}/index.js
	curl https://${gateway_host}:4443/${project}/index.js

${twins_www_dir}:
	${make} rule/twins/deploy/clean deploy_dir=${twins_www_dir}
	ls $<

rule/twins/devel: rule/twins/prep rule/twins/www rule/iotjs/devel
	sync

#rule/twins/webpack: ${twins_www_dir}
#	cd ${twins_www_dir} && ls package.json || npm init -y \
#&& npm install --only=dev webpack-cli && npm install
#	cd ${twins_www_dir} && npm run build

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
 rule/twins/test/Torso \
 rule/twins/test/Shoulder \
 rule/twins/test/Arm \
 rule/twins/test/Hand \
 #eol

make?=make -f rules/twins/index.mk
rule/twins/robot:
	curl ${target_url}/properties
	${make} ${@D}/property/Torso value=0
	${make} ${@D}/property/Shoulder value=0
	${make} ${@D}/property/Arm value=0
	${make} ${@D}/property/Hand value=0
	${make} ${@D}/Torso
	${make} ${@D}/Shoulder
	${make} ${@D}/Arm
	${make} ${@D}/Hand

rule/twins/%:
	${make} rule/twins/property/${@F} value=0
	${make} rule/twins/property/${@F} value=-90
	${make} rule/twins/property/${@F} value=0
	${make} rule/twins/property/${@F} value=90
	${make} rule/twins/property/${@F} value=0

rule/twins/Shoulder: #[ -90, 45]
	${make} rule/twins/property/Shoulder value=-90
	${make} rule/twins/property/Shoulder value=10
	${make} rule/twins/property/Shoulder value=30
	${make} rule/twins/property/Shoulder value=45
	${make} rule/twins/property/Shoulder value=0

rule/twins/Arm: # [-45 +45]
	${make} rule/twins/property/${@F} value=0
	${make} rule/twins/property/${@F} value=45
	${make} rule/twins/property/${@F} value=-45
	${make} rule/twins/property/${@F} value=0

rule/twins/Hand: # [0 45]
	${make} rule/twins/property/${@F} value=0
	${make} rule/twins/property/${@F} value=40
#	${make} rule/twins/property/${@F} value=10
	${make} rule/twins/property/${@F} value=-5
	${make} rule/twins/property/${@F} value=0


rule/twins/demo:
	${make} rule/twins/property/Hand value=0
	${make} rule/twins/property/Hand value=20
	${make} rule/twins/property/Arm value=15
	${make} rule/twins/property/Shoulder value=-20
	${make} rule/twins/property/Shoulder value=-40
	${make} rule/twins/property/Shoulder value=-60
	${make} rule/twins/property/Hand value=-5
	${make} rule/twins/property/Shoulder value=45
	${make} rule/twins/property/Arm value=10
	${make} rule/twins/property/Arm value=-15


${twins_dir}: rules/webthing-iotjs
	rm -rf $@
	cd ~/mnt/webthing-iotjs && make deploy deploy_modules_dir=${@}
	cp -av $</*.js $@
	cp -av $</*.json $@

twins_url?=https://github.com/rzr/twins
twins_dir?=twins

twins_url=file:///home/${USER}/mnt/twins

webpack_exe?=./node_modules/webpack-cli/bin/cli.js

${twins_dir}:
	mkdir -p ${@D}
	git clone ${twins_url} --depth 1 $@

${nuttx_config_rc_file}: ${nuttx_rc_file}
	cp -av ${nuttx_rc_file} $@

${nuttx_romfs_file}: ${nuttx_config_rc_file}
	cd ${<D} && ../../../tools/mkromfsimg.sh -nofat  ../../..
	ls -l $@


twins/pack: ${twins_dir}
	npm install webpack-cli
	npm install webpack


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


#twins/webpack: src
#	${webpack_exe} # --context 

webpack/help: ${webpack_exe}
	${@} --help

package.json:
	npm init -y

${webpack_exe}:
	npm install webpack --save-dev
	npm install webpack-cli --save-dev

iotjs/start: ${example_file}
#	iotjs $<
	cd ${<D} && iotjs ${<F}

sdcard_dir=/mnt/sdcard/

rcS.template.in: ${deploy_dir}
	cd ${deploy_dir}; \
find . -type d \
| while read dir; do \
echo mkdir -p $${dir} ; \
echo cd ${sdcard_dir}/$${dir} ; \
echo "TODO: fetch files" ; \
done

