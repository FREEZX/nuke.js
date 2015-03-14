/* Used for creating a fake user, creating a connection and logging in */

'use strict';

var Primus = require('primus');
var User = require('mongoose').model('User');
var async = require('async');

var bootstrap = function(cb) {
  var Socket = Primus.createSocket({
    transformer: 'websockets',
    plugin: {
      'response': require('../../../config/middleware/primus-response')
    }
  }),
  client = new Socket('http://localhost:3000');

  client.on('open', function(){ cb(client); });

};

module.exports = bootstrap;
