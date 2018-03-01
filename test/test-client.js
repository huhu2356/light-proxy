var fs = require('fs');

var source = fs.createReadStream('source.txt');
var dest1 = fs.createWriteStream('dest1.txt');
var dest2 = fs.createWriteStream('dest2.txt');

source.pipe(dest1, {
  end: false
});

source.on('end', () => {
  dest1.end('ok');
});

const writer = dest2;
for (let i = 0; i < 100; i++) {
  writer.write(`hello, #${i}!\n`);
}
writer.end('This is the end\n');
writer.on('finish', () => {
  console.error('All writes are now complete.');
});