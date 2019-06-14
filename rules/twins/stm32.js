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
var webthing;

try {
  webthing = require('../../../webthing');
} catch (err) {
  webthing = require('webthing-iotjs');
}

var Thing = webthing.Thing;

var AdcProperty = require('../adc/adc-property');
var GpioProperty = require('../gpio/gpio-property');
var board = require(process.iotjs.board);

function STM32Thing(name, type, description) {
  var self = this;
  Thing.call(this, name || 'STM32', type || [], description || 'A web connected STM32');
  {
    this.pinProperties = [
      new AdcProperty(this, 'ADC0', 0, {
        description: 'Analog port of STM32'
      }, {
        device: '/dev/adc0',
        direction: 'in',
        pin: board.pin.ADC1_3
      })
    ];
    this.pinProperties.forEach(function (property) {
      console.log(property.config);
      self.addProperty(property);
    });
  }

  this.close = function () {
    self.pinProperties.forEach(function (property) {
      property.close && property.close();
    });
  };
  console.log('xtor ~~~');
  //return this;
}

module.exports = function () {
  if (!module.exports.instance) {
    module.exports.instance = new STM32Thing();
  }

  return module.exports.instance;
};
