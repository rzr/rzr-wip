console.log(process);
var pwm = require('pwm');
var pin = require('stm32f7nucleo').pin.PWM1.CH1_1;
console.log('pin=' + pin);

var config = {
  dutyCycle: 1./20,
  period: .02,
  pin: 1,
}
console.log(config.pin);

var port = pwm.open(config, function(err) {
  if (err) {
    throw err;
  }
  port.setEnableSync(true);

  port.period = 20;
  port.freq = 1000/port.period;
  //port.setPeriod(port.period, function(err) {
  //if (err) {  throw err;   }
  //console.log('period=' + port.period);
  port.cycle = 1/20;
  console.log('cycle=' + port.cycle);
  
  setInterval(function() {
    port.setFrequencySync(port.freq);
    port.setDutyCycleSync(port.cycle);

    console.log('cycle=' + port.cycle);
    port.cycle += .001;
    if (port.cycle >= 2/20) {
      port.cycle = 1/20;
    }
  }, 100);
  //});
});
