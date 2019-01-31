/* -*- mode: js; js-indent-level:2;  -*-
   SPDX-License-Identifier: MPL-2.0 */

/**
 * Reimplimentation of Express API for IoT.js
 *
 * Copyright 2018-present Samsung Electronics France SAS, and other contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */
// Disable logs here by editing to '!console.log'
var verbose = console.log || function () {};

function Express() {
  var _this2 = this;

  var _this = this;

  this.routes = {
    GET: {},
    PUT: {}
  };

  this.extendsServerResponse = function (res) {
    if (!res.json) {
      res.json = function (object) {
        return res.end(JSON.stringify(object));
      };
    }

    return res;
  };

  this.receive = function (incoming, callback) {
    var data = '';
    incoming.on('data', function (chunk) {
      data += chunk;
    });
    incoming.on('end', function () {
      incoming.body = JSON.parse(data);

      if (!incoming.params) {
        incoming.params = {};
      }

      if (!incoming.params.propertyName) {
        incoming.params.thingId = 0;
        incoming.params.propertyName = Object.keys(incoming.body)[incoming.params.thingId];
      }

      callback ? callback(incoming) : '';
    });
  };

  this.parse = function (req, pattern) {
    if (req.url.split('/').length != pattern.split('/').length) {
      return false;
    }

    var result = {};
    var re = /:[^/]+/g;
    var ids = pattern.match(re);
    re = pattern.replace('/', '\\/');
    re = '^'.concat(re, '$');

    for (var id in ids) {
      id = ids[id];
      re = re.replace(id, '([^/]+)');
    }

    re = new RegExp(re, 'g');

    if (!req.url.match(re)) {
      return false;
    }

    for (var idx in ids) {
      var value = req.url.replace(re, '$'.concat(Number(idx) + 1));

      if (value) {
        result[ids[idx].substring(1)] = value;
      }
    }

    req.params = result;

    if (ids && Object.keys(result) && Object.keys(result).length != ids.length) {
      return false;
    }

    return true;
  };

  this.handlePut = function (req, res, pattern, callback) {
    if (req.method !== 'PUT') {
      return;
    }

    if (_this2.parse(req, pattern)) {
      res = _this2.extendsServerResponse(res);

      if (callback) {
        callback(req, res);
      }
    }
  };

  this.handleRequest = function (req, res, pattern, callback) {
    if (req.method === 'PUT') {
      _this2.receive(req, function (req) {
        _this.handlePut(req, res, pattern, callback);
      });
    } else if (req.method === 'GET') {
      if (_this2.parse(req, pattern)) {
        res = _this2.extendsServerResponse(res);

        if (callback) {
          callback(req, res);
        }
      }
    }
  };

  this.get = function (pattern, callback) {
    _this.routes.GET[pattern] = callback;
  };

  this.put = function (pattern, callback) {
    _this.routes.PUT[pattern] = callback;
  };

  this.request = function (req, res) {
    verbose('log: request: '.concat(req.url));
    req.params = {};

    for (var pattern in _this.routes[req.method]) {
      var callback = _this.routes[req.method][pattern];

      _this.handleRequest(req, res, pattern, callback);
    }
  };
}

module.exports = function () {
  return new Express();
};

