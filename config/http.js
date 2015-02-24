'use strict';

var http = require('http');
var app = require('./express');
var primus = require('./primus');
var config = require('./config');

module.exports = function() {
	var server = http.createServer(app());
	primus(server);
	
	server.listen(config.port);
};