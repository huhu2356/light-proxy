const url = require('url');
const http = require('http');

function handleHttpsRequest(request, cltSocket, cltHead) {
  const parseURL = url.parse(request.url.includes('http://') ? request.url : 'http://' + request.url);
  const dstPath = `${parseURL.hostname}:${parseURL.port || 443}`;

  // make a request to a tunneling proxy
  const options = {
    port: config.servers[config.server].port,
    hostname: config.servers[config.server].hostname,
    method: 'CONNECT',
    path: dstPath
  };

  const conReq = http.request(options);

  conReq.on('connect', (res, srvSocket, srvHead) => {
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');

    srvSocket.write(cltHead);
    cltSocket.pipe(srvSocket);
    srvSocket.pipe(cltSocket);
  });

  conReq.on('error', (err) => {
    console.log(err);
    console.log(options);
  })

  conReq.end();
}

module.exports = handleHttpsRequest;