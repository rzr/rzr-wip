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

var webthing;

try {
  webthing = require('../../../webthing');
} catch (err) {
  webthing = require('webthing-iotjs');
}

var Property = webthing.Property;
var Value = webthing.Value;

var Thing = webthing.Thing;
var WebThingServer = webthing.WebThingServer;
var SingleThing = webthing.SingleThing; // Update with different board here if needed

var pwm = require('pwm');

var pins = require('stm32f7nucleo').pin;

// minimum: 0, //(1 - offset) / period, //0.3 ~mid=0.75
// maximum: (2 + offset) / period // 0.11
function PwmOutProperty(thing, name, value, metadata, config) {
  var self = this;
  Property.call(this, thing, name || "PwmOut", new Value(Number(value)), {
    '@type': 'LevelProperty',
    title: metadata && metadata.title || "Level: ".concat(name),
    type: 'number',
    minimum: config.minimum || (1 - .4) / 20,
    maximum: config.maximum || (2 + .4) / 20,
    description: metadata && metadata.description || "PWM Actuator on pin=".concat(config.pin)
  });
  {
    this.config = config;
    if (! this.config.pwm) {
      this.config.pwm = {};
    }
    //if (typeof this.config.pwm.pin === 'undefined')
    //this.config.pwm.pin = config.pin;

    this.config.pwm = {
      pin: config.pin,
      dutyCycle: 1./20,
      period: .02, //50hz
    }
    this.port = pwm.open(this.config.pwm, function (err, port) {
      log("log: PWM: ".concat(self.getName(), ": open: ").concat(err));

      if (err) {
        console.error("error: PWM: ".concat(self.getName(), ": Fail to open: ").concat(err));
        return err;
      }
      self.port.freq = 1 / self.config.pwm.period;
      //self.port = port;
      self.value.valueForwarder = function (value) {
        verbose('forward: ' + value);
        self.port.setFrequencySync(self.port.freq);
        self.port.setEnableSync(true);
        self.port.setDutyCycleSync(Number(value));
      };
    });
  }

  this.close = function () {
    try {
      self.port && self.port.closeSync();
    } catch (err) {
      console.error("error: PWM: ".concat(self.getName(), ": Fail to close: ").concat(err));
      return err;
    }

    log("log: PWM: ".concat(self.getName(), ": close:"));
  };

  return this;
}

function angleToDuttyCycle(angle)
{
  var dutyCycle = ( (angle + 90) / 2 + 1) / 20;
  console.log('angle: ' + angle);
  console.log('dutyCycle: '  + dutyCycle);
  return dutyCycle;
}

function AngleOutProperty(thing, name, value, metadata, config) {
  var self = this;
  Property.call(this, thing, name || "PwmOut", new Value(Number(value)), {
    '@type': 'LevelProperty',
    title: metadata && metadata.title || "Level: ".concat(name),
    type: 'number',
    minimum: config.minimum,
    maximum: config.maximum,
    description: metadata && metadata.description || "PWM Actuator on pin=".concat(config.pin)
  });
  {
    this.config = config;
    if (! this.config.pwm) {
      this.config.pwm = {};
    }
    //if (typeof this.config.pwm.pin === 'undefined')
    //this.config.pwm.pin = config.pin;

    this.config.pwm = {
      pin: config.pin,
      dutyCycle: 1./20,
      period: .02, //50hz
    }
    this.port = pwm.open(this.config.pwm, function (err, port) {
      log("log: PWM: ".concat(self.getName(), ": open: ").concat(err));

      if (err) {
        console.error("error: PWM: ".concat(self.getName(), ": Fail to open: ").concat(err));
        return err;
      }
      self.port.freq = 1 / self.config.pwm.period;
      self.value.valueForwarder = function (value) {
        if (typeof self.config.convert != undefined) {
          console.log('TOCO');
          value = self.convert(value);
        }
        self.port.setFrequencySync(self.port.freq);
        self.port.setEnableSync(true);
        self.port.setDutyCycleSync(Number(value));
      };
    });
  }

  this.close = function () {
    try {
      self.port && self.port.closeSync();
    } catch (err) {
      console.error("error: PWM: ".concat(self.getName(), ": Fail to close: ").concat(err));
      return err;
    }

    log("log: PWM: ".concat(self.getName(), ": close:"));
  };

  return this;
}


function RobotThing(name, type, description) {
  var self = this;
  Thing.call(this, name || 'PWM', type || [], description || 'A web connected PWM');
  {

    var offset = .4;
    var period = 20;
    this.pinProperties = [
      new AngleOutProperty(this, 'Torso', 0, {
        description: 'PWM on /dev/pwm1'
      }, {
        pin: pins.PWM1.CH1_1,
        minimum: -90,
        maximum: +90,
        period: 20,
        offset: .4,
        convert: angleToDuttyCycle
      }),
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
  var server = new WebThingServer(new SingleThing(thing), port);
  process.on('SIGINT', function () {
    server.stop();

    var cleanup = function () {
      thing && thing.close();
      process.exit();
    };

    cleanup();
  });
  server.start();
}

runServer();
