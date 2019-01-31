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
var webthing = require('webthing-iotjs');
var console = require('console');
var http = require('https');


/* Replace with your openweathermap.org personal key here
   https://api.opensensemap.org/boxes/5c3a9814c4c2f30019f679a1 */
var app = {

  config: {
    log: false,
    port: 8888,
    server: {
      hostname: 'api.opensensemap.org',
      port: 443,
      rejectUnauthorized: false
    },
    boxId: '5c3a9814c4c2f30019f679a1',
    sensors: [
          {id: '5c3a9814c4c2f30019f679a5',
           type: 'pm10'}
    ]
  },
  // TODO: parse stream
  sensors: {}
};

// TODO
app.config.port = 8892;

/* App.config.server.hostname = 'localhost';
   app.config.server.port = 8880; */


function receiveObject(incoming, callback) {
  var data = '';
  incoming.on('data', function (chunk) {
    data += chunk;
  });
  incoming.on('end', function(err) {
    var object = null;
    try {
      data = '{ "data": ' + data + '}';
      object = JSON.parse(data);
    } catch (exception) {
      console.log('err:' + exception);
    }
    if (callback) {
      return callback(err, object);
    }

    return err;
  });
}

function update(config, callback) {

  // Workaround bug
  if (!config.headers) {
    config.headers = {};
  }
  if (!config.host) {
    config.host = config.hostname;
  }
  console.log('TODO: async loop');
  if (typeof app.sensors === 'undefined') {
    config.path = '/boxes/' + app.config.boxId;
    http.request(config, function(res) {
      receiveObject(res, function (err, object) {
        console.log(object);
        app.sensors = [];
        app.sensors[0] = object.data.sensors[0];
        callback && callback(err, null);
      });
    }).end();
  } else {
    var idx = 0;
    config.path = '/boxes/' + app.config.boxId +
      '/data/' + app.config.sensors[idx].id;
    console.log('log: path: ' + config.path);
    http.request(config, function(res) {
      receiveObject(res, function (err, object) {
        callback && callback(err, object);
      });
    }).end();
  }
}


function SomeProperty(thing) {
  var self = this;
  webthing.Property.call(
    this, thing, 'pm10', new webthing.Value(0),
    {'@type': 'MultiLevelSensor', type: number}
  );
  setInterval(function() {
    update(app.config.server, function(err, object) {
      console.log('update:' + err + '/' + object);
      if (err) {
        throw err;
      }
      try {
        var value = object.data[0].value;
        self.value.notifyOfExternalUpdate(value);
        app.sensors[app.config.sensors[0].type] = value;
        console.log(app.sensors);
      } catch (exception) {
        console.log(exception);
      }
    });
  }, 2 * 1000);
}

if (module.parent === null) {
  app.thing = new webthing.Thing('AirQualitySensor', ['MultiLevelSensor']);
  app.thing.addProperty(new SomeProperty(app.thing));
  app.server = new webthing.WebThingServer(
    new webthing.SingleThing(app.thing),
    app.config.port
  );
  app.server.start();
}
