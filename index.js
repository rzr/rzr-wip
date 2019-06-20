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
var console = require('console');

var webthing = require('webthing-iotjs');
var mqtt = require('mqtt');
var fs = require('fs');


var config = {
  base_topic: 'io.github.rzr/espurna/0',
  mqtt: {
    host: 'localhost', // to update
    port: 1883
  }
};

config.subscribe = {
  retain: false,
  qos: 2
};

config.port = Number(process.argv[2] || 8888);
// espruna endpoints
config.pub_topic = config.base_topic + '/relay/0/set';
config.sub_topic = config.base_topic + '/data';



if (typeof(process.argv[3]) != 'undefined') {
  config.base_topic = String(process.argv[3]);
}

if (typeof(process.argv[4]) != 'undefined') {
  config.mqtt.host = String(process.argv[4]);
}

if (typeof(process.argv[5]) != 'undefined') {
  config.mqtt.port = Number(process.argv[5]);
}

console.log(config);

function MqttProperty(thing) {
  console.log('MqttProperty');
  var self = this;
  self.thing = thing;
  webthing.Property.call(
    this, thing, 'on',
    new webthing.Value(false, function(data) {
      console.log('publishing');
      var payload = data
          ? '1' : '0';
      self.thing.client.publish(self.thing.config.pub_topic, payload);
    }),
    {'@type': 'OnOffProperty',
     type: 'boolean'
    }
  );
}

function App()
{
  var self = this;
  self.config = config;
  self.thing = new webthing.Thing('MqttOnOffSwitch', ['OnOffSwitch']);
  self.thing.config = config;

  console.log('log: connecting');
  thing.client = new mqtt.connect(config.mqtt, function() {
    console.log('log: connected');
    thing.property = new MqttProperty(thing);
    thing.addProperty(thing.property);
    self.server = new webthing.WebThingServer(new webthing.SingleThing(thing), config.port);
    self.server.start();
    console.log('log: reading');
    if (process.argv[2] === '-i') {
      console.log('log: ready type 1 or 0 to update');
      var istream = fs.createReadStream('/dev/stdin');
      istream.on('data', function(data) {
        var payload = JSON.stringify({onoff: Boolean(Number(data.toString()[0]))});
        thing.client.publish(self.config.topic, payload);
      });
    }
    console.log('log: subscribing: ' + self.config.sub_topic);
    self.thing.client.subscribe(self.config.sub_topic, self.config.subscribe, function() {
      console.log('subscribed: ' + this);
      self.thing.client.on('message', function(data) {
        console.log(String(data.message));
      });
    });
  });
}

App();
