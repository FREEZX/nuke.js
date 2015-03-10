'use strict';

var passport = require('passport'),
	User = require('mongoose').model('User'),
	path = require('path'),
	config = require('./config'),
	JwtSession = require('passport-jwt-strategy');

module.exports = function() {
	passport.use(new JwtSession({secret: config.sessionSecret}));

	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		User.findOne({
			_id: id
		}, '-salt -password', function(err, user) {
			done(err, user);
		});
	});

	// Initialize strategies
	config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function(strategy) {
		require(path.resolve(strategy))();
	});
};