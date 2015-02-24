'use strict';
var crossroads = require('crossroads');

module.exports = function(app) {
	crossroads.addRoute('/article/{id}', function(spark, msg){
		console.log('writing');
		spark.response(400, {msg: 'ey bby'}, spark.request.body.seq);
	});
};