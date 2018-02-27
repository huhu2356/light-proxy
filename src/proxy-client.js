const http = require('http');

const handleHttpRequest = require('./handle-http-request');

global['config'] = require('../config');

http.createServer()
  .on('request', handleHttpRequest)
  .listen(config.client.port);
