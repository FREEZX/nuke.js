var flux = require('flux-react');
var actions = require('../actions/ArticleActions.js');

module.exports = flux.createStore({
  articles: [],
  actions: [
    actions.fetchArticles,
    actions.addArticle,
    actions.removeArticle
  ],
  fetchArticles: function () {
    var self = this;
    primus.request('/article/list').then(function(articles){
      self.articles = articles;
      self.emit('articles.fetch');
    });
  },
  addArticle: function (article) {
    var self = this;
    primus.request('/article/create', article).then(function(article){
      self.articles.unshift(article);
      self.emit('articles.add');
    });
  },
  removeArticle: function (id) {
    var self = this;
    primus.request('/article/delete/'+id).then(function(){
      _.remove(self.articles, function(article){
        return article._id === id;
      });
      self.emit('articles.remove');
    });
  },
  exports: {
    getArticles: function () {
      return this.articles;
    }
  }
});