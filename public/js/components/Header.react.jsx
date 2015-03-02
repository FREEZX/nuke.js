'use strict';
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var HeaderTab = require('./HeaderTab.react');

var Header = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top" role="banner">
        <div className="container">
          <div className="navbar-header">
            <button className="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target=".bs-navbar-collapse">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link to="/" className="navbar-brand">☢ NUKE.JS</Link>
          </div>
          <nav className="collapse navbar-collapse bs-navbar-collapse">
            <ul className="nav navbar-nav">
              <HeaderTab to="home">Home</HeaderTab>
              <HeaderTab to="benchmarks">Benchmarks</HeaderTab>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <HeaderTab to="login">Login</HeaderTab>
            </ul>
          </nav>
        </div>
      </nav>
    );
  }
});

module.exports = Header;
