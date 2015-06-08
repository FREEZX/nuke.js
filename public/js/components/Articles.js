'use strict';

var ArticleStore = require('../stores/ArticleStore');
var Header = require('./Header');
var m = require('mithril.elements');

var ArticlesList = {
  controller: function () {
    this.vm = {
      title: m.prop(''),
      content: m.prop('')
    };

    this.deleteArticle = function(event) {
      event.preventDefault();
      ArticleStore.deleteArticle(this._id);
    };

    this.newArticle = function(event) {
      event.preventDefault();
      ArticleStore.newArticle(this.vm);
      this.vm = {
        title: m.prop(''),
        content: m.prop('')
      };
    };

    ArticleStore.loadArticles();
  },
  view: function (ctrl) {
    console.log(ArticleStore.articles);
    var tableContent = ArticleStore.articles.valueOf().map(function (article) {
      return m('tr', {key: article._id}, [
        m('td', article.title),
        m('td', article.content),
        m('td', article.user.displayName),
        m('td', [
          m('div', {class: 'form-group'}, [
            m('button', {class: 'btn-sm btn-danger', onclick: ctrl.deleteArticle.bind(article)}, 'DELETE')
          ])
        ])
      ]);
    });
    return [
      Header.view(),
      m('br'),
      m('div', {class: 'container'}, [
        m('div', {class: 'col-md-6 col-md-offset-3'}, [
          m('div', {class: 'panel panel-default'}, [
            m('div', {class: 'panel-heading'}, 'Articles'),
            m('table', {class: 'table table-hover'}, [
              m('thead', [
                m('tr', [
                  m('th', 'Title'),
                  m('th', 'Content'),
                  m('th', 'User'),
                  m('th', 'Update')
                ])
              ]),
              m('tbody', tableContent)
            ])
          ]),
          m('div', {class: 'panel panel-default'}, [
            m('div', {class: 'panel-heading'}, [
              m('h3', {class: 'panel-title'}, 'New article')
            ]),
            m('div', {class: 'panel-body'}, [
              m('form', {role: 'form', onsubmit: ctrl.newArticle.bind(ctrl)}, [
                m('div', {class: 'form-group'}, [
                  m('input', {class: 'form-control input-lg', type: 'text', name:'title', placeholder: 'Enter title', value:ctrl.vm.title(), onchange:m.withAttr('value', ctrl.vm.title)}),
                ]),
                m('div', {class: 'form-group'}, [
                  m('input', {class: 'form-control input-lg', type: 'text', name:'content', placeholder: 'Enter content', value:ctrl.vm.content(), onchange:m.withAttr('value', ctrl.vm.content)}),
                ]),
                m('div', {class: 'form-group'}, [
                  m('input', {class: 'btn btn-success', type: 'submit', name:'content', value: 'Create article'})
                ])
              ])
            ])
          ])
        ])
      ])
    ];
  }
};

module.exports = ArticlesList;
