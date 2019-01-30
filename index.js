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
var http = require('https');

// Replace with your openweathermap.org personal key here
// https://api.opensensemap.org/boxes/5c3a9814c4c2f30019f679a1
var boxId = '5c3a9814c4c2f30019f679a1';


var options = {
  hostname: 'api.opensensemap.org',
  port: 443,
  path: '/boxes/' + boxId, 
  rejectUnauthorized: false
};
// '/' + sensorId

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
  if (!options.headers) {
    options.headers = {};
  }
  if (!options.headers.host) {
    options.headers.host = options.hostname;
  }

  http.request(options, function (res) {
    receive(res, function (data) {
      console.log(data);
      var object = JSON.parse(data);
      var property = {
        'value': object
      };
      console.log(JSON.stringify(property));
    });
  }).end();
}
