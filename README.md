## USAGE ##

### NSH ###

```sh
make devel
make
make deploy
make monitor

screen /dev/ttyACM1 115200
```

### IOTJS ###

```sh
make rule/iotjs/devel
```

```sh
ifdown eth0; ifconfig eth0 hw 00:80:E1:ff:ff:ff; ifup eth0; renew eth0;
ifconfig
```