if (module.parent === null) {
  var http = require('https');
  var app = new Express();
  var self = http.createServer(app.request);
  app.get('/', function(req, res) {
    var object = {};

    return res.json(object);
  });

  // Eg:  5c3a9814c4c2f30019f679a1/data/5c3a9814c4c2f30019f679a5'
  app.get('/boxes/:box/data/:sensor', function(req, res) {
    var object = {'box': true};
    // If (false)
    object = {'value':
               [
                 {'value': '4.12',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:58:44.211Z'},
                 {'value': '2.37',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:55:53.004Z'},
                 {'value': '2.37',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:53:13.690Z'},
                 {'value': '3.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:50:37.715Z'},
                 {'value': '2.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:47:31.070Z'},
                 {'value': '3.25',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:44:39.414Z'},
                 {'value': '2.52',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:41:57.064Z'},
                 {'value': '3.58',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:39:20.964Z'},
                 {'value': '2.85',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:36:18.699Z'},
                 {'value': '2.27',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:33:36.239Z'},
                 {'value': '2.65',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:30:33.940Z'},
                 {'value': '2.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:27:51.439Z'},
                 {'value': '3.37',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:25:01.916Z'},
                 {'value': '3.52',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:22:25.300Z'},
                 {'value': '2.62',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:19:36.572Z'},
                 {'value': '5.47',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:16:39.063Z'},
                 {'value': '2.22',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:13:50.734Z'},
                 {'value': '3.02',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:10:53.202Z'},
                 {'value': '4.35',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:08:04.984Z'},
                 {'value': '4.55',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:05:25.681Z'},
                 {'value': '3.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T11:02:43.413Z'},
                 {'value': '3.27',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:59:48.451Z'},
                 {'value': '2.35',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:56:57.278Z'},
                 {'value': '3.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:54:15.348Z'},
                 {'value': '4.33',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:51:39.288Z'},
                 {'value': '5.17',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:49:05.810Z'},
                 {'value': '4.62',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:46:27.172Z'},
                 {'value': '2.37',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:43:50.732Z'},
                 {'value': '2.92',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:41:11.272Z'},
                 {'value': '2.47',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:38:32.025Z'},
                 {'value': '3.52',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:35:52.741Z'},
                 {'value': '3.58',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:33:16.534Z'},
                 {'value': '3.25',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:30:31.344Z'},
                 {'value': '2.55',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:27:52.159Z'},
                 {'value': '3.45',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:25:11.514Z'},
                 {'value': '4.45',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:22:23.159Z'},
                 {'value': '3.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:19:40.804Z'},
                 {'value': '3.20',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:17:04.468Z'},
                 {'value': '3.42',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:14:14.786Z'},
                 {'value': '3.92',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:11:29.702Z'},
                 {'value': '4.28',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:08:35.416Z'},
                 {'value': '4.47',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:05:45.409Z'},
                 {'value': '3.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T10:02:56.935Z'},
                 {'value': '3.98',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:59:57.676Z'},
                 {'value': '5.22',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:57:18.592Z'},
                 {'value': '6.37',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:54:36.799Z'},
                 {'value': '5.35',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:52:00.680Z'},
                 {'value': '6.20',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:49:21.487Z'},
                 {'value': '4.03',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:46:30.437Z'},
                 {'value': '5.22',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:43:44.964Z'},
                 {'value': '4.95',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:40:55.151Z'},
                 {'value': '5.15',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:38:19.063Z'},
                 {'value': '6.45',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:35:39.520Z'},
                 {'value': '5.35',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:33:01.940Z'},
                 {'value': '8.23',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:30:19.517Z'},
                 {'value': '7.85',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:27:21.758Z'},
                 {'value': '6.20',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:24:22.512Z'},
                 {'value': '8.55',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:21:30.717Z'},
                 {'value': '9.58',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:18:57.251Z'},
                 {'value': '7.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:16:25.755Z'},
                 {'value': '9.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:13:55.535Z'},
                 {'value': '7.83',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:11:25.316Z'},
                 {'value': '4.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:08:55.104Z'},
                 {'value': '9.53',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:06:24.890Z'},
                 {'value': '4.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:03:54.672Z'},
                 {'value': '10.23',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T09:01:24.448Z'},
                 {'value': '12.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:58:54.219Z'},
                 {'value': '13.18',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:56:23.979Z'},
                 {'value': '13.45',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:53:53.743Z'},
                 {'value': '11.05',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:51:23.520Z'},
                 {'value': '8.65',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:48:53.291Z'},
                 {'value': '6.55',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:46:23.075Z'},
                 {'value': '10.45',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:43:52.859Z'},
                 {'value': '8.48',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:41:22.636Z'},
                 {'value': '9.08',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:38:52.416Z'},
                 {'value': '4.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:36:22.199Z'},
                 {'value': '7.97',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:33:51.792Z'},
                 {'value': '7.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:31:21.575Z'},
                 {'value': '9.25',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:28:51.365Z'},
                 {'value': '5.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:26:21.125Z'},
                 {'value': '7.03',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:23:50.914Z'},
                 {'value': '4.47',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:21:20.692Z'},
                 {'value': '4.55',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:18:50.471Z'},
                 {'value': '3.75',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:16:20.208Z'},
                 {'value': '5.33',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:13:49.996Z'},
                 {'value': '3.25',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:11:19.715Z'},
                 {'value': '2.95',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:08:49.498Z'},
                 {'value': '2.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:06:19.083Z'},
                 {'value': '2.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:03:48.882Z'},
                 {'value': '3.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T08:01:18.682Z'},
                 {'value': '2.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:58:48.475Z'},
                 {'value': '3.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:56:18.275Z'},
                 {'value': '3.25',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:53:48.062Z'},
                 {'value': '3.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:51:17.843Z'},
                 {'value': '3.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:48:47.647Z'},
                 {'value': '3.35',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:46:17.431Z'},
                 {'value': '3.35',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:43:47.223Z'},
                 {'value': '2.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:41:17.020Z'},
                 {'value': '2.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:38:46.797Z'},
                 {'value': '3.62',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:36:16.576Z'},
                 {'value': '3.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:33:46.360Z'},
                 {'value': '3.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:31:16.147Z'},
                 {'value': '2.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:28:45.941Z'},
                 {'value': '3.35',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:26:15.715Z'},
                 {'value': '2.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:23:45.902Z'},
                 {'value': '2.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:21:13.596Z'},
                 {'value': '2.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:18:43.364Z'},
                 {'value': '2.45',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:16:13.143Z'},
                 {'value': '2.52',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:13:42.927Z'},
                 {'value': '2.58',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:11:12.703Z'},
                 {'value': '2.47',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:08:42.479Z'},
                 {'value': '2.22',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:06:12.236Z'},
                 {'value': '2.47',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:03:42.015Z'},
                 {'value': '2.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T07:01:11.792Z'},
                 {'value': '3.55',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:58:41.192Z'},
                 {'value': '2.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:56:09.784Z'},
                 {'value': '2.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:53:39.566Z'},
                 {'value': '2.65',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:51:09.335Z'},
                 {'value': '2.45',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:48:39.121Z'},
                 {'value': '2.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:46:08.892Z'},
                 {'value': '3.65',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:43:38.679Z'},
                 {'value': '3.33',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:41:18.000Z'},
                 {'value': '2.83',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:38:37.108Z'},
                 {'value': '2.65',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:36:06.868Z'},
                 {'value': '2.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:33:36.650Z'},
                 {'value': '2.45',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:31:06.431Z'},
                 {'value': '2.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:28:36.776Z'},
                 {'value': '3.07',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:26:07.124Z'},
                 {'value': '2.43',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:23:36.187Z'},
                 {'value': '2.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:21:06.532Z'},
                 {'value': '3.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:18:36.880Z'},
                 {'value': '2.77',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:16:07.063Z'},
                 {'value': '2.83',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:13:37.197Z'},
                 {'value': '2.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:11:07.561Z'},
                 {'value': '2.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:08:34.933Z'},
                 {'value': '3.43',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:06:05.278Z'},
                 {'value': '2.63',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:03:35.629Z'},
                 {'value': '3.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T06:01:05.977Z'},
                 {'value': '3.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:58:36.315Z'},
                 {'value': '3.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:56:06.663Z'},
                 {'value': '2.73',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:53:37.019Z'},
                 {'value': '3.57',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:51:07.135Z'},
                 {'value': '4.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:48:37.374Z'},
                 {'value': '3.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:46:06.555Z'},
                 {'value': '2.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:43:36.899Z'},
                 {'value': '2.83',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:41:07.069Z'},
                 {'value': '3.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:38:37.317Z'},
                 {'value': '3.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:36:07.675Z'},
                 {'value': '3.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:33:38.015Z'},
                 {'value': '3.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:31:08.370Z'},
                 {'value': '2.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:28:38.712Z'},
                 {'value': '3.47',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:26:09.048Z'},
                 {'value': '3.07',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:23:39.395Z'},
                 {'value': '3.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:21:09.403Z'},
                 {'value': '3.23',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:18:39.165Z'},
                 {'value': '3.17',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:16:09.518Z'},
                 {'value': '3.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:13:39.807Z'},
                 {'value': '3.27',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:11:10.128Z'},
                 {'value': '6.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:08:40.475Z'},
                 {'value': '3.63',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:06:09.555Z'},
                 {'value': '5.57',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:03:39.895Z'},
                 {'value': '6.33',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T05:01:10.260Z'},
                 {'value': '4.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:58:40.598Z'},
                 {'value': '4.73',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:56:10.936Z'},
                 {'value': '4.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:53:41.288Z'},
                 {'value': '3.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:51:11.639Z'},
                 {'value': '4.17',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:48:41.991Z'},
                 {'value': '4.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:46:11.932Z'},
                 {'value': '4.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:43:42.277Z'},
                 {'value': '6.13',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:41:12.632Z'},
                 {'value': '4.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:38:42.976Z'},
                 {'value': '4.77',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:36:13.327Z'},
                 {'value': '5.93',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:33:43.677Z'},
                 {'value': '4.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:31:14.035Z'},
                 {'value': '6.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:28:44.148Z'},
                 {'value': '5.43',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:26:14.347Z'},
                 {'value': '4.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:23:44.700Z'},
                 {'value': '5.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:21:15.048Z'},
                 {'value': '4.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:18:45.401Z'},
                 {'value': '6.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:16:15.747Z'},
                 {'value': '4.43',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:13:45.611Z'},
                 {'value': '4.23',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:11:15.965Z'},
                 {'value': '4.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:08:46.307Z'},
                 {'value': '4.57',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:06:16.589Z'},
                 {'value': '5.53',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:03:44.097Z'},
                 {'value': '4.47',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T04:01:08.472Z'},
                 {'value': '4.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:58:18.909Z'},
                 {'value': '4.57',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:55:27.743Z'},
                 {'value': '4.63',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:52:48.966Z'},
                 {'value': '4.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:50:06.854Z'},
                 {'value': '5.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:47:14.375Z'},
                 {'value': '5.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:44:38.616Z'},
                 {'value': '4.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:41:38.224Z'},
                 {'value': '4.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:38:38.223Z'},
                 {'value': '5.07',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:35:59.445Z'},
                 {'value': '4.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:33:17.538Z'},
                 {'value': '5.17',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:30:39.044Z'},
                 {'value': '4.73',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:27:34.192Z'},
                 {'value': '4.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:24:46.411Z'},
                 {'value': '5.97',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:22:04.522Z'},
                 {'value': '5.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:19:22.409Z'},
                 {'value': '5.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:16:40.776Z'},
                 {'value': '5.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:13:49.760Z'},
                 {'value': '5.20',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:11:08.296Z'},
                 {'value': '5.83',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:08:26.323Z'},
                 {'value': '5.17',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:05:47.692Z'},
                 {'value': '5.23',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:03:03.087Z'},
                 {'value': '5.03',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T03:00:21.827Z'},
                 {'value': '5.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:57:26.323Z'},
                 {'value': '6.37',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:54:38.012Z'},
                 {'value': '5.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:51:59.072Z'},
                 {'value': '6.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:49:23.215Z'},
                 {'value': '5.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:46:44.084Z'},
                 {'value': '6.13',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:43:53.424Z'},
                 {'value': '7.43',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:41:05.557Z'},
                 {'value': '5.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:38:29.619Z'},
                 {'value': '5.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:35:47.704Z'},
                 {'value': '5.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:33:02.423Z'},
                 {'value': '7.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:30:17.614Z'},
                 {'value': '8.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:27:38.987Z'},
                 {'value': '5.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:24:35.599Z'},
                 {'value': '5.47',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:21:50.763Z'},
                 {'value': '5.63',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:19:05.871Z'},
                 {'value': '6.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:16:15.155Z'},
                 {'value': '6.07',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:13:18.291Z'},
                 {'value': '5.93',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:10:27.878Z'},
                 {'value': '6.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:07:49.331Z'},
                 {'value': '6.37',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:05:13.323Z'},
                 {'value': '7.33',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T02:02:14.709Z'},
                 {'value': '6.97',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:59:36.098Z'},
                 {'value': '7.25',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:56:54.604Z'},
                 {'value': '6.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:54:08.988Z'},
                 {'value': '7.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:51:30.504Z'},
                 {'value': '7.22',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:48:45.187Z'},
                 {'value': '5.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:46:09.789Z'},
                 {'value': '10.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:43:10.665Z'},
                 {'value': '9.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:40:31.304Z'},
                 {'value': '7.03',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:37:38.205Z'},
                 {'value': '8.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:34:48.839Z'},
                 {'value': '6.47',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:32:13.349Z'},
                 {'value': '7.65',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:29:28.360Z'},
                 {'value': '7.95',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:26:48.052Z'},
                 {'value': '9.53',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:24:06.460Z'},
                 {'value': '6.57',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:21:27.367Z'},
                 {'value': '8.47',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:18:37.910Z'},
                 {'value': '7.78',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:16:04.991Z'},
                 {'value': '8.33',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:13:28.853Z'},
                 {'value': '7.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:10:31.893Z'},
                 {'value': '9.93',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:07:49.876Z'},
                 {'value': '8.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-31T01:05:11.252Z'},
                 {'value': '16.57',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T14:45:43.790Z'},
                 {'value': '20.20',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T14:43:12.660Z'},
                 {'value': '9.35',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T14:40:41.599Z'},
                 {'value': '10.63',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T14:38:10.711Z'},
                 {'value': '8.03',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T14:35:39.752Z'},
                 {'value': '23.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T14:33:09.157Z'},
                 {'value': '4.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T14:30:38.260Z'},
                 {'value': '5.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T14:28:06.906Z'},
                 {'value': '5.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T14:25:35.987Z'},
                 {'value': '5.22',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T14:23:04.951Z'},
                 {'value': '7.15',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T14:20:33.827Z'},
                 {'value': '6.83',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T14:18:02.979Z'},
                 {'value': '4.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T14:15:31.779Z'},
                 {'value': '5.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T14:13:00.021Z'},
                 {'value': '5.20',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T14:10:29.140Z'},
                 {'value': '5.13',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T14:07:58.316Z'},
                 {'value': '4.27',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T14:05:27.507Z'},
                 {'value': '4.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T14:02:56.583Z'},
                 {'value': '5.27',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T14:00:25.725Z'},
                 {'value': '5.97',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:57:34.259Z'},
                 {'value': '6.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:55:03.521Z'},
                 {'value': '8.13',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:52:32.766Z'},
                 {'value': '9.97',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:50:01.682Z'},
                 {'value': '10.57',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:47:29.587Z'},
                 {'value': '9.88',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:44:58.899Z'},
                 {'value': '10.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:42:27.748Z'},
                 {'value': '12.03',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:39:56.787Z'},
                 {'value': '5.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:37:25.859Z'},
                 {'value': '7.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:34:55.106Z'},
                 {'value': '2.43',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:29:06.632Z'},
                 {'value': '2.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:26:36.948Z'},
                 {'value': '2.23',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:24:07.004Z'},
                 {'value': '7.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:21:37.092Z'},
                 {'value': '2.03',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:19:07.210Z'},
                 {'value': '2.13',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:16:37.261Z'},
                 {'value': '2.55',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:14:07.432Z'},
                 {'value': '1.20',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:11:37.484Z'},
                 {'value': '2.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:09:07.550Z'},
                 {'value': '1.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:06:35.327Z'},
                 {'value': '1.95',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:04:05.419Z'},
                 {'value': '2.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T13:01:35.483Z'},
                 {'value': '2.17',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:59:05.614Z'},
                 {'value': '1.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:56:35.885Z'},
                 {'value': '2.37',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:54:06.044Z'},
                 {'value': '2.20',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:51:36.388Z'},
                 {'value': '2.03',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:49:06.421Z'},
                 {'value': '2.15',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:46:36.686Z'},
                 {'value': '2.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:44:06.752Z'},
                 {'value': '2.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:41:35.889Z'},
                 {'value': '1.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:39:04.730Z'},
                 {'value': '1.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:36:33.159Z'},
                 {'value': '2.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:34:03.338Z'},
                 {'value': '1.73',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:31:33.301Z'},
                 {'value': '2.27',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:29:03.360Z'},
                 {'value': '1.77',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:26:33.682Z'},
                 {'value': '2.93',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:23:44.550Z'},
                 {'value': '2.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:21:14.599Z'},
                 {'value': '3.42',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:18:44.930Z'},
                 {'value': '3.20',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:16:14.918Z'},
                 {'value': '2.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:13:45.036Z'},
                 {'value': '2.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:11:15.119Z'},
                 {'value': '2.03',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:08:45.198Z'},
                 {'value': '4.20',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:06:15.329Z'},
                 {'value': '3.65',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:03:45.591Z'},
                 {'value': '3.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T12:01:15.550Z'},
                 {'value': '4.08',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:58:44.947Z'},
                 {'value': '2.73',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:56:14.990Z'},
                 {'value': '2.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:53:45.014Z'},
                 {'value': '5.53',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:51:15.134Z'},
                 {'value': '4.43',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:48:43.636Z'},
                 {'value': '4.58',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:46:13.880Z'},
                 {'value': '4.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:43:43.930Z'},
                 {'value': '6.63',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:41:13.841Z'},
                 {'value': '6.78',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:38:44.054Z'},
                 {'value': '7.03',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:36:14.116Z'},
                 {'value': '5.07',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:33:44.093Z'},
                 {'value': '4.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:31:14.354Z'},
                 {'value': '6.77',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:28:44.698Z'},
                 {'value': '5.97',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:26:15.034Z'},
                 {'value': '6.23',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:23:45.085Z'},
                 {'value': '6.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:21:14.892Z'},
                 {'value': '8.58',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:18:45.227Z'},
                 {'value': '12.83',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:16:15.225Z'},
                 {'value': '9.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:13:45.322Z'},
                 {'value': '14.20',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:11:15.642Z'},
                 {'value': '20.02',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:08:45.574Z'},
                 {'value': '16.53',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:06:15.565Z'},
                 {'value': '29.55',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:03:45.885Z'},
                 {'value': '22.77',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T11:01:15.895Z'},
                 {'value': '15.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:58:45.901Z'},
                 {'value': '11.25',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:56:16.532Z'},
                 {'value': '3.23',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:53:44.336Z'},
                 {'value': '3.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:51:14.284Z'},
                 {'value': '2.65',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:48:44.446Z'},
                 {'value': '2.77',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:46:14.500Z'},
                 {'value': '2.93',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:43:44.576Z'},
                 {'value': '3.42',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:41:14.750Z'},
                 {'value': '2.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:38:44.812Z'},
                 {'value': '2.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:36:14.945Z'},
                 {'value': '2.43',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:33:46.682Z'},
                 {'value': '2.03',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:31:13.544Z'},
                 {'value': '1.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:28:43.872Z'},
                 {'value': '5.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:26:13.928Z'},
                 {'value': '3.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:23:44.274Z'},
                 {'value': '3.17',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:21:14.592Z'},
                 {'value': '3.42',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:18:44.913Z'},
                 {'value': '3.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:16:14.989Z'},
                 {'value': '1.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:13:45.064Z'},
                 {'value': '4.47',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:11:15.142Z'},
                 {'value': '5.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:08:45.205Z'},
                 {'value': '2.43',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:06:15.229Z'},
                 {'value': '3.42',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:03:45.403Z'},
                 {'value': '2.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T10:01:15.481Z'},
                 {'value': '2.77',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:58:45.531Z'},
                 {'value': '2.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:56:15.639Z'},
                 {'value': '2.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:53:45.533Z'},
                 {'value': '3.43',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:51:15.590Z'},
                 {'value': '5.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:48:45.621Z'},
                 {'value': '2.58',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:46:15.960Z'},
                 {'value': '4.43',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:43:46.002Z'},
                 {'value': '4.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:41:16.089Z'},
                 {'value': '3.58',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:38:46.372Z'},
                 {'value': '4.17',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:36:16.352Z'},
                 {'value': '3.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:33:46.404Z'},
                 {'value': '1.65',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:31:16.593Z'},
                 {'value': '2.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:28:46.658Z'},
                 {'value': '2.20',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:26:16.711Z'},
                 {'value': '1.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:23:46.957Z'},
                 {'value': '1.93',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:21:17.012Z'},
                 {'value': '1.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:18:47.073Z'},
                 {'value': '1.77',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:16:17.394Z'},
                 {'value': '1.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:13:47.721Z'},
                 {'value': '1.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:11:18.041Z'},
                 {'value': '1.93',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:08:48.310Z'},
                 {'value': '1.82',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:06:18.637Z'},
                 {'value': '1.47',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:03:48.634Z'},
                 {'value': '2.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T09:01:18.776Z'},
                 {'value': '2.33',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:58:48.849Z'},
                 {'value': '1.73',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:56:18.883Z'},
                 {'value': '2.20',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:53:48.944Z'},
                 {'value': '1.83',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:51:18.723Z'},
                 {'value': '1.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:48:47.781Z'},
                 {'value': '2.37',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:46:17.852Z'},
                 {'value': '2.03',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:43:47.848Z'},
                 {'value': '2.37',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:41:17.956Z'},
                 {'value': '2.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:38:48.889Z'},
                 {'value': '2.57',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:36:16.481Z'},
                 {'value': '1.77',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:33:46.644Z'},
                 {'value': '2.12',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:31:16.635Z'},
                 {'value': '2.43',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:28:46.332Z'},
                 {'value': '2.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:26:15.923Z'},
                 {'value': '2.07',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:23:45.351Z'},
                 {'value': '2.33',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:21:15.621Z'},
                 {'value': '1.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:18:45.965Z'},
                 {'value': '1.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:16:15.039Z'},
                 {'value': '1.53',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:13:44.685Z'},
                 {'value': '1.92',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:11:14.809Z'},
                 {'value': '1.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:08:44.869Z'},
                 {'value': '2.07',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:06:14.997Z'},
                 {'value': '2.58',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:03:45.085Z'},
                 {'value': '2.53',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T08:01:15.156Z'},
                 {'value': '1.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:58:45.293Z'},
                 {'value': '1.73',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:56:15.630Z'},
                 {'value': '1.63',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:53:45.688Z'},
                 {'value': '1.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:51:15.772Z'},
                 {'value': '1.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:48:44.206Z'},
                 {'value': '1.53',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:46:14.247Z'},
                 {'value': '1.62',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:43:44.442Z'},
                 {'value': '1.75',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:41:14.496Z'},
                 {'value': '1.33',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:38:44.572Z'},
                 {'value': '1.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:36:14.914Z'},
                 {'value': '1.73',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:33:44.977Z'},
                 {'value': '2.23',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:31:14.030Z'},
                 {'value': '1.42',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:28:44.249Z'},
                 {'value': '1.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:26:14.320Z'},
                 {'value': '1.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:23:44.469Z'},
                 {'value': '1.37',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:21:14.681Z'},
                 {'value': '1.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:18:44.739Z'},
                 {'value': '1.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:16:14.800Z'},
                 {'value': '1.45',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:13:45.140Z'},
                 {'value': '1.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:11:15.208Z'},
                 {'value': '1.77',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:08:45.256Z'},
                 {'value': '1.65',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:06:15.594Z'},
                 {'value': '1.42',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:03:45.670Z'},
                 {'value': '1.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T07:01:15.740Z'},
                 {'value': '1.75',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:58:46.082Z'},
                 {'value': '1.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:56:16.140Z'},
                 {'value': '1.73',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:53:46.280Z'},
                 {'value': '1.17',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:51:16.472Z'},
                 {'value': '1.55',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:48:46.429Z'},
                 {'value': '1.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:46:16.488Z'},
                 {'value': '2.07',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:43:46.610Z'},
                 {'value': '1.22',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:41:16.955Z'},
                 {'value': '1.77',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:38:47.015Z'},
                 {'value': '1.33',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:36:17.176Z'},
                 {'value': '1.75',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:33:47.423Z'},
                 {'value': '1.93',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:31:17.494Z'},
                 {'value': '2.23',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:28:47.554Z'},
                 {'value': '1.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:26:17.684Z'},
                 {'value': '2.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:23:48.018Z'},
                 {'value': '2.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:21:18.066Z'},
                 {'value': '2.33',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:18:48.053Z'},
                 {'value': '1.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:16:18.186Z'},
                 {'value': '1.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:13:48.516Z'},
                 {'value': '2.07',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:11:18.556Z'},
                 {'value': '1.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:08:48.605Z'},
                 {'value': '1.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:06:18.743Z'},
                 {'value': '2.02',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:03:49.084Z'},
                 {'value': '1.93',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T06:01:19.127Z'},
                 {'value': '1.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:58:49.179Z'},
                 {'value': '2.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:56:20.185Z'},
                 {'value': '2.07',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:53:47.275Z'},
                 {'value': '2.25',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:51:17.502Z'},
                 {'value': '1.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:48:46.389Z'},
                 {'value': '1.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:46:16.450Z'},
                 {'value': '1.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:43:46.502Z'},
                 {'value': '2.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:41:16.648Z'},
                 {'value': '1.92',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:38:46.970Z'},
                 {'value': '2.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:36:17.043Z'},
                 {'value': '1.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:33:47.199Z'},
                 {'value': '1.95',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:31:17.551Z'},
                 {'value': '1.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:28:47.621Z'},
                 {'value': '1.97',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:26:17.668Z'},
                 {'value': '1.83',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:23:47.796Z'},
                 {'value': '2.33',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:21:18.138Z'},
                 {'value': '1.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:18:48.168Z'},
                 {'value': '2.13',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:16:18.140Z'},
                 {'value': '2.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:13:48.140Z'},
                 {'value': '1.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:11:18.261Z'},
                 {'value': '2.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:08:48.608Z'},
                 {'value': '1.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:06:18.590Z'},
                 {'value': '1.63',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:03:48.575Z'},
                 {'value': '1.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T05:01:18.524Z'},
                 {'value': '1.97',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:58:48.673Z'},
                 {'value': '1.82',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:56:18.870Z'},
                 {'value': '1.92',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:53:48.923Z'},
                 {'value': '2.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:51:19.040Z'},
                 {'value': '1.97',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:48:49.178Z'},
                 {'value': '1.37',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:46:19.384Z'},
                 {'value': '1.62',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:43:49.456Z'},
                 {'value': '1.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:41:19.548Z'},
                 {'value': '1.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:38:49.671Z'},
                 {'value': '2.15',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:36:20.007Z'},
                 {'value': '2.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:33:50.070Z'},
                 {'value': '1.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:31:20.124Z'},
                 {'value': '2.13',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:28:50.258Z'},
                 {'value': '1.65',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:26:07.399Z'},
                 {'value': '2.43',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:23:37.455Z'},
                 {'value': '3.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:21:07.510Z'},
                 {'value': '2.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:18:37.644Z'},
                 {'value': '1.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:16:07.858Z'},
                 {'value': '1.98',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:13:37.898Z'},
                 {'value': '1.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:11:07.962Z'},
                 {'value': '2.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:08:37.924Z'},
                 {'value': '2.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:06:08.067Z'},
                 {'value': '2.08',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:03:38.285Z'},
                 {'value': '2.33',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T04:01:08.340Z'},
                 {'value': '2.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:58:38.392Z'},
                 {'value': '2.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:56:08.528Z'},
                 {'value': '2.08',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:53:38.745Z'},
                 {'value': '2.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:51:08.804Z'},
                 {'value': '2.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:48:38.857Z'},
                 {'value': '2.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:46:08.931Z'},
                 {'value': '2.08',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:43:39.274Z'},
                 {'value': '2.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:41:09.261Z'},
                 {'value': '2.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:38:39.317Z'},
                 {'value': '2.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:36:09.440Z'},
                 {'value': '2.05',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:33:39.764Z'},
                 {'value': '2.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:31:17.695Z'},
                 {'value': '2.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:28:38.483Z'},
                 {'value': '2.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:26:08.385Z'},
                 {'value': '2.33',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:23:38.439Z'},
                 {'value': '3.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:21:08.565Z'},
                 {'value': '2.35',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:18:38.907Z'},
                 {'value': '2.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:16:08.968Z'},
                 {'value': '2.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:13:39.012Z'},
                 {'value': '3.17',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:11:09.155Z'},
                 {'value': '2.47',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:08:39.467Z'},
                 {'value': '3.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:06:09.543Z'},
                 {'value': '2.77',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:03:39.542Z'},
                 {'value': '3.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T03:01:09.682Z'},
                 {'value': '1.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:58:39.728Z'},
                 {'value': '2.35',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:56:09.736Z'},
                 {'value': '2.97',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:53:39.797Z'},
                 {'value': '1.93',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:51:09.809Z'},
                 {'value': '2.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:48:39.932Z'},
                 {'value': '2.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:46:10.125Z'},
                 {'value': '2.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:43:40.179Z'},
                 {'value': '2.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:41:10.237Z'},
                 {'value': '2.93',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:38:40.405Z'},
                 {'value': '3.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:36:10.736Z'},
                 {'value': '3.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:33:40.800Z'},
                 {'value': '2.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:31:10.938Z'},
                 {'value': '2.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:28:41.273Z'},
                 {'value': '3.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:26:11.333Z'},
                 {'value': '3.20',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:23:41.465Z'},
                 {'value': '2.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:21:11.380Z'},
                 {'value': '3.08',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:18:41.688Z'},
                 {'value': '3.03',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:16:11.744Z'},
                 {'value': '2.37',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:13:41.880Z'},
                 {'value': '3.52',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:11:12.225Z'},
                 {'value': '4.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:08:42.271Z'},
                 {'value': '3.13',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:06:12.416Z'},
                 {'value': '3.02',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:03:42.593Z'},
                 {'value': '3.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T02:01:12.655Z'},
                 {'value': '2.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:58:42.692Z'},
                 {'value': '2.77',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:56:12.691Z'},
                 {'value': '1.93',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:53:41.663Z'},
                 {'value': '2.72',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:51:11.996Z'},
                 {'value': '2.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:48:42.057Z'},
                 {'value': '3.23',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:46:12.208Z'},
                 {'value': '2.42',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:43:42.544Z'},
                 {'value': '3.63',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:41:12.604Z'},
                 {'value': '3.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:38:42.772Z'},
                 {'value': '2.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:36:13.115Z'},
                 {'value': '3.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:33:43.195Z'},
                 {'value': '3.43',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:31:13.336Z'},
                 {'value': '3.33',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:28:43.673Z'},
                 {'value': '3.23',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:26:13.719Z'},
                 {'value': '5.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:23:43.886Z'},
                 {'value': '3.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:21:14.118Z'},
                 {'value': '3.53',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:18:44.109Z'},
                 {'value': '3.93',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:16:14.164Z'},
                 {'value': '3.73',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:13:43.920Z'},
                 {'value': '3.47',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:11:14.032Z'},
                 {'value': '4.12',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:08:44.317Z'},
                 {'value': '4.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:06:14.405Z'},
                 {'value': '2.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:03:44.457Z'},
                 {'value': '3.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T01:01:14.796Z'},
                 {'value': '3.07',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:58:44.846Z'},
                 {'value': '3.33',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:56:14.963Z'},
                 {'value': '3.05',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:53:45.254Z'},
                 {'value': '3.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:51:15.303Z'},
                 {'value': '4.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:48:45.257Z'},
                 {'value': '4.08',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:46:15.588Z'},
                 {'value': '3.53',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:43:45.655Z'},
                 {'value': '3.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:41:14.746Z'},
                 {'value': '5.83',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:38:44.993Z'},
                 {'value': '3.43',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:36:15.057Z'},
                 {'value': '4.57',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:33:45.124Z'},
                 {'value': '4.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:31:15.460Z'},
                 {'value': '3.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:28:45.535Z'},
                 {'value': '3.77',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:26:15.703Z'},
                 {'value': '3.58',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:23:46.041Z'},
                 {'value': '3.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:21:16.101Z'},
                 {'value': '3.37',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:18:46.144Z'},
                 {'value': '3.17',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:14:49.057Z'},
                 {'value': '3.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:12:19.128Z'},
                 {'value': '2.55',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:09:48.283Z'},
                 {'value': '3.08',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:07:15.734Z'},
                 {'value': '3.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:04:45.779Z'},
                 {'value': '2.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-30T00:02:15.909Z'},
                 {'value': '3.15',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:59:53.302Z'},
                 {'value': '3.17',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:57:14.246Z'},
                 {'value': '2.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:54:44.368Z'},
                 {'value': '2.98',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:52:14.537Z'},
                 {'value': '3.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:49:44.596Z'},
                 {'value': '3.07',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:47:14.771Z'},
                 {'value': '3.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:44:45.041Z'},
                 {'value': '3.20',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:42:15.096Z'},
                 {'value': '3.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:39:45.108Z'},
                 {'value': '3.35',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:37:15.429Z'},
                 {'value': '3.25',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:34:45.460Z'},
                 {'value': '3.37',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:32:15.591Z'},
                 {'value': '3.20',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:29:45.805Z'},
                 {'value': '3.37',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:27:15.973Z'},
                 {'value': '2.07',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:24:46.108Z'},
                 {'value': '2.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:22:16.209Z'},
                 {'value': '3.07',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:19:46.278Z'},
                 {'value': '3.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:17:16.387Z'},
                 {'value': '3.02',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:14:46.650Z'},
                 {'value': '3.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:12:16.705Z'},
                 {'value': '3.73',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:09:46.748Z'},
                 {'value': '3.22',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:07:17.032Z'},
                 {'value': '3.27',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:04:47.064Z'},
                 {'value': '4.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T23:02:17.110Z'},
                 {'value': '3.25',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:59:47.383Z'},
                 {'value': '2.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:57:17.435Z'},
                 {'value': '3.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:54:47.627Z'},
                 {'value': '5.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:52:17.800Z'},
                 {'value': '3.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:49:48.125Z'},
                 {'value': '3.02',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:47:18.288Z'},
                 {'value': '3.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:44:48.348Z'},
                 {'value': '3.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:42:18.395Z'},
                 {'value': '3.20',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:39:48.736Z'},
                 {'value': '3.53',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:37:19.088Z'},
                 {'value': '3.70',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:34:49.244Z'},
                 {'value': '4.42',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:32:19.308Z'},
                 {'value': '4.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:29:49.436Z'},
                 {'value': '3.05',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:27:19.637Z'},
                 {'value': '3.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:24:49.693Z'},
                 {'value': '3.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:22:19.820Z'},
                 {'value': '4.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:19:50.166Z'},
                 {'value': '3.97',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:17:20.223Z'},
                 {'value': '3.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:14:50.560Z'},
                 {'value': '3.47',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:12:20.630Z'},
                 {'value': '2.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:09:50.724Z'},
                 {'value': '4.93',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:07:21.056Z'},
                 {'value': '4.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:04:51.112Z'},
                 {'value': '3.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T22:02:21.341Z'},
                 {'value': '3.07',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:59:51.413Z'},
                 {'value': '3.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:57:21.432Z'},
                 {'value': '4.22',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:54:51.601Z'},
                 {'value': '4.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:52:21.672Z'},
                 {'value': '5.80',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:49:51.833Z'},
                 {'value': '6.53',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:47:22.155Z'},
                 {'value': '4.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:44:52.216Z'},
                 {'value': '3.02',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:42:22.398Z'},
                 {'value': '3.73',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:39:52.467Z'},
                 {'value': '2.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:37:22.482Z'},
                 {'value': '5.65',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:34:52.648Z'},
                 {'value': '4.22',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:32:22.709Z'},
                 {'value': '4.43',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:29:52.839Z'},
                 {'value': '3.77',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:27:23.168Z'},
                 {'value': '3.73',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:24:53.222Z'},
                 {'value': '5.12',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:22:23.404Z'},
                 {'value': '3.52',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:19:53.465Z'},
                 {'value': '6.63',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:17:23.580Z'},
                 {'value': '3.53',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:14:53.760Z'},
                 {'value': '3.03',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:12:24.092Z'},
                 {'value': '3.58',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:09:54.259Z'},
                 {'value': '5.23',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:07:24.333Z'},
                 {'value': '4.47',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:04:54.320Z'},
                 {'value': '5.20',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T21:02:24.665Z'},
                 {'value': '5.97',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:59:54.492Z'},
                 {'value': '3.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:57:24.541Z'},
                 {'value': '3.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:54:54.881Z'},
                 {'value': '4.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:52:24.947Z'},
                 {'value': '4.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:49:54.929Z'},
                 {'value': '6.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:47:25.125Z'},
                 {'value': '6.27',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:44:55.468Z'},
                 {'value': '6.37',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:42:25.666Z'},
                 {'value': '4.43',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:39:55.706Z'},
                 {'value': '5.93',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:37:25.774Z'},
                 {'value': '6.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:34:55.962Z'},
                 {'value': '5.20',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:32:25.972Z'},
                 {'value': '4.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:29:56.065Z'},
                 {'value': '5.17',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:27:26.240Z'},
                 {'value': '7.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:24:56.284Z'},
                 {'value': '7.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:22:26.376Z'},
                 {'value': '4.83',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:19:56.576Z'},
                 {'value': '5.07',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:17:26.641Z'},
                 {'value': '5.93',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:14:56.823Z'},
                 {'value': '3.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:12:27.085Z'},
                 {'value': '5.53',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:09:57.135Z'},
                 {'value': '4.87',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:07:26.691Z'},
                 {'value': '4.93',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:04:56.762Z'},
                 {'value': '3.97',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T20:02:27.044Z'},
                 {'value': '3.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:59:57.390Z'},
                 {'value': '3.83',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:57:27.577Z'},
                 {'value': '2.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:54:57.647Z'},
                 {'value': '3.60',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:52:27.731Z'},
                 {'value': '3.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:49:57.996Z'},
                 {'value': '3.12',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:47:27.972Z'},
                 {'value': '2.98',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:44:57.758Z'},
                 {'value': '3.73',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:42:27.669Z'},
                 {'value': '2.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:39:55.143Z'},
                 {'value': '3.42',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:37:25.102Z'},
                 {'value': '3.43',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:34:55.180Z'},
                 {'value': '6.40',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:32:25.484Z'},
                 {'value': '4.53',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:29:55.537Z'},
                 {'value': '4.00',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:27:25.595Z'},
                 {'value': '4.92',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:24:55.872Z'},
                 {'value': '3.03',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:22:25.911Z'},
                 {'value': '2.97',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:19:55.953Z'},
                 {'value': '4.65',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:17:26.295Z'},
                 {'value': '2.07',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:14:56.351Z'},
                 {'value': '3.07',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:12:26.467Z'},
                 {'value': '3.72',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:09:56.610Z'},
                 {'value': '3.17',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:07:26.683Z'},
                 {'value': '5.90',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:04:56.767Z'},
                 {'value': '5.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T19:02:27.112Z'},
                 {'value': '3.83',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T18:59:57.379Z'},
                 {'value': '4.22',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T18:57:27.579Z'},
                 {'value': '5.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T18:54:57.643Z'},
                 {'value': '6.17',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T18:52:27.694Z'},
                 {'value': '7.67',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T18:49:58.020Z'},
                 {'value': '6.37',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T18:47:28.004Z'},
                 {'value': '12.30',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T18:44:58.093Z'},
                 {'value': '2.50',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T18:42:28.419Z'},
                 {'value': '3.93',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T18:39:58.180Z'},
                 {'value': '6.35',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T18:37:28.492Z'},
                 {'value': '4.07',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T18:34:58.256Z'},
                 {'value': '8.10',
                  'location': [
                    -1.63574,
                    48.126816
                  ],
                  'createdAt': '2019-01-29T18:32:28.060Z'}
               ]};

    return res.json(object);
  });


  self.listen(8880);
}
