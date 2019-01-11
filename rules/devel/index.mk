

ref_file?=./nuttx/configs/stm32f746g-disco/nsh-ethernet/defconfig
ref_file?=./nuttx/configs/stm32f769i-disco/nsh-ethernet/defconfig 

#rule/nuttx/diff: ${nuttx_dir}
#	meld ${ref_file} \


rule/nuttx/meld: ./nuttx/configs/${nuttx_config}/defconfig
	ls nuttx/.config
	meld nuttx/.config $<

#run: deploy monitor

#docker/run:
#	docker-compose up ||:
#	docker build -t "rzrwip_default" .
#	docker run --privileged --rm -ti "rzrwip_default" run

