'use strict';
var m = require('mithril.elements');
var AppStore = require('./AppStore');
var _ = require('lodash');

var ArticleStore = {
  articles: []
};

ArticleStore.loadArticles = function(){
  m.startComputation();
  primus.request('/article/list').then(function(data){
    ArticleStore.articles = data;
  })
  .fin(function(){
      m.endComputation();
  });
};

ArticleStore.deleteArticle = function(id){
  m.startComputation();
  primus.request('/article/delete/'+id).then(function(data){
    ArticleStore.articles = _.remove(ArticleStore.articles, function(article){
      if(article._id !== id){
        return true;
      }
    });
  })
  .fin(function(){
      m.endComputation();
  });
};

ArticleStore.newArticle = function(article){
  m.startComputation();
  primus.request('/article/create', article).then(function(data){
    data.user = AppStore.loggedin();
    ArticleStore.articles.unshift(data);
  })
  .fin(function(){
      m.endComputation();
  });
};

module.exports = ArticleStore;