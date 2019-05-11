// -*- mode: js; js-indent-level:2;  -*-
// SPDX-License-Identifier: MPL-2.0

/**
 *
 * Copyright 2018-present Samsung Electronics France SAS, and other contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */
var console = require('console'); // Disable logs here by editing to '!console.log'
var log = console.log || function () {};
var verbose = console.log || function () {};

var webthing = require('webthing-iotjs');
var Property = webthing.Property;
var Value = webthing.Value;
var Thing = webthing.Thing;
var WebThingServer = webthing.WebThingServer;
var SingleThing = webthing.SingleThing; // Update with different board here if needed

var pwm = require('pwm');
var PwmProperty = require('pwm-property');
var pins = require('stm32f7nucleo').pin;

function angleToDuttyCycle(angle)
{
  console.log('convert: angle: ' + angle);
  var offset = .4;
  var period = 20;
  var dutyCycle = ( ( (angle + 90) / 180 ) * (1+offset*2) +(1-offset) ) / period;
  console.log('convert: dutyCycle: '  + dutyCycle);
  console.log('convert: dutyCycle: period: '  + dutyCycle * period);
  return dutyCycle;
}


function RobotThing(name, type, description) {
  var self = this;
  webthing.Thing.call(this, name || 'Motor', type || [], description || 'A web connected Robot');
  {
    var offset = 0;
    var period = .02; // in secs 50Hz
    
    this.pinProperties = [
      new PwmProperty(this, 'Anngle', 0, {
        description: 'PWM on /dev/pwm1'
      }, {
        minimum: -90,
        maximum: +90,
        pwm: {
          pin: pins.PWM1.CH1_1,
          period: period,
          offset: offset,
          convert: angleToDuttyCycle
        }
      }),
      // new PwmProperty(this, 'Torso', 0, {
      //   description: 'PWM on /dev/pwm1'
      // }, {
      //   minimum: -90,
      //   maximum: +90,
      //   pwm: {
      //     pin: pins.PWM1.CH1_1,
      //     period: period,
      //     offset: offset,
      //     convert: angleToDuttyCycle
      //   }
      // }),
      // new PwmProperty(this, 'Shoulder', 0, {
      //   description: 'PWM on /dev/pwm2'
      // }, {
      //   minimum: -90,
      //   maximum: +90,
      //   pwm: {
      //     pin: pins.PWM2.CH1_1,
      //     period: period,
      //     offset: offset,
      //     convert: angleToDuttyCycle
      //   }
      // }),
      // new PwmProperty(this, 'Arm', 0, {
      //   description: 'PWM on /dev/pwm3'
      // }, {
      //   minimum: -90,
      //   maximum: +90,
      //   pwm: {
      //     pin: pins.PWM3.CH1_1,
      //     period: period,
      //     offset: offset,
      //     convert: angleToDuttyCycle
      //   }
      // })
      // ,
      // new PwmProperty(this, 'Hand', 0, {
      //   description: 'PWM on /dev/pwm4'
      // }, {
      //   minimum: -90,
      //   maximum: +90,
      //   pwm: {
      //     pin: pins.PWM4.CH1_1,
      //     period: period,
      //     offset: offset,
      //     convert: angleToDuttyCycle
      //   }
      // })
    ];

    this.pinProperties.forEach(function (property) {
      self.addProperty(property);
    });


    this.close = function () {
      self.pinProperties.forEach(function (property) {
        property.close && property.close();
      });
    };
  }
}


function runServer() {
  var port = process.argv[3] ? Number(process.argv[3]) : 8888;
  var url = "http://localhost:".concat(port);
  var thing = new RobotThing();
  var server = new webthing.WebThingServer(new webthing.SingleThing(thing), port);
  process.on('SIGINT', function () {
    server.stop();

    var cleanup = function () {
      thing && thing.close();
      process.exit();
    };

    cleanup();
  });
  setTimeout(function(){
    server.start();
  }, 1000);
}

runServer();
