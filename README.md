# Usage: #

```sh
url=https://hub.docker.com/r/rzrfreefr/rzr_wip/tags/
image="rzrfreefr/rzr_wip:0.0.20181210"
project="rzr_wip"
net_name="${project}_net"
hostname="${project}_server"
    
docker network rm "${net_name}" ||:
docker network create "${net_name}" ||:

docker run $image # Chromium 63.0.3239.1 

xhost +

docker run \
-e DISPLAY="$DISPLAY"  \
-v /tmp/.X11-unix:/tmp/.X11-unix  \
--network "${net_name}" \
--network-alias "${hostname}"  \
$image --no-sandbox $url \
&

docker run --network "${net_name}" $image --no-sandbox --type=renderer --server-address=${hostname}
```
