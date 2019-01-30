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
var http = require('http');

// Replace with your openweathermap.org personal key here
var api_key = 'fb3924bbb699b17137ab177df77c220c';
var location = '48,-1';

var datetime = 'current';

var options = {
  hostname: 'api.openweathermap.org',
  port: 80,
  path: '/pollution/v1/co/' +
    location + '/' + datetime + '.json?appid=' + api_key
};


function receive(incoming, callback) {
  var data = '';

  incoming.on('data', function (chunk) {
    data += chunk;
  });

  incoming.on('end', function () {
    callback && callback(data);
  });
}

if (module.parent === null) {

  // Workaround bug
  if (options.headers === undefined) {
    options.headers = {};
  }
  if (options.headers.host === undefined) {
    options.headers.host = options.hostname;
  }

  http.request(options, function (res) {
    receive(res, function (data) {
      console.log(data);
      var object = JSON.parse(data);
      var property = {
        'timestamp': object.time,
        'value': object.data[0].value
      };
      console.log(JSON.stringify(property));
    });
  }).end();
}
