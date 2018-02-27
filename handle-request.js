const url = require('url');
const http = require('http');

function handleRequest(request, response) {
  const parseURL = url.parse(request.url);
  const options = {
    hostname: parseURL.hostname,
    port: 80,
    method: 'GET',
    path: parseURL.pathname
  };

  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
      res.pipe(response);
    });
  });
  
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  
  req.end();
}

module.exports = handleRequest;