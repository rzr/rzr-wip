* <https://github.com/lws-project/iotjs/blob/master/docs/targets/nuttx/stm32f4dis/IoT.js-API-Stm32f4dis.md#gpio-pin>
* <https://os.mbed.com/platforms/ST-Nucleo-F767ZI/>


* out: PB_0, PB_7
* in: PC_13

nsh> iotjs output.js PB_7


cd /rom/gpio

iotjs index.js  PC_13

EXAMPLES_GPIO=y
CONFIG_ARCH_BUTTONS=y
CONFIG_ARCH_LED=y
CONFIG_RGBLED=y


