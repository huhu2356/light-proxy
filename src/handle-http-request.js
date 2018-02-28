const url = require('url');
const http = require('http');

function handleHttpRequest(request, response) {
  const parseURL = url.parse(request.url);
  const dstPath = `${parseURL.hostname}:${parseURL.port || 80}`;

  // make a request to a tunneling proxy
  const options = {
    port: config.servers[config.server].port,
    hostname: config.servers[config.server].hostname,
    method: 'CONNECT',
    path: dstPath
  };

  const conReq = http.request(options);

  conReq.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // make a request over an HTTP tunnel
    // const httpStr = request.method + ' ' + parseURL.path + ' HTTP/1.1\r\n' +
    //   'Host: ' + parseURL.host + '\r\n' + 
    //   'Connection: close\r\n' +
    //   '\r\n';

    // socket.write(httpStr);

    socket.write(getHttpReqStr(request, parseURL));

    request.pipe(socket);

    socket.pipe(response.socket);
  });

  conReq.on('error', (err) => {
    console.log(err);
    console.log(options);
  })

  conReq.end();
}

function getHttpReqStr(req, url) {
  let reqStr = '';
  reqStr += req.method + ' ' + url.path + ' HTTP/' + req.httpVersion + '\r\n';
  for (let key in req.headers) {
    if (key !== 'connection') {
      reqStr += key + ': ' + req.headers[key] + '\r\n';
    } else {
      reqStr += key + ': ' + 'close\r\n';
    }
  }
  if (!req.headers.hasOwnProperty('connection')) {
    reqStr += 'connection: close\r\n';
  }
  reqStr += '\r\n';

  return reqStr;
}

module.exports = handleHttpRequest;