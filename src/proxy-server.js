const http = require('http');
const net = require('net');
const url = require('url');

const { decipher, decrypt } = require('./custom-crypto');

global['config'] = require('../config');

// Create an HTTP tunneling proxy
const proxyServer = http.createServer();

proxyServer.on('connect', (req, cltSocket, head) => {
  const decryptedURL = decrypt(req.url);

  // connect to an origin server
  const srvUrl = url.parse(`http://${decryptedURL}`);
  const srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () => {
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    
    srvSocket.write(head);
    srvSocket.pipe(cltSocket);
    cltSocket.pipe(srvSocket);
  });
});

proxyServer.on('error', (err) => {
  console.log(err);
});

proxyServer.listen(config.servers[config.server].port);
