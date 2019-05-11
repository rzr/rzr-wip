www_url?=http://192.168.250.1/~${USER}/${www_dir}
www_dir?=d

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
	cd ~/mnt/webthing-iotjs && make www www_modules_dir=${@}
	cp -av $</*.js $@

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
