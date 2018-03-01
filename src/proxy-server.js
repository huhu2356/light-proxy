const http = require('http');
const net = require('net');
const url = require('url');
const crypto = require('crypto');

global['config'] = require('../config');

// Create an HTTP tunneling proxy
const proxyServer = http.createServer();

proxyServer.on('connect', (req, cltSocket, head) => {
  const decipher = crypto.createDecipher(config.crypto.algorithm, config.crypto.password);
  let decryptedURL = decipher.update(req.url, 'hex', 'utf8');
  decryptedURL += decipher.final('utf8');

  // connect to an origin server
  const srvUrl = url.parse(`http://${decryptedURL}`);
  const srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () => {
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    
    if (srvUrl.port !== 443) {
      const decipher = crypto.createDecipher(config.crypto.algorithm, config.crypto.password);
      cltSocket.pipe(decipher).pipe(srvSocket);
    } else {
      cltSocket.pipe(srvSocket);
    }
    
    srvSocket.pipe(cltSocket);
  });
});

proxyServer.on('error', (err) => {
  console.log(err);
});

proxyServer.listen(config.servers[config.server].port);
