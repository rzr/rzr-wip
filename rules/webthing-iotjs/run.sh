
cd /tmp/ ; wget http://192.168.1.12/~philippe/tmp/robot.js
#iotjs /tmp/robot.js

echo "TODO: webpack"
mkdir /tmp/iotjs_modules
mkdir /tmp/iotjs_modules/webthing-iotjs
cd /tmp/iotjs_modules/webthing-iotjs
wget http://192.168.1.12/~philippe/tmp/wti/webthing.js

mkdir /tmp/iotjs_modules/webthing-iotjs/lib
cd /tmp/iotjs_modules/webthing-iotjs/lib
wget http://192.168.1.12/~philippe/tmp/wti/express.js
wget http://192.168.1.12/~philippe/tmp/wti/property.js
wget http://192.168.1.12/~philippe/tmp/wti/server.js
wget http://192.168.1.12/~philippe/tmp/wti/thing.js
wget http://192.168.1.12/~philippe/tmp/wti/utils.js
wget http://192.168.1.12/~philippe/tmp/wti/value.js

mkdir /tmp/iotjs_modules/webthing-iotjs/example
cd /tmp/iotjs_modules/webthing-iotjs/example

wget http://192.168.1.12/~philippe/tmp/wti/simplest-thing.js
cd /tmp
iotjs /tmp/iotjs_modules/webthing-iotjs/example/simplest-thing.js
