'use strict';
var m = require('mithril.elements');
var _ = require('lodash');

var ArticleStore = {
  articles: []
};

ArticleStore.loadArticles = function(){
  m.startComputation();
  primus.request('/article/list').then(function(data){
    ArticleStore.articles = data; 
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
    m.endComputation();
  });
};

ArticleStore.newArticle = function(article){
  m.startComputation();
  primus.request('/article/create', article).then(function(data){
    data.user = ArticleStore.loggedin();
    ArticleStore.articles.unshift(data);
    m.endComputation();
  });
};

module.exports = ArticleStore;