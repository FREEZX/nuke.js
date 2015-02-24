'use strict';

var expressSession = require('express-session');
var store = require('./session-store')();
var config = require('../config');

var _session;

module.exports = function(){
	if(_session) {
		return _session;
	}
	var session = expressSession({
		store: store,
		saveUninitialized: true,
		resave: false,
		secret: config.sessionSecret,
		cookie: config.cookie
	});

	_session = session;
	return _session;
};