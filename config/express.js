'use strict';

var express = require('express');
var session = require('./middleware/session');
var cookies = require('./middleware/cookies');
var config = require('./config');
var path = require('path');

var savedApp;
module.exports = function() {
	if(savedApp){
		return savedApp;
	}
	var app = express();
	app.use(cookies());
	app.use(session());
	app.use(express.static('public'));

	// Globbing model files
	config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

	// Globbing routing files
	config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
		require(path.resolve(routePath))(app);
	});

	savedApp = app;
	return app;
};