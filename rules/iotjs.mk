iotjs_dir=iotjs
IOTJS_ROOT_DIR="${iotjs_dir}"
export IOTJS_ROOT_DIR
IOTJS_ABSOLUTE_ROOT_DIR="${CURDIR}/${iotjs_dir}"
export IOTJS_ABSOLUTE_ROOT_DIR



iotjs:
	git clone --depth 1 --recursive https://github.com/Samsung/iotjs
	ls $@

rule/iotjs/build/base: nuttx/.config
	which arm-none-eabi-gcc || sudo apt-get install gcc-arm-none-eabi
	${MAKE} \
 IOTJS_ABSOLUTE_ROOT_DIR=${IOTJS_ABSOLUTE_ROOT_DIR} \
 IOTJS_ROOT_DIR=../${IOTJS_ROOT_DIR} \
 -C ${nuttx_dir}

iotjs/build/arm-nuttx/debug/lib/%: rule/iotjs/build
	ls $@

rule/iotjs/build: nuttx/.config build/base iotjs/build
	which arm-none-eabi-gcc || sudo apt-get install gcc-arm-none-eabi
	${MAKE} \
 IOTJS_ABSOLUTE_ROOT_DIR=${IOTJS_ABSOLUTE_ROOT_DIR} \
 IOTJS_ROOT_DIR=../${IOTJS_ROOT_DIR} \
 -C ${nuttx_dir}

rule/iotjs/build: iotjs/config/nuttx/stm32f4dis/config.default ${nuttx_dir}
	cd iotjs && ./tools/build.py \
--target-arch=arm \
--target-os=nuttx \
--nuttx-home=../${nuttx_dir} \
--target-board=${machine} \
--jerry-heaplimit=78


#${image_file}: build
#	ls -l $@

#prep: nuttx apps stlink patch
#	sync

#monitor: /dev/ttyACM0 deploy
#	screen $< ${monitor_rate}

#all: prep configure build

#run: deploy monitor

#docker/run:
#	docker-compose up ||:
#	docker build -t "rzrwip_default" .
#	docker run --privileged --rm -ti "rzrwip_default" run

apps/system/iotjs: iotjs apps
	@mkdir -p $@
	cp -rf iotjs/config/nuttx/stm32f4dis/app/* $@/

iotjs/meld: iotjs/config/nuttx/stm32f4dis/config.default nuttx/.config
	$@ $^


iotjs/clean:
	rm -rf iotjs/build

devel: menuconfig build run


tmp/done/patch/iotjs/%: patches/iotjs/% iotjs
	cd iotjs && git am ${CURDIR}/$<
	mkdir -p ${@D}
	touch $@

tmp/done/patch/libtuv/%: patches/libtuv/% iotjs/deps/libtuv
	cd iotjs/deps/libtuv && patch -p1 < ${CURDIR}/$<
	mkdir -p ${@D}
	touch $@

patch/%: patches/% tmp/done/patch/%
	wc -l $<

patch: \
 tmp/done/patch/iotjs/0001-STM32F3-support.patch \
 tmp/done/patch/libtuv/0001-STM32F3-support.patch \
 # EOL
 # TODO: tmp/done/patch/iotjs/0002-wip.patch 
	ls $^

build/iotjs: apps/system/iotjs menuconfig build
