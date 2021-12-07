#!/usr/bin/make -f
# -*- makefile coding: utf-8 -*-
# ex: set tabstop=4 noexpandtab:
#
# SPDX-License-Identifier: CC-BY-4.0
# SPDX-License-URL: https://spdx.org/licenses/CC-BY-4.0.html
# SPDX-FileCopyrightText: Huawei Inc.

default: help all
	date -u

project?=oniro-presentations
PORT?=8888

srcs?=$(wildcard *.org | sort)
srcs+=$(wildcard docs/*.org | sort)
srcs+=$(wildcard docs/*/*.org | sort)

objs?=${srcs:.org=.html}
target?=$(shell echo ${srcs:.org=} | tr ' ' '\n' | head -n1)
sudo?=sudo
url?=https://github.com/yjwen/org-reveal
suffix?=/0/

help:
	@echo "# Usage:"
	@echo "#  make help # Usage"
	@echo "#  make setup # Install tools"
	@echo "#  make all # Build html"
	@echo "#  make start # View HTML in Web browser"
	@echo "#  make setup/debian # Install distro tools"
	@echo "#  make setup # Install emacs package"
	@echo "# Config:"	
	@echo "#  srcs=${srcs}"
	@echo "#  objs=${objs}"
	@echo "#  target=${target}"

all: ${objs}
	ls $^

start: ${target}.html
	x-www-browser "$<#${suffix}"

clean:
	rm -rfv *~ */*/*~ tmp tmp.*

cleanall: clean
	find . -iname "*.html" -exec rm -v "{}" \;

setup/debian: /etc/debian_version
	-${sudo} apt-get update
	${sudo} apt-get install -y \
 emacs \
 git \
 sudo \
 unzip \
 wget \
 # EOL

setup: /etc/os-release
	@echo "# Please install tools, On debian: make setup/debian"
	emacs --version
	emacs \
 --no-init-file  \
 --user="${USER}" \
 --batch \
 --eval="(require 'package)" \
 --eval="(add-to-list 'package-archives \
  '(\"melpa\" . \"https://melpa.org/packages/\"))" \
 --eval='(setq gnutls-algorithm-priority "NORMAL:-VERS-TLS1.3")' \
 --eval="(package-show-package-list)" \
 --eval="(package-refresh-contents)" \
 --eval="(package-list-packages)" \
 --eval="(package-install 'org)" \
 --eval="(package-install 'htmlize)" \
 --eval="(package-install 'ox-reveal)" \
 # EOL

%.html: %.org Makefile
	cd ${<D} \
&& \
 emacs \
 --no-init-file \
 --user="${USER}" \
 --batch \
 --eval="(require 'org)" \
 --eval="(require 'ox-reveal)" \
 --find-file="${<F}" \
 --funcall="org-reveal-export-to-html" \
 # EOL

html: ${target}.html
	ls $<

all/%: ${srcs}
	for src in $^ ; do \
    target=$$(echo "$${src}" | sed -e 's|\.org$$||g') ; \
    make target="$${target}" "${@F}" \
    || exit $$? ; \
  done

run:
	python3 -m http.server ${PORT}
