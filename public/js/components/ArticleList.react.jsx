'use strict';

var React = require('react');
var Article = require('./Article.react');
var ArticleStore = require('../stores/ArticleStore');

var ArticlesList = React.createClass({
  componentWillMount: function () {
    ArticleStore.on('articles.*', this.update);
  },
  componentWillUnmount: function () {
    ArticleStore.offAny('articles.*', this.update);
  },
  update: function () {
    this.setState({});
  },
  render: function () {
    return (
      <ul>
        {ArticleStore.getArticles().map(function (article) {
          return <Article key={article._id} article={article} />;
        })}
      </ul>
    );
  }
});

module.exports = ArticlesList;