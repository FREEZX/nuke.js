'use strict';

/* global Link */
var m = require('mithril.elements');
var Header = require('./Header');

var Home = {
  view: function () {
    return [Header.view(),
      m('div', [
        m('div', {class:'jumbotron'},
          m('div', {class:'container'}, [
            m('div', {class:'col-md-3 nuke_symbol'}, '☢'),
            m('div', {class:'col-md-9'}, [
              m('h1', 'Nuke.js'),
              m('p', [
                'Nuke is an extremely fast and performant node.js full-stack web framework, made with realtime in mind.',
                m('br'),
                'It combines the fastest and most powerful technologies to deliver explosive raw performance where you need it!'
                ]),
              m('blockquote', [
                m('p', '"Creating and using nuke.js every day is a blast!"'),
                m('footer', 'Kristijan Trajkovski, creator of nuke.js')
                ]),
              m('div', {class: 'row'}, [
                m('iframe', {src: 'https://ghbtns.com/github-btn.html?user=FREEZX&repo=nuke.js&type=star&count=true&size=large', frameborder: 0, scrolling: 0, width: 160, height: 30}),
                m('iframe', {src: 'https://ghbtns.com/github-btn.html?user=FREEZX&repo=nuke.js&type=fork&count=true&size=large', frameborder: 0, scrolling: 0, width: 158, height: 30})
              ]),
              m('div', {class: 'row'})
              ])
            ])
          ),
          m('div', {class: 'container'}, [
            m('h1', 'What?'),
            m('p', 'Traditional HTTP is not a very fast way to do things. Each time you make a request, a connection is opened, headers are sent, session data is retrieved, a response is sent back and the connection is closed.'),
            m('p', 'What if you need to do this many times? Precious bandwidth and time is lost to do all of these steps again and again and again.'),
            m('p', 'Our framework aims to reduce this by using socket technologies, which keep the connection open. This removes the overhead for opening and closing of the connection, and removes the need to retrieve session data for subsequent requests, as they all operate on the same connection.'),
            m('h1', 'How?'),
            m('p', [
              'We have ',
              m('a', {href: 'http://primus.io'}, 'primus'), ', ',
              m('a', {href: 'http://expressjs.com'}, 'express'), ', ',
              m('a', {href: 'http://lhorie.github.io/mithril/'}, 'mithril'), ', ',
              m('a', {href: 'http://www.mongodb.org/'}, 'mongodb'), ' and ',
              m('a', {href: 'http://redis.io/'}, 'redis'), ' on our stack.', 
              m('br'),
              m('Link', {state: {to: '/benchmarks'}}, 'Benchmarks'),
              ' prove that these technologies provide top notch performance, and experience has shown that they are both flexible and provide a great feature set.',
              m('h1', 'Swag'),
              m('p', 'Put this logo up on your site to show your support for the project.'),
              m('br'),
              m('img', {src: '/img/logo.png'})
              ])
            ])
        ])
    ];
  }
};

module.exports = Home;