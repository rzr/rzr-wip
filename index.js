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
// TODO: MPL

var console = require('console');
var webthing = require('webthing-iotjs');
var Property = webthing.Property;
var SingleThing = webthing.SingleThing;
var Thing = webthing.Thing;
var Value = webthing.Value;
var WebThingServer = webthing.WebThingServer;
var mqtt = require('mqtt');
var verbose= console.log


//TODO
function baseName(str)
{
  var base = new String(str).substring(str.lastIndexOf('/') + 1); 
    if(base.lastIndexOf(".") != -1)       
        base = base.substring(0, base.lastIndexOf("."));
   return base;
}

function MqttNumberProperty(thing, name, metadata, config) {
  var self = this;
  self.config = config;
  Property.call(
    this,
    thing,
    name,
    new Value(0),
    metadata
  );
  verbose('log: connecting: ' + this.config.mqtt.connect.host);
  this.client = new mqtt.connect(this.config.mqtt.connect, function() {
    verbose('log: connected, listening on port=' + self.config.mqtt.connect.port);
    self.client.subscribe(self.config.mqtt.topic,
                          self.config.mqtt.subscribe,
                          function(error) {
                            verbose('log: subscribed: ' + self.config.mqtt.topic + ' error:' + error );
                            if (error) {
                              console.error('error: subscribe failed');
                              throw error;
                            }
                          });
    self.client.on('message', function(data) {
      verbose('log: message: ' + String(data && data.topic));
      verbose(data.message.toString());
      var object = JSON.parse(data.message.toString());
      var updatedValue = object[self.getName()];
      verbose(updatedValue);
      if (updatedValue !== self.lastValue) {
        verbose('log: ' + self.getName() + ': change: ' + updatedValue);
        self.value.notifyOfExternalUpdate(updatedValue);
        self.lastValue = updatedValue;
      }
    });
  });
}

function start() {
  var self = this;

  self.config = {
    port: 8888,
    mqtt: {
      connect: {
        host: 'localhost',
        port: 1883
      },
      subscribe: {
        qos: 2,
        retain: false
      },
      topic: '#',
    },
    property: {
      name: "level",
      metadata: {
        description: "Level",
        type: 'number',
        readOnly: true,
        '@type': 'LevelProperty'
      }
    }
  };

  if (typeof(process.argv[2]) != 'undefined') {
    this.config.port = Number(process.argv[2]);
  }

  if (typeof(process.argv[3]) != 'undefined') {
    this.config.mqtt.connect.host = String(process.argv[3]);
  }

  if (typeof(process.argv[4]) != 'undefined') {
    this.config.mqtt.connect.port = Number(process.argv[4]);
  }

  if (typeof(process.argv[5]) != 'undefined') {
    this.config.mqtt.topic = String(process.argv[5]);
    this.config.property.name = baseName(this.config.mqtt.topic);
  }

  if (typeof(process.argv[6]) != 'undefined') {
    this.config.property.name = String(process.argv[6]);
  }

  this.thing = new Thing('urn:TODO',
                         'LevelMqttSensor',
                         ['MultiLevelSensor'],
                         'A level sensor');
  this.thing.parent = this;

  this.thing.addProperty(new MqttNumberProperty(this.thing,
                                          this.config.property.name,
                                          this.config.property.metadata,
                                          this.config
                                         ));

  verbose('log: http serving on port=' + config.port);
  this.server = new webthing.WebThingServer(new webthing.SingleThing(thing), Number(self.config.port));
  process.on('SIGINT', function () {
    self.server.stop();
  });
  this.server.start();
}

start();
