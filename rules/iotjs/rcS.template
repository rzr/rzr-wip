echo "~~~ Sun May  5 17:41:05 UTC 2019"

ifconfig ; ifup eth0 ; renew eth0 ; ifconfig
sleep 1
mkdir /tmp; mount -t tmpfs /tmp ; cd /tmp # FS_TMPFS
cd /tmp/ ; wget http://192.168.1.12/~philippe/tmp/robot.js
iotjs /tmp/robot.js

