'use strict';

var Primus = require('primus');
var Nats = require('./nats.js')
var primusNats = require('primus-nats');
var url = require('url');
var crossroads = require('crossroads');
var passport = require('passport');
var config = require('./config');
var response = require('./middleware/primus-response');
var _ = require('lodash');

module.exports = function(server) {

  var primus = new Primus(server, {
    nats: Nats,
    transformer: 'websockets'
  });

  primus.before('passport_init', passport.initialize());
  primus.before('auth', passport.authenticate('jwt', {token: 'query'}));

  primus.use('response', response);
  primus.use('nats', primusNats);

  crossroads.ignoreState = true;

  primus.on('connection', function(spark){
    spark.on('data', function(message){
      if(message.path){
        spark.request.body = _.omit(message.data, 'seq');
        crossroads.parse(message.path, [spark, message]);
      }
    });
  });
};
