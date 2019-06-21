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
verbose(process);


function GpioInTest(config)
{
  var self = this;
  if (!config) {
    config = { frequency: 1, gpio: { pin: 0 , direction: gpio.DIRECTION.IN }};
  }
  if (!gpio || !config || !(config.gpio)) {
    throw 'error: gpio: Invalid config: ' + gpio;
  }
  config.frequency = config.frequency || 1;
  config.range = config.range || 0xfff;
  self.config = config;
  self.port = gpio.open(config.gpio, function(err) {
    verbose('log: gpio: ready: ' + err);
    if (err) {
      console.error('error: gpio: Fail to open pin: ' + config.gpio.pin);
      return null;
    }
    self.inverval = setInterval(function() {
      var value = self.port.readSync();
      verbose('log: gpio: update: ' + Boolean(value));
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
  self.config.period = config.frequency && (1000. / config.frequency );
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
var board = process.iotjs.board;
if (board) {
  board = require(board);
} else {
  board = {};
}
console.log(board.pin);
var pin = 'PB0';
if (process.argv.length > 2) {
  pin = String(process.argv[2]);
}
var direction = 'OUT';
if (process.argv.length > 3) {
  direction = String(process.argv[3]);
}
direction = gpio.DIRECTION[direction];
console.log(direction);
console.log(pin);
pin = Number(board.pin[pin]);
console.log(pin);

//TODO handle direction
var config = { frequency: 1,
               gpio: { pin: Number(pin),
                       direction: gpio.DIRECTION.OUT
                     }
             };

verbose('log: Start application on pin: ' + pin);

var app = null;
if (config.gpio.direction === gpio.DIRECTION.IN) {
  app = new GpioInTest(config);
} else if (config.gpio.direction === gpio.DIRECTION.OUT) {
  app = new GpioOutTest(config);
}

setInterval(function(){
  console.log('log: running:' + String(new Date()))
}, 60000);
