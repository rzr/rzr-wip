nuttx_url=file:///${HOME}/mnt/nuttx
#nuttx_branch=sandbox/rzr/devel/master
nuttx_branch?=sandbox/rzr/review/master

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


rule/tizenrt/diff:


rule/stm32/diff:
	meld nuttx/configs/stm32f429i-disco  nuttx/configs/nucleo-144/


rule/nucleo: \
 ${nuttx_dir}/configs/nucleo-144/f767-nsh/defconfig \
 ${nuttx_dir}/configs/nucleo-144/f767-netnsh/defconfig 
	meld $^


docker/run:
	docker-compose up ||:
	docker build -t "rzrwip_default" .
	docker run --privileged --rm -ti "rzrwip_default" run

patch/%: patches/% tmp/done/patch/%
	wc -l $<

patch:
	ls $^

clean:
	-find . -iname "*.a" -exec rm {} \;

distclean: clean
	-${MAKE} rule/nuttx/distclean
	sync

devel: rule/nuttx/devel

