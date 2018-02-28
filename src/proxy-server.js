const http = require('http');
const net = require('net');
const url = require('url');

global['config'] = require('../config');

// Create an HTTP tunneling proxy
const proxyServer = http.createServer();

proxyServer.on('connect', (req, cltSocket, head) => {
  // connect to an origin server
  const srvUrl = url.parse(`http://${req.url}`);
  const srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () => {
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    
    srvSocket.write(head);
    srvSocket.pipe(cltSocket);
    cltSocket.pipe(srvSocket);
  });
});

proxyServer.listen(config.servers[config.server].port);
