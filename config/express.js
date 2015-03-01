'use strict';

var path = require('path');
var express = require('express');
var consolidate = require('consolidate');
var filters = require('./filters');
var session = require('./middleware/session');
var cookies = require('./middleware/cookies');
var config = require('./config');

var savedApp;
module.exports = function() {
	if(savedApp){
		return savedApp;
	}
	var app = express();

	app.locals.assets = config.assets;
	app.locals.cdn_base = config.cdn_base;

	app.use(cookies());
	app.use(session());
	app.use(express.static('public'));

	// Set swig as the template engine
	app.engine('swig', consolidate.swig);

	// Set views path and view engine
	app.set('view engine', 'swig');
	app.set('views', './app/views');

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