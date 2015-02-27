'use strict';
/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the ArticleStore and passes the new data to its children.
 */

/* jshint quotmark:false */

var Footer = require('./Footer.react');
var Header = require('./Header.react');
var ArticleList = require('./ArticleList.react');
var ArticleForm = require('./ArticleForm.react');
var SignupForm = require('./SignupForm.react');
var SigninForm = require('./SigninForm.react');
var SignoutButton = require('./SignoutButton.react');
var React = require('react');
var ArticleActions = require('../actions/ArticleActions');
var ArticleStore = require('../stores/ArticleStore');

var primus = new Primus(window.location.protocol+'//'+window.location.host);
window.primus = primus;

primus.on('open', function(){
  ArticleActions.fetchArticles();
});

var App = React.createClass({

  // getInitialState: function() {
  // },

  componentDidMount: function() {
    ArticleStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ArticleStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div>
        <SignupForm />
        <SigninForm />
        <SignoutButton />
        <ArticleList />
        <ArticleForm />
      </div>
  	);
  },

  /**
   * Event handler for 'change' events coming from the ArticleStore
   */
  _onChange: function() {
  }

});

module.exports = App;