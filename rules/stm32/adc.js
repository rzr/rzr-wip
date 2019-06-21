var adc = require('adc');
var board = process.iotjs.board;
if (board) {
  board = require(board);
} else {
  board = {};
}
  
function start(pin)
{
  this.pin = pin;
  this.config = {
    device: '/dev/adc0',
    direction: 'in',
    pin: pin
  };
  var self = this;
  self.frequency = 1;
  self.period = 1000 / self.frequency;

  setInterval(function () {
    console.log(self.pin + "=" + self.value);
  }, self.period);

  this.port = adc.open(config, function (err) {
    console.log('opened');
    console.log(err);
    if (err) {
      console.log(err);
      return null;
    }
    console.log('ready');
    self.interval = setInterval(function () {
      self.value = Number(self.port.readSync());
    }, self.period);
  });
}

console.log(process.argv[2]);
console.log(board.pin);
var pin = process.argv[2] || 'ADC1_3';
start(board.pin[pin]);

// //start(pins.ADC1_1);
// //start(pins.ADC1_2);
// //start(pins.ADC1_3);
// // start(pins.ADC2_0);
// // start(pins.ADC2_1);
// // start(pins.ADC2_2);
// // start(pins.ADC2_3);

// //  "ADC1_15": 65798181,
// //  "ADC2_15": 99352613,

// //ADC3_15

// // cd /rom ; iotjs adc.js ADC1_0
// // cd /rom ; iotjs adc.js ADC2_3
