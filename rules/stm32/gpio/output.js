// -*- mode: js; js-indent-level:2;  -*-
/* Copyright 2018-present Samsung Electronics Co., Ltd. and other contributors
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
var verbose = console.log || function(arg) {};
var gpio = require('gpio');
verbose(process);


function GpioOutTest(config)
{
  var self = this;
  if (!config) {
    config = { gpio: { pin: 0 , direction: gpio.DIRECTION.OUT }};
  }
  if (!gpio || !config || !(config.gpio)) {
    throw 'error: gpio: Invalid config: ' + gpio;
  }
  self.config = config;
  verbose('log: opening: pin=' + config.gpio.pin);
  self.port = gpio.open(config.gpio, function(err) {
    verbose('log: gpio: ready: ' + err);
    if (err) {
      console.error('error: gpio: Fail to open pin: ' + config.gpio.pin);
      throw err;
    }
    self.value = false;
    self.inverval = setInterval(function() {
      self.value = !self.value;
      self.port.writeSync(self.value);
      verbose('log: gpio: update: ' + Boolean(self.value));
    }, self.config.period);
  });

  self.close = function() {
    try {
      self.inverval && clearInterval(self.inverval);
      self.port && self.port.closeSync();
    } catch(err) {
      console.error('error: gpio: close:' + err);
    }
  }
}

var gpio = require('gpio');
var pin = 0;
if (process.argv.length > 2) {
  pin = Number(process.argv[2]);
}
var config = { frequency: 1, gpio: { pin: pin , direction: gpio.DIRECTION.OUT }};
var test = null;

if (config.direction === gpio.DIRECTION.OUT) {
  test = new GpioOutTest(config);
}

setInterval(function(){
  console.log('log: running:' + String(new Date()));
}, 60000);
