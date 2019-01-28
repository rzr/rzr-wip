/* -*- mode: js; js-indent-level:2;  -*-
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2018-present Samsung Electronics Co., Ltd. and other contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var webthing = require('webthing-iotjs');
var mqtt = require('mqtt');


function MqttProperty(thing) {
  var self=this;
  webthing.Property.call(this, thing, 'Humidity', new webthing.Value(0));
  thing.client.subscribe('workgroup/TODO/air/humidity');
  thing.client.on('message', function(data) {
    var updatedValue = JSON.parse(data.message.toString())['humidity'];
    self.value.notifyOfExternalUpdate(updatedValue);
  });
}


var thing = new webthing.Thing('MqttSensor');
thing.client = new mqtt.connect({host: 'iot.eclipse.org', port: 1883},
                                function(){thing.addProperty(new MqttProperty(thing));});
var server = new webthing.WebThingServer(new webthing.SingleThing(thing), 8888);
server.start();
