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
var Property = webthing.Property;
var SingleThing = webthing.SingleThing;
var Thing = webthing.Thing;
var Value = webthing.Value;
var WebThingServer = webthing.WebThingServer;

var mqtt = require('mqtt');

var mqtt_options = {
  client: {
    host: 'iot.eclipse.org',
    endPoint: 'TODO',
    port: 1883,
    keepalive: 10,
    clientId: 'IoT.js Client'
  },
  subscribe: {
    retain: false,
    qos: 2
  }
};

var options = [
  {
    name: 'Humidity',
    description: 'Humidity Sensor',
    label: 'Humidity (%)',
    type: 'number',
    mqtt: mqtt_options,
    topic: {
      endPoint: '/air/humidity',
      type: 'number',
      role: 'humidity'
    }
  }
];


function MqttProperty(thing, value, config) {
  var self = this;
  self.config = config || {};
  self.config.value = value || 0;
  self.config.name = self.config.name || 'Unknown';
  self.config.description = self.config.description || '?';
  self.config.label = self.config.label || '?';
  self.config.topic.type = self.config.topic.type || 'number';
  if (self.config.topic.type === 'number') {
    self.config.topic.propType = 'LevelProperty';
  }
  self.config = config;
  Property.call(
    this, thing, self.config.name,
    new Value(self.config.value),
    {
      '@type': self.config.topic.propType,
      description: self.config.description,
      label: self.config.label,
      readOnly: true,
      type: self.config.topic.type
    }
  );
  {
    self.client = thing.client;
    self.config.topic.uri =
      self.config.mqtt.client.endPoint + self.config.topic.endPoint;
    console.log('log: subscribing: ' + self.config.topic.uri);
    self.client.subscribe(
      self.config.topic.uri, self.config.mqtt.subscribe,
      function(error) {
        if (error) {
          console.error('error: subscribe failed');
        }
      }
    );

    self.client.on('message', function(data) {
      if (data.topic === self.config.topic.uri) {
        var object = JSON.parse(data.message.toString());
        var updatedValue = object[self.config.topic.role];
        if (self.config.topic.type === 'number') {
          updatedValue = Number(updatedValue);
        }
        if (updatedValue !== self.lastValue) {
          console.log('log: ' + self.getName() + ': change: ' + updatedValue);
          self.value.notifyOfExternalUpdate(updatedValue);
          self.lastValue = updatedValue;
        }
      }
    });
  }
}


function main () {
  var port = process.argv[2] ? Number(process.argv[2]) : 8888;
  mqtt_options.client.endPoint = process.argv[3] ? String(process.argv[3])
    : "workgroup/com.github.rzr.webthing-iotjs.example.todo";
  
  var thing = new Thing('MQTT Source', ['MultiLevelSensor'], 'A set of sensors');
  
  thing.client = new mqtt.connect(mqtt_options.client, function () {
    for (var idx = 0; idx < options.length; idx++) {
      thing.addProperty(new MqttProperty(thing, null, options[idx]));
    }
  });

  var server = new WebThingServer(new SingleThing(thing), port);
  process.on('SIGINT', function () {
    server.stop();
  });
  server.start();
}

main();
