## http/https prxoy

主要用于帮助http/https请求越过GFW

核心思路就是利用http connect method建立tunnel

使用方法：

- alter server hostname in config.json 
- run src/proxy-client.js in client
- run src/proxy-server.js in your server

遇到的一些问题：

- http.createServer().on(request, callback)中callback里的response，
  response.write()和response.socket.write()区别;
  原http请求则是请求头被解析在了request中，需提取有效信息，重新拼装请求头，
  个人认为请求体是没有被解析的，不过也存储在request中，可通过request.pipe(socket)获取请求体

- Connection: close 不加的话TCP连接会超时关闭，不过实现的时候一条tcp连接只能发送
  一个http请求（may need to fix）

- node里务必对异常做处理，不然一旦出现异常，程序会直接中止

- crypto中cipher和decipher只能用一次

- can one readable stream -> two writable stream ?
- can two readable stream -> same writable stream ?

- TCP PSH flag function ?

haha, 此外vscode如何同时开启同个debugger,剩下最主要的就是配合postman发送请求和wireshark抓包分析了

参考：

- [RFC7231 CONNECT](https://tools.ietf.org/html/rfc7231#section-4.3.6)

- [vscode Possible to launch multiple debuggers?](https://github.com/Microsoft/vscode/issues/4507)

- [How to pipe one readable stream into two writable streams at once in Node.js?
](https://stackoverflow.com/questions/14173488/how-to-pipe-one-readable-stream-into-two-writable-streams-at-once-in-node-js)

- [node.js - writing two readable streams into the same writable stream
](https://stackoverflow.com/questions/21767927/node-js-writing-two-readable-streams-into-the-same-writable-stream)

- [How to create streams from string in Node.Js?
](https://stackoverflow.com/questions/12755997/how-to-create-streams-from-string-in-node-js)

- [TCP PSH flag](http://packetlife.net/blog/2011/mar/2/tcp-flags-psh-and-urg/)

