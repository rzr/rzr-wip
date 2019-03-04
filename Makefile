#!/bin/make -f
# -*- makefile -*-
# SPDX-License-Identifier: Apache-2.0

default: all
	sync

project?=webthings-webapp
url?=file://${CURDIR}/
upstream_url?=$(shell git remote get-url origin)
branches+=gh-pages
branches+=sandbox/rzr/iotjs/http/master
branches+=sandbox/rzr/webthing-iotjs/https/master

all: rule/branches help
	sync

help: README.md
	cat README.md

%:
	mkdir -p "$@"
	git clone -b "$@" "${upstream_url}" "$@"
	cd "$@" && git remote add local ${url}

rule/branches: ${branches}
	ls $<
