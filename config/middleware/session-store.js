'use strict';

var expressSession = require('express-session');
var RedisStore = require('connect-redis')(expressSession);

var Redis = require('redis');
var url = require('url');

var config = require('../config');

var _store;
module.exports = function(){
	if(_store){
		return _store;
	}

	var rtg = url.parse(config.redis);

	var redis = Redis.createClient(rtg.port, rtg.hostname);

	var store = new RedisStore({client: redis});

	_store = store;
	return _store;
};