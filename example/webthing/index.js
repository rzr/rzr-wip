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

const {
  Property,
  SingleThing,
  Thing,
  Value,
  WebThingServer,
} = require('webthing');
var ColorSensor = require('../index.js'); // HAL

function ColorProperty(thing) {
  var self = this;
  Property.call(this, thing, 'Color',
                         new Value('#000000'),
                         { '@type': 'ColorProperty', type: 'string', readOnly: true });
  this.sensor = new ColorSensor(
//    { 'controller': 'tcs34725' }
  );
  this.sensor.onreading = function() {
    self.value.notifyOfExternalUpdate(self.sensor.color);
  }
  this.sensor.start();
}


function main () {
  var self = this;
  var thing = new Thing('ColorSensor' , ['ColorControl']);
  this.value = new Value('#000000');
  thing.addProperty(new Property(thing,
                                 'Color',
                                 value,
                                 {
                                   '@type': 'ColorProperty', type: 'string', readOnly: true
                                 }));
  
  this.sensor = new ColorSensor(
    //    { 'controller': 'tcs34725' }
  );
  this.sensor.onreading = function() {
    self.value.notifyOfExternalUpdate(self.sensor.color);
  }
  this.sensor.start();
                    

  var server = new WebThingServer(new SingleThing(thing), 58888); 
  process.on('SIGINT', function () {
    server.stop();
  });
  server.start();
}

main();
