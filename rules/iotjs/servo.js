console.log(process);
var pwm = require('pwm');
var pin = require('stm32f7nucleo').pin.PWM1.CH1_1;
console.log('pin=' + pin);

// https://components101.com/sites/default/files/component_datasheet/SG90%20Servo%20Motor%20Datasheet.pdf
// 50 Hz, cyle=[1-2]
var config = {
  dutyCycle: 1./20,
  period: .02,
  pin: 1,
}
console.log(config.pin);



//    1ms = 5%: -90°, left position
//    1.5ms = 7.5%: -90°, middle position
//    2ms = 10%: +90°, right position

// case left = 5
// case middle = 8
// case right = 12


var port = pwm.open(config, function(err) {
  if (err) {
    throw err;
  }
  port.period = 20; //ms
  port.freq = 1000 / port.period; //50hz
  //port.setPeriod(port.period, function(err) {
  //if (err) {  throw err;   }
  //console.log('period=' + port.period);
  port.c_cycle = 0; // should be 0 if well calibrated
  port.c_cycle = 0.4; // should be 0 if well calibrated
  port.d_cycle = 0; 
  port.l_cycle = 1 - port.c_cycle;
  port.r_cycle = 2 + port.c_cycle;
  port.m_cycle = (port.l_cycle + port.r_cycle) / 2.; // 1.5
  port.cycle = port.m_cycle;
  port.o_cycle = .01;
  port.s_cycle = 1;
  console.log('cycle=' + port.cycle);

  port.setEnableSync(true);
  
  setInterval(function() {
    //port.setPeriodSync(port.period);
    port.setFrequencySync(port.freq);
    port.setDutyCycleSync(port.cycle / port.period);
    console.log('cycle=' + port.cycle);
    port.cycle += port.s_cycle * port.o_cycle;
    if (port.cycle <= port.l_cycle) {
      port.s_cycle = 1;
    }
    if (port.cycle >= port.r_cycle) {
      port.s_cycle = -1;
    }
  }, 100);
  //});
});
