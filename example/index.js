// -*- mode: js; js-indent-level:2; -*-
// SPDX-License-Identifier: Apache-2.0
/* Copyright 2018-present Samsung Electronics France
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

'use strict';

var SensorController;
try {
  SensorController = require('../color-sensor-js');
} catch(err) {
  SensorController = require('color-sensor-js');
}

/**
 * Class inspired by W3C's generic-sensor API
 **/
function ColorSensor(options) {
  this.state = 'construct';
  this.type = 'color';
  this.color = '#000000';
  this.level = 'low';
  this.activated = false;
  this.interval = null;
  this.onerror = function(err) {
    throw new Error(err);
  };
  this.onactivate = function() {};
  this.onreading = function() {};

  this.options = options || {};
  this.options.frequency = this.options.frequency || 1;
  this.options.controller = this.options.controller || 'simulator';
  try {
    this.sensor = new SensorController[this.options.controller];
  } catch(err) {
    throw new Error("TODO: unsupported controller: " + this.options.controller);
  }
  this.state = 'idle';

  return this;
}

ColorSensor.prototype.update = function update() {
  var self = this;
  try {
    self.hasReading = false;
    self.sensor.read(function (err, data) {
      if (err || (data === null) || (typeof data === 'undefined')) {
        return self.onerror(data);
      } else {
        self.timestamp = new Date();
        self.color = '#';
        for(var i=0; i < 3; i++) {
          var num = Math.floor(Number(data[i])/0xFFFF*0xFF);
          if (num <= 0xF) {
            self.color += '0';
          }
          self.color += num.toString(0x10);
        }

        self.hasReading = true;
        self.onreading();
        self.hasReading = false;
      }
    });
  } catch (err) {
    self.onerror(err);
  }
}

ColorSensor.prototype.stop = function stop() {
  if ( this.state === 'idle' ) return;
  this.interval = clearInterval(this.interval);
  this.state = 'idle';
}

ColorSensor.prototype.start = function start() {
  var self = this;
  self.state = 'activating';
  try {
    if (!self.interval) {
      self.interval = setInterval(function() { self.update(); },
                                  1000. / self.options.frequency);
      self.onactivate();
      self.state = 'activated';
    }
  } catch(err) {
    self.onerror(err);
  }
}

module.exports = ColorSensor;

if (module.parent === null) {
  var sensor = new ColorSensor();
  sensor.onreading = function() {
    console.log("log: " + sensor.color);
  }
  sensor.start();
}
