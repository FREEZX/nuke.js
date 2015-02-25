'use strict';
var crossroads = require('crossroads');
var articles = require('../controllers/articles.controller.js');

module.exports = function(app) {
	crossroads.addRoute('/article/list', articles.list);
	crossroads.addRoute('/article/create', articles.create);
	crossroads.addRoute('/article/update/{articleId}', articles.update);
	crossroads.addRoute('/article/delete/{articleId}', articles.delete);
	crossroads.addRoute('/article/{articleId}', articles.read);

	crossroads.param('articleId', articles.articleByID);
};