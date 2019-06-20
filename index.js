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


// Change topic here
var topic = 'io.github.rzr';
var pub_topic = topic + '/relay/0/set';
var port = Number(process.argv[2] || 8888);
var config = {
  mqtt: {
    host: 'localhost', // to update
    port: 1883
  }
};

if (typeof(process.argv[3]) != 'undefined') {
  config.mqtt.host = String(process.argv[3]);
}

function MqttProperty(thing) {
  var self = this;
  self.thing = thing;
  webthing.Property.call(
    this, thing, 'on',
    new webthing.Value(false, function(data) {
      var payload = data
          ? '1' : '0';
      self.thing.client.publish(pub_topic, payload);
    }),
    {'@type': 'OnOffProperty',
     type: 'boolean'
    }
  );
}

function App()
{
  var self = this;
  self.thing = new webthing.Thing('MqttOnOffSwitch', ['OnOffSwitch']);
  console.log('log: connecting');
  console.log(config.mqtt);
  thing.client = new mqtt.connect(
    config.mqtt,
    function() {
      thing.property = new MqttProperty(thing);
      thing.addProperty(thing.property);
      var server = new webthing.WebThingServer(new webthing.SingleThing(thing), port);
      server.start();
      if (process.argv[2] === '-i') {
        console.log('log: ready type 1 or 0 to update');
        var istream = fs.createReadStream('/dev/stdin');
        istream.on('data', function(data) {
          var payload = JSON.stringify({onoff: Boolean(Number(data.toString()[0]))});
          thing.client.publish(topic, payload);
        });
      }

      if (!false) {
        var sub_topic="io.github.rzr/data";
        var subscribe_opts = {
          retain: false,
          qos: 2
        };

        console.log('log: subscribing: ' + sub_topic);
        self.thing.client.subscribe(sub_topic, subscribe_opts, function() {
          console.log('subscribed: ' + this);
          self.thing.client.on('message', function(data) {
            console.log(String(data.message));
          });
        });
      }
    }
  );

}

App();
