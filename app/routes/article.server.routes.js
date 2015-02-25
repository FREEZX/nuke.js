'use strict';
var crossroads = require('crossroads');

module.exports = function(app) {
	crossroads.addRoute('/article/{id}', function(spark, message){
		spark.status(400).response({msg: 'ey bby'}, message);
	});
};