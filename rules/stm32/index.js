// -*- mode: js; js-indent-level:2;  -*-
// SPDX-License-Identifier: MPL-2.0

/**
 *
 * Copyright 2019-present Samsung Electronics France SAS, and other contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */
var console = require('console');
// Disable logs here by editing to '!console.log'
var log = console.log || function () {};
var verbose = console.log || function () {};

verbose(process);
verbose(process.iotjs);
if (process.iotjs.board) {
  var board = require(process.iotjs.board);
  console.log(board);
  for (var pin in board.pin) {
    pin = board.pin[pin];
    console.log(pin);
    console.log(board.pin[pin]);
  }
}
