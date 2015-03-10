'use strict';

var path = require('path');
var express = require('express');
var consolidate = require('consolidate');
var _ = require('lodash');
var passport = require('passport');
var config = require('./config');
var filters = require('./filters');

var savedApp;
module.exports = function() {
	if(savedApp){
		return savedApp;
	}
	var app = express();

	app.locals = _.extend(app.locals, config);

	app.use(express.static('public'));
	app.use(passport.initialize());
	app.use(passport.authenticate('jwt'));

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