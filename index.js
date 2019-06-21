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
    this.client = thing.parent.client;

    var sub_topic = thing.parent.config.base_topic + self.config.topic.endPoint;
    console.log('log: subscribing: ' + sub_topic);
    console.log(thing.parent.config.subscribe);
    this.client.subscribe(sub_topic, thing.parent.config.subscribe,
                          function(error) {
                            if (error) {
                              console.error('error: subscribe failed');
                              throw error;
                            }
                          }
                         );
    this.client.on('message', function(data) {
      if (data.topic === sub_topic) {
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

function App () {
  var self = this;

  var config = {
    port: 8888,
    base_topic: 'io.github.rzr/rzr-wip/TODO/0',
    mqtt: {
      host: 'localhost', // to update
      port: 1883
    }
  };

  config.subscribe = {
    retain: false,
    qos: 2
  };

  if (typeof(process.argv[2]) != 'undefined') {
    config.port = Number(process.argv[2]);
  }

  if (typeof(process.argv[3]) != 'undefined') {
    config.base_topic = String(process.argv[3]);
  }

  if (typeof(process.argv[4]) != 'undefined') {
    config.mqtt.host = String(process.argv[4]);
  }

  if (typeof(process.argv[5]) != 'undefined') {
    config.mqtt.port = Number(process.argv[5]);
  }


  this.properties = [
    {
      name: 'Humidity',
      description: 'Humidity Sensor',
      label: 'Humidity (%)',
      type: 'number',
      topic: {
        endPoint: '/air/humidity',
        type: 'number',
        role: 'humidity'
      }
    }
  ];


  this.config = config;
  this.thing = new Thing('HumidityMqttSensor', ['MultiLevelSensor'], 'A set of sensors');
  this.thing.parent = this;

  console.log('log: connecting: ' + config.mqtt.host);
  this.client = new mqtt.connect(config.mqtt, function() {
    console.log('log: connected, listening on port=' + config.mqtt.port);
    for (var property in self.properties) {
      property = self.properties[property];
      self.thing.addProperty(new MqttProperty(self.thing, null, property));
    }
  });
  console.log('log: http serving on port=' + config.port);
  this.server = new webthing.WebThingServer(new webthing.SingleThing(thing), Number(config.port));
  process.on('SIGINT', function () {
    self.server.stop();
  });
  this.server.start();
}

App();
