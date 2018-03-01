const http = require('http');

const handleHttpRequest = require('./handle-http-request');
const handleHttpsRequest = require('./handle-https-request');

global['config'] = require('../config');

http.createServer()
  .on('request', handleHttpRequest)
  .on('connect', handleHttpsRequest)
  .on('error', (err) => {
    console.log(err);
  })
  .listen(config.client.port);
