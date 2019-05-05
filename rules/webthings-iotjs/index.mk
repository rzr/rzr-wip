rule/webthing-iotjs/deploy:
	cd ${HOME}/public_html/tmp && \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/webthing.js \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/lib/express.js \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/lib/property.js \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/lib/server.js \ 
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/lib/thing.js \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/lib/utils.js \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/lib/value.js \
wget https://raw.githubusercontent.com/rzr/webthing-iotjs/master/example/simplest-thing.js \
	date
