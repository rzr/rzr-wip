#!/bin/make -f
# -*- makefile -*-
# SPDX-License-Identifier: MPL-2.0
#{
# Copyright 2018-present Samsung Electronics France SAS, and other contributors
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/# .
#}

mqtt_host=gateway.local
mqtt_host=192.100.0.63
mqtt_base_topic=workgroup/c34d15c97eabe31e8a89a3c2b566998b/
mqtt_topic_name=AirConductivity
mqtt_topic=${mqtt_base_topic}${mqtt_topic_name}
mqtt_topic_key=Conductivity
