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
var console = require('console');
var i2c = require('i2c');

var Wire = function(options) {
  this.config = options || {};
  if (this.config.device === undefined) {
    this.config.device = '/dev/i2c-1';
  }
  if (this.config.bus === undefined) {
    this.config.bus = 1;
  }
  if (this.config.address === undefined) {
    this.config.address = 0x29;
  }
  if (i2c.openSync) {
    this.wire = i2c.openSync(this.config);
  } else {
    this.wire = new i2c(this.config.address, {device: this.config.device});
  }
  if (!this.wire.readBytes) {
    this.wire.readBytes = function(offset, len, callback) {
      this.writeSync([offset]);
      this.read(len, function(err, res) {
        callback(err, res);
      });
    }
  }
  return this.wire;
}

var TCS34725 = function(options) {
  this.wire = new Wire(options);
  this.wire.writeSync([0x80|0x00, 0x01|0x02 ] ); // Command Enable
  //this.wire.writeSync([0x80|0x0F, 0x10 ] ); // Command Gain (p26)
  // 11 #0e1e33
  // 10 #03070d
};

TCS34725.prototype.read = function(callback) {
  this.wire.writeSync([0x80|0x00, 0x01|0x02 ] ); // Command Enable
  
  this.wire.readBytes(0x80|0x14, 8, function(err, res) { // Command Data
    if (err) {
      return callback && callback(err, null);
    }

    //console.log(Array(res));
    var gain = 19; // B=10
    var data = [
      gain * (res[3] << 8 | res[2]), // Red
      gain * (res[5] << 8 | res[4]), // Green
      gain * (res[7] << 8 | res[6]), // Blue
      gain * (res[1] << 8 | res[0]), // Clear
    ];
    console.log(data);
    callback && callback(null, data);
  });
};

module.exports = TCS34725;

if (module.parent === null) {
  var sensor = new TCS34725();
  sensor.read(function(err, value){
    if (err) {
      console.error("error: " + err);
      throw err;
    } else {
      console.log("log: value=" + JSON.stringify(value));
    }
  });
}
