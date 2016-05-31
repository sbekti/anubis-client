var util = require('util');
var WebSocket = require('ws');
var EventEmitter = require('events').EventEmitter;

function AnubisClient(server) {
  EventEmitter.call(this);

  this.server = server;
}

AnubisClient.prototype.connect = function() {
  if (this.ws) this.ws.close();

  var self = this;
  var ws = this.ws = new WebSocket(this.server);

  ws.on('open', function() {
    self.emit('open');
  });

  ws.on('message', function(data, flags) {
    var message = JSON.parse(data);

    if (message.event == 'ping') return;

    self.emit('message', message);
  });

  ws.on('close', function() {
    self.emit('close');
  });

  ws.on('error', function(err) {
    self.emit('error', err);
  });
}

AnubisClient.prototype.subscribe = function(topics, groupId) {
  var ws = this.ws;

  if (ws) {
    var subscribePayload = JSON.stringify({
      event: 'subscribe',
      topics: topics,
      groupId: groupId
    });

    ws.send(subscribePayload);
  }
}

AnubisClient.prototype.publish = function(topic, value) {
  var ws = this.ws;

  if (ws) {
    var publishPayload = JSON.stringify({
      event: 'publish',
      topic: topic,
      value: value
    });

    ws.send(publishPayload);
  }
}

AnubisClient.prototype.commit = function(topic, partition, offset) {
  var ws = this.ws;

  if (ws) {
    var commitPayload = JSON.stringify({
      event: 'commit',
      topic: topic,
      partition: partition,
      offset: offset
    });

    ws.send(commitPayload);
  }
}

AnubisClient.prototype.seek = function(topic, offset) {
  var ws = this.ws;

  if (ws) {
    var seekPayload = JSON.stringify({
      event: 'seek',
      topic: topic,
      offset: offset
    });

    ws.send(seekPayload);
  }
}

AnubisClient.prototype.disconnect = function() {
  if (this.ws) {
    this.ws.close();
  }
}

util.inherits(AnubisClient, EventEmitter);

module.exports = AnubisClient;
