console.log(process);

for (var arg in process.argv) {
  arg = process.argv[arg];
  console.log(arg);
}
