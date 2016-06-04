# anubis-client
Node.js client for [anubis-server](https://github.com/sbekti/anubis-server), a Kafka proxy server over WebSocket.

## Installation
~~~shell
npm install --save anubis-client
~~~

## Example Usage
~~~javascript
var AnubisClient = require('anubis-client');

var anubis = new AnubisClient('wss://localhost:5443');

// Only if using a self-signed certificate on the server.
// Do not use this in production.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

anubis.connect();

anubis.on('open', function() {
  console.log('Connected to Anubis server');

  anubis.subscribe(['fruits', 'cities'], 'testgroup');

  anubis.publish('fruits', 'apple');
  anubis.publish('cities', 'San Francisco');

  anubis.seek('fruits', 'beginning');
  // anubis.seek('fruits', 'end');
  // anubis.seek('cities', 3);
});

anubis.on('message', function(message) {
  console.log(message);

  // You need to commit manually.
  anubis.commit(message.topic, message.partition, message.offset);
});

anubis.on('close', function() {
  console.log('Connection to Anubis server lost');

  // Setup a very simple reconnection logic if the client gets disconnected.
  setTimeout(function() {
    anubis.connect();
  }, 1000);
});

anubis.on('error', function(err) {
  console.log(err);
});

anubis.on('assign', function(partitions) {
  console.log(partitions);
});

anubis.on('revoke', function(partitions) {
  console.log(partitions);
});
~~~

## License

(The MIT License)

Copyright (c) 2016 Samudra Harapan Bekti <samudra.bekti@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
