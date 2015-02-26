'use strict';

var React = require('react');
var ArticleActions = require('../actions/ArticleActions');

var ArticlesList = React.createClass({
  deleteArticle: function () {
    ArticleActions.removeArticle(this.props.article._id);
  },
  render: function () {
    return (
      <li>{this.props.article.title} <span onClick={this.deleteArticle}>X</span></li>
    );
  }
});

module.exports = ArticlesList;