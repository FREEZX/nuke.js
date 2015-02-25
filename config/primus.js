'use strict';

var Primus = require('primus');
var Redis = require('redis');
var PrimusRedisRooms = require('primus-redis-rooms-withauth');
var url = require('url');
var crossroads = require('crossroads');
var passport = require('passport');
var config = require('./config');
var session = require('./middleware/session');
var cookies = require('./middleware/cookies');
var response = require('./middleware/primus-response');
var _ = require('lodash');

module.exports = function(server) {
	var rtg = url.parse(config.redis);
	var redisPub = Redis.createClient(rtg.port, rtg.hostname, {return_buffers: true});
	var redisSub = Redis.createClient(rtg.port, rtg.hostname, {return_buffers: true});

	if(rtg.auth){
		redisPub.auth(rtg.auth.split(':')[1]);
		redisSub.auth(rtg.auth.split(':')[1]);
	}

	var primus = new Primus(server, { 
		redis: {
			pub: redisPub,
			sub: redisSub
		},
		transformer: 'websockets'
	});

	primus.before('cookies', cookies);
	primus.before('session', session);
	primus.before('passport_init', passport.initialize());
	primus.before('passport_sess', passport.session());

	primus.use('response', response);
	primus.use('redis', PrimusRedisRooms);

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
