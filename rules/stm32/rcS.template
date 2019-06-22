#!/bin/nsh

echo "# NuttX:"
help
mount
ls -l /dev/
pwd

echo "# Network"
ifconfig
ifup eth0
renew eth0
ifconfig
sleep 1

echo "# Filesystem"
mount
ls /etc
ls /etc/init.d
mkdir /mnt
mount -t tmpfs /mnt/ ; cd /mnt
mkdir /mnt/sdcard
sleep 1

echo "# IoT.js: IOTJS_PATH: ${IOTJS_PATH} ? /mnt/sdcard"
cd /mnt/sdcard
echo "console.log(process)" > index.js
iotjs index

echo "# Application"
cd /rom


# Button
#cd /rom/gpio ; iotjs index.js PC13 IN


# RED led 
cd /rom/gpio ; iotjs index.js PB14 OUT

# GREEN flash ?
cd /rom/gpio ; iotjs index.js PB0 OUT

# ?
cd /rom/gpio ; iotjs index.js PB7 OUT





echo "# Exit"
