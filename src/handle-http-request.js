const url = require('url');
const http = require('http');

function handleHttpRequest(request, response) {
  const parseURL = url.parse(request.url);
  const dstPath = `${parseURL.hostname}:${parseURL.port || 80}`;

  // make a request to a tunneling proxy
  const options = {
    port: config.servers[config.server].port,
    hotstname: config.servers[config.server].hostname,
    method: 'CONNECT',
    path: dstPath
  };

  const conReq = http.request(options);

  conReq.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // make a request over an HTTP tunnel
    const httpStr = request.method + ' ' + parseURL.path + ' HTTP/1.1\r\n' +
      'Host: ' + parseURL.host + '\r\n' + 
      'Connection: close\r\n' +
      '\r\n';

    socket.write(httpStr);

    socket.pipe(response.socket);
  });

  conReq.end();
}

module.exports = handleHttpRequest;