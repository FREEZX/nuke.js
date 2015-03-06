'use strict';
var m = require('mithril.elements');
var _ = require('lodash');

var AppStore = {
  loggedin: m.prop(false),
  articles: Array
};

AppStore.getLoggedUser = function(){
  m.startComputation();
  primus.request('/users/me').then(function(data){
    AppStore.loggedin(data);
    m.endComputation();
  });
};

AppStore.loadArticles = function(){
  m.startComputation();
  primus.request('/article/list').then(function(data){
    AppStore.articles = data; 
    m.endComputation();
  });
};

AppStore.deleteArticle = function(id){
  m.startComputation();
  primus.request('/article/delete/'+id).then(function(data){
    AppStore.articles = _.remove(AppStore.articles, function(article){
      if(article._id !== id){
        return true;
      }
    });
    m.endComputation();
  });
};

AppStore.newArticle = function(article){
  m.startComputation();
  primus.request('/article/create', article).then(function(data){
    data.user = AppStore.loggedin();
    AppStore.articles.unshift(data);
    m.endComputation();
  });
};

AppStore.getLoggedUser();
AppStore.loadArticles();

module.exports = AppStore;