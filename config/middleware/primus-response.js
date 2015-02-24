'use strict';

var store = require('./session-store')();

module.exports = {
  server: function(primus){
    var Spark = primus.Spark;
    Spark.prototype.response = function (status, message) {
      var seq = this.request.body.seq || 0;
      this.write({status: status, data: message, seq: seq});
    };
    Spark.prototype.error = function (message, seq) {
      this.write({error: message, seq: seq});
    };
  },
  client: function(primus){
    primus.transform('outgoing', function (packet) {
      primus.seq = primus.seq+1 || 0;
      packet.data = packet.data || {};
      packet.data.data = packet.data.data || {};
      packet.data.data.seq = primus.seq;
    });
  }
};