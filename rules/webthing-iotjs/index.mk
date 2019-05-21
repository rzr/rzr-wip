www_host?=192.168.1.12
www_url?=http://${www_host}/~${USER}/${www_dir}
www_dir?=d
target_host?=192.168.1.13
target_url?=http://${target_host}:8888
target_url?=https://rzr.github.io/twins/

webthing_iotjs_www_dir?=${HOME}/public_html/${www_dir}


rule/webthing-iotjs/prep: rules/webthing-iotjs/rcS.template
	ls $<

rules/webthing-iotjs/rcS.template: rules/webthing-iotjs/rcS.template.in
	sed -e "s|\$${base_url}|${www_url}|g" < $< > $@
	cat $@

rule/webthing-iotjs/www: ${webthing_iotjs_www_dir}
	ls $^

${webthing_iotjs_www_dir}: rules/webthing-iotjs
	rm -rf $@
	cd ~/mnt/webthing-iotjs && make deploy deploy_modules_dir=${@}
	cp -av $</*.js $@
	cp -av $</*.json $@

rule/webthing-iotjs/www/wget:
	mkdir -p ${HOME}/public_html/tmp/wt
	cd ${HOME}/public_html/tmp/wt && \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/webthing.js && \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/index.js && \
wget https://raw.githubusercontent.com/SamsungInternet/iotjs-express/master/lib/express.js && \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/lib/property.js && \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/lib/server.js && \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/lib/thing.js && \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/lib/utils.js && \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/lib/value.js && \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/example/simplest-thing.js && \
wget https://raw.githubusercontent.com/SamsungInternet/iotjs-express/master/iotjs-express.js \
sync

rule/webthing-iotjs/devel: rule/webthing-iotjs/prep rule/webthing-iotjs/www rule/iotjs/devel
	sync

rule/webthing-iotjs/webpack: ${webthing_iotjs_www_dir}
	cd ${webthing_iotjs_www_dir} && ls package.json || npm init -y \
&& npm install --only=dev webpack-cli && npm install
	cd ${webthing_iotjs_www_dir} && npm run build



rule/webthing-iotjs/property/%:
	curl ${target_url}/properties/${@F}
	curl -X PUT -d '{ "${@F}": ${value} }' ${target_url}/properties/${@F}
	sleep 2


rule/webthing-iotjs/test/%:
	curl -X PUT -d '{ "${@F}": -90 }' ${target_url}/properties/${@F}
	sleep 1
	curl -X PUT -d '{ "${@F}": 90 }' ${target_url}/properties/${@F}
	sleep 1

rule/webthing-iotjs/test: \
 rule/webthing-iotjs/test/Torso \
 rule/webthing-iotjs/test/Shoulder \
 rule/webthing-iotjs/test/Arm \
 rule/webthing-iotjs/test/Hand \
 #eol

make?=make -f rules/webthing-iotjs/index.mk
rule/webthing-iotjs/robot:
	curl ${target_url}/properties
	${make} ${@D}/property/Torso value=0
	${make} ${@D}/property/Shoulder value=0
	${make} ${@D}/property/Arm value=0
	${make} ${@D}/property/Hand value=0
	${make} ${@D}/Torso
	${make} ${@D}/Shoulder
	${make} ${@D}/Arm
	${make} ${@D}/Hand

rule/webthing-iotjs/%:
	${make} rule/webthing-iotjs/property/${@F} value=0
	${make} rule/webthing-iotjs/property/${@F} value=-90
	${make} rule/webthing-iotjs/property/${@F} value=0
	${make} rule/webthing-iotjs/property/${@F} value=90
	${make} rule/webthing-iotjs/property/${@F} value=0

rule/webthing-iotjs/Shoulder: #[ -90, 45]
	${make} rule/webthing-iotjs/property/Shoulder value=-90
	${make} rule/webthing-iotjs/property/Shoulder value=10
	${make} rule/webthing-iotjs/property/Shoulder value=30
	${make} rule/webthing-iotjs/property/Shoulder value=45
	${make} rule/webthing-iotjs/property/Shoulder value=0

rule/webthing-iotjs/Arm: # [-45 +45]
	${make} rule/webthing-iotjs/property/${@F} value=0
	${make} rule/webthing-iotjs/property/${@F} value=45
	${make} rule/webthing-iotjs/property/${@F} value=-45
	${make} rule/webthing-iotjs/property/${@F} value=0

rule/webthing-iotjs/Hand: # [0 45]
	${make} rule/webthing-iotjs/property/${@F} value=0
	${make} rule/webthing-iotjs/property/${@F} value=40
#	${make} rule/webthing-iotjs/property/${@F} value=10
	${make} rule/webthing-iotjs/property/${@F} value=-5
	${make} rule/webthing-iotjs/property/${@F} value=0


rule/webthing-iotjs/demo:
	${make} rule/webthing-iotjs/property/Hand value=0
	${make} rule/webthing-iotjs/property/Hand value=20
	${make} rule/webthing-iotjs/property/Arm value=15
	${make} rule/webthing-iotjs/property/Shoulder value=-20
	${make} rule/webthing-iotjs/property/Shoulder value=-40
	${make} rule/webthing-iotjs/property/Shoulder value=-60
	${make} rule/webthing-iotjs/property/Hand value=-7




	${make} rule/webthing-iotjs/property/Shoulder value=0
#	${make} rule/webthing-iotjs/property/Shoulder value=45
#	${make} rule/webthing-iotjs/property/Arm value=10
	${make} rule/webthing-iotjs/property/Arm value=0
#	${make} rule/webthing-iotjs/property/Arm value=-16
