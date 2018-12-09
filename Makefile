#! /usr/bin/make -f
# -*- makefile -*-
# ex: set tabstop=4 noexpandtab:

default: help

project=castanets
dir=${CURDIR}/bin
exe=${dir}/chrome
url?=https://github.com/Samsung/castanets
requires?=libasound2, \
 libgconf-2-4, \
 libgtk-3-0, \
 libnss3, \
 libxss1 \
#EOL

help:
	echo "TODO"

%: help

install: ${exe}
	install -d ${DESTDIR}/usr/lib/${project}
	cp -rf ${<D}/* ${DESTDIR}/usr/lib/${project}

${exe}:
	mkdir -p ${@D}
	touch ${exe}


checkinstall: Makefile
	checkinstall --version
	checkinstall \
--install=no \
--maintainer=p.coval@samsung.com \
--nodoc \
--pkglicense="BSD-3-clause and others" \
--pkgrelease=0 \
--pkgsource=${url} \
--pkgversion=0.0.0 \
--requires="${requires}" \
-y
