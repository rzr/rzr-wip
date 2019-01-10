

ref_file?=./nuttx/configs/stm32f746g-disco/nsh-ethernet/defconfig
ref_file?=./nuttx/configs/stm32f769i-disco/nsh-ethernet/defconfig 

rule/nuttx/diff: ${nuttx_dir}
	meld ${ref_file} \


rule/nuttx/meld: ./nuttx/configs/${nuttx_config}/defconfig
	ls nuttx/.config
	meld nuttx/.config $<
