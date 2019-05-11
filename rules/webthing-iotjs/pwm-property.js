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

var pwm = require('pwm');

function AngleOutProperty(thing, name, value, metadata, config) {
  var self = this;
  webthing.Property.call(this, thing, name || "PwmOut", new webthing.Value(Number(value)), {
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
    var dutyCycle = .5;
    if (typeof config.convert != 'undefined') {
      dutyCycle = config.convert(config.maximum + config.minimum / 2);
    }
    this.config.pwm = {
      pin: config.pin,
      dutyCycle: dutyCycle, //  1./20,
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
          value = self.config.convert(value);
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
