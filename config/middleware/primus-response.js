'use strict';

var _ = require('lodash');
var Q = require('q');

module.exports = {
  server: function(primus){
    var Spark = primus.Spark;
    Spark.prototype._status = 200;
    Spark.prototype.status = function (status) {
      this._status = status;
      return this;
    };
    Spark.prototype.response = function (message, reqmsg) {
      var seq = reqmsg.seq || 0;
      this.write({status: this._status, data: message, seq: seq});
      this._status = 200;
    };
    Spark.prototype.error = function (message, reqmsg) {
      var seq = reqmsg.seq || 0;
      this.write({error: message, seq: seq});
      this._status = 200;
    };
  },
  client: function(primus){
    primus.request = function(path, data, callback) {
      if(typeof(data) === 'function') {
        callback = data;
        data = {};
      }
      var self = primus;

      if(typeof Q === 'undefined' && typeof require !== 'undefined'){
        Q = require('q');
      }
      var deferred = Q.defer();

      if(self.writable) {
        var timeout;
        var listener = function(data){
          clearTimeout(timeout);
          if(data.seq === seq) {
            primus.removeListener('data', listener);
            if(data.error) {
              deferred.reject(data.error);
            }
            else {
              deferred.resolve(data.data);
            }
          }
        };
        primus.seq = primus.seq+1 || 0;
        var seq = primus.seq;
        timeout = setTimeout(function(){
          listener({error: 'Server did not respond', seq: seq});
        }, 2000);
        self.on('data', listener);
        self.write({path: path, data: data, seq: seq});
      }

      return deferred.promise;
    };
  }
};
