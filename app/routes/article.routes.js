'use strict';
var crossroads = require('crossroads');
var articles = require('../controllers/articles.controller.js');
var users = require('../controllers/users.controller.js');

module.exports = function(app) {
  crossroads.addRoute('/article/list', [users.requiresLogin, articles.list]);
  crossroads.addRoute('/article/create', [users.requiresLogin, articles.create]);
  crossroads.addRoute('/article/watch', articles.watch);
  crossroads.addRoute('/article/update/{articleId}', [users.requiresLogin, articles.hasAuthorization, articles.update]);
  crossroads.addRoute('/article/delete/{articleId}', [users.requiresLogin, articles.hasAuthorization, articles.delete]);
  crossroads.addRoute('/article/{articleId}', articles.read);

  crossroads.param('articleId', articles.articleByID);
};
