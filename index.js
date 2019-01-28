/* -*- mode: js; js-indent-level:4;  -*-
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
var mqtt_config = {host: 'iot.eclipse.org',
    port: 1883};
var topic = 'workgroup/com.github.rzr.webthing-iotjs.example/onoff';


function MqttProperty(thing) {
    var self = this;
    webthing.Property.call(
        this, thing, 'on',
        new webthing.Value(false),
        {'@type': 'BooleanProperty',
            type: 'boolean',
            readOnly: true}
    );
    thing.client.subscribe(topic);
    thing.client.on('message', function(data) {
        var updatedValue = Boolean(JSON.parse(data.message.toString()).onoff);
        console.log('log: update: ' + updatedValue);
        self.value.notifyOfExternalUpdate(updatedValue);
    });
}


var thing = new webthing.Thing('MqttBinarySensor', ['BinarySensor']);
thing.client = new mqtt.connect(
    mqtt_config,
    function() {
        thing.property = new MqttProperty(thing);
        thing.addProperty(thing.property);
        var server = new webthing.WebThingServer(new webthing.SingleThing(thing), 8883);
        server.start();
        if (process.argv[2] === '-i') {
            console.log('log: ready type 1 or 0 to update');
            var istream = fs.createReadStream('/dev/stdin');
            istream.on('data', function(data) {
                var payload = JSON.stringify({onoff: Boolean(Number(data.toString()[0]))});
                thing.client.publish(topic, payload);
            });
        }
    }
);
