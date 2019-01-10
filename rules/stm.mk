st-flash?=/usr/bin/st-flash
stm/setup/debian:
	sudo apt-get install -y stlink-tools


deploy_address?=0x8000000
nuttx_image_file?=${CURDIR}/nuttx/nuttx.bin

stm/deploy: ${nuttx_image_file}
	-lsusb # 0483:374b STMicroelectronics ST-LINK/V2.1 (Nucleo-F103RB)
#	/usr/bin/st-flash write ${<} ${deploy_address}
	cp $< /media/philippe/NODE_F767ZI1/
# 0483:374b STMicroelectronics ST-LINK/V2.1 (Nucleo-F103RB)

baud?=115200


stm/monitor:
	screen 
