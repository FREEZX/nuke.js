'use strict';
var mongoose = require('mongoose');
var config = require('./config');

module.exports = function() {
	// Bootstrap db connection
	var db = mongoose.connect(config.db.uri, config.db.options, function(err) {
		if (err) {
			console.log(err);
		}
	});
	mongoose.connection.on('error', function(err) {
		console.error('MongoDB connection error: ' + err);
		process.exit(-1);
	});
};