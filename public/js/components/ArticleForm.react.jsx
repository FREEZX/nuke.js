'use strict';

var React = require('react');
var Article = require('./Article.react');
var ArticleActions = require('../actions/ArticleActions');

var ArticlesList = React.createClass({
  getInitialState: function () {
    return {
      title: 'Title'
    };
  },
  _setTitle: function (event){
    this.setState({
      title: event.target.value
    });
  },
  addArticle: function (event){
    event.preventDefault();
  	ArticleActions.addArticle(this.state);
  },
  render: function () {
    return (
      <form onSubmit={this.addArticle}>
      	<input name="title" type="text" value={this.state.title} onChange={this._setTitle}></input>
        <input type="submit"></input>
      </form>
    );
  }
});

module.exports = ArticlesList;