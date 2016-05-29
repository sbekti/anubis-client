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
    self.emit('message', data);
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
      action: 'subscribe',
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
      action: 'publish',
      topic: topic,
      value: value
    });

    ws.send(publishPayload);
  }
}

AnubisClient.prototype.seek = function(topic, offset) {
  var ws = this.ws;

  if (ws) {
    var seekPayload = JSON.stringify({
      action: 'seek',
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
