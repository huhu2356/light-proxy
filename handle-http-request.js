const url = require('url');
const http = require('http');

function handleHttpRequest(request, response) {
  const parseURL = url.parse(request.url);

  // make a request to a tunneling proxy
  const options = {
    port: 1337,
    hotstname: '127.0.0.1',
    method: 'CONNECT',
    path: parseURL.host + ':80'
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
    
    // socket.on('data', (chunk) => {
    //   response.socket.write(chunk);
    // });

    // socket.on('end', () => {
    //   response.socket.end();
    // });
  });

  conReq.end();
}

module.exports = handleHttpRequest;