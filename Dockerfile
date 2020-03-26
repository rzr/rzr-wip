FROM debian:10

RUN set -x \
 && apt-get update -y \
 && apt-get install -y \
  build-essential \
  libpcre3 \
  libpcre3-dev \
  libssl-dev \
  unzip \
  zlib1g-dev \
  sudo \
 && sync

ENV project TODO
ENV workdir /usr/local/opt/${project}
ENV rtmpPort 1935

WORKDIR ${workdir}
ADD http://nginx.org/download/nginx-1.15.1.tar.gz .
ADD https://github.com/sergey-dryabzhinsky/nginx-rtmp-module/archive/dev.zip .

RUN set -x \
  && tar -zxvf nginx-1.15.1.tar.gz \
  && unzip dev.zip \
  && cd nginx-1.15.1 \
  && ./configure --with-http_ssl_module --add-module=../nginx-rtmp-module-dev \
  && make && make install \
  && sync

RUN set -x \
  && printf "\n\
  rtmp { \n\
        server { \n\
                listen ${rtmpPort}; \n\
                chunk_size 4096; \n\
                application live { \n\
                        live on; \n\
                        record off; \n\
                } \n\
        } \n\
} \n\
" | tee -a /usr/local/nginx/conf/nginx.conf \
 && cat /usr/local/nginx/conf/nginx.conf \
 && sync

#  sudo 

EXPOSE ${rtmpPort}
EXPOSE 80
WORKDIR /usr/local/nginx/
ENTRYPOINT [ "/usr/local/nginx/sbin/nginx"]

