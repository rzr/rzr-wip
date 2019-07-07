// console.log(process);

// for (var arg in process.argv) {
//   arg = process.argv[arg];
//   console.log(arg);
// }

var now = new Date();
console.log(Number(now));


var start = Number(new Date());

setInterval(function() {
  console.log('uptime: secs=' + (Number(new Date()) - start) / 1000);
}, 60 * 1000);
