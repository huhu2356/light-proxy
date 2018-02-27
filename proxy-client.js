const http = require('http');

const handleHttpRequest = require('./handle-http-request');

http.createServer()
  .on('request', handleHttpRequest)
  .listen(12345, () => console.log('client proxy listen on 12345'));
