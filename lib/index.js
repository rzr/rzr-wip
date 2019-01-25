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

var TCS34725 = function(options) {
  this.value = [0, 0, 0, 0];
};

TCS34725.prototype.read = function(callback) {
  for (var i=0; i < this.value.length; i++) {
    this.value[i] = Math.floor(Math.random()*0xFFFF);
  }
  callback && callback(null, this.value);
};

module.exports = TCS34725;
 
module.exports.main = function() {
};

if ( module.parent === null) {
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
