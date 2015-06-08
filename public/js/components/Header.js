'use strict';
/* global NavLink,Link */
var m = require('mithril.elements');
var AppStore = require('../stores/AppStore');

var Header = {
  view: function() {
    var loginSpot;
    var articleLink;
    if(AppStore.loggedin()) {
      loginSpot = m('NavLink', {state: {to: '/logout'}}, 'Logout');
      articleLink = m('NavLink', {state: {to: '/articles'}}, 'Articles');
    } else {
      loginSpot = m('NavLink', {state:{to: '/login'}}, 'Login');
    }
    return m('nav', {class: 'navbar navbar-default navbar-fixed-top', role: 'banner'}, [
        m('div', {class: 'container'}, [
          m('div', {class: 'navbar-header'}, [
            m('button', {class: 'navbar-toggle collapsed', type: 'button', 'data-toggle': 'collapse', 'data-target': '.bs-navbar-collapse'}, [
              m('span', {class: 'sr-only'}, 'Toggle navigation'),
              m('span', {class: 'icon-bar'}),
              m('span', {class: 'icon-bar'}),
              m('span', {class: 'icon-bar'})
            ]),
            m('Link', {state: {to: '/'}, class: 'navbar-brand'}, '☢ NUKE.JS')
          ]),
          m('nav', {class: 'collapse navbar-collapse bs-navbar-collapse'}, [
            m('ul', {class: 'nav navbar-nav'}, [
              m('NavLink', {state: {to: '/'}}, 'Home'),
              m('NavLink', {state: {to: '/benchmarks'}}, 'Benchmarks'),
              m('NavLink', {state: {href: 'https://github.com/FREEZX/nuke.js'}}, 'Docs'),
              articleLink
            ]),
            m('ul', {class: 'nav navbar-nav navbar-right'}, [
              loginSpot,
              m('NavLink', {state: {to: '/signup'}}, 'Sign up')
            ])
          ])
        ])
      ]);
  }
};

module.exports = Header;
