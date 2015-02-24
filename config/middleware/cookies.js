'use strict';

var cookieParser = require('cookie-parser');
var config = require('../config');

var _cookies;

module.exports = function(){
	if(_cookies) {
		return _cookies;
	}
	var cookies = cookieParser(config.sessionSecret);

	_cookies = cookies;
	return _cookies;
};