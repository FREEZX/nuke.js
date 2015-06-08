'use strict';

var m = require('mithril.elements');
var Header = require('./Header');
var AppStore = require('../stores/AppStore');

var SigninForm = {
  controller: function(){
    this.vm = {};
    this.vm.username = m.prop('');
    this.vm.password = m.prop('');
    this.vm.success = m.prop('');
    this.vm.error = m.prop('');
    this.signin = function (ctrl){
      event.preventDefault();
      var self = this;
      m.startComputation();
      primus.request('/auth/signin', {username: this.vm.username(), password: this.vm.password()})
      .then(function(data){
        self.vm.error('');
        self.vm.success('Successfully logged in user ' + data.displayName);
        localStorage.setItem('nuketoken', data.token);
        AppStore.loggedin(data);
        m.route('/articles');
      })
      .fail(function(error){
        self.vm.error('Login failed with error: ' + error.message);
      })
      .fin(function(){
        m.endComputation();
      });
    };
  },
  view: function (ctrl) {
    var shouldDisplaySuccess = ctrl.vm.success().length > 0;
    var shouldDisplayError = !shouldDisplaySuccess && ctrl.vm.error().length > 0;
    return [
      Header.view(),
      m('div',
        m('div', {class: 'jumbotron'},
          m('div', {class: 'container'}, [
            m('div', {class: 'col-md-offset-4 col-md-4'},
              m('div', {class: 'panel panel-default'}, [
                m('div', {class: 'panel-heading'},
                  m('h3', {class: 'panel-title'}, 'Sign in')
                  ),
                m('div', {class: 'panel-body'}, 
                  m('form', {onsubmit: ctrl.signin.bind(ctrl)}, [
                    m('div', {class: 'form-group'}, 
                      m('div', {class: 'input-group'}, [
                        m('div', {class: 'input-group-addon'},
                          m('i', {class: 'fa fa-user addon-icon'})
                          ),
                        m('input', {type: 'text', class: 'form-control input-lg', name: 'username', placeholder: 'Enter username', value: ctrl.vm.username(), onchange: m.withAttr('value', ctrl.vm.username)})
                        ])
                      ),
                      m('div', {class: 'form-group'}, 
                        m('div', {class: 'input-group'}, [
                          m('div', {class: 'input-group-addon'},
                            m('i', {class: 'fa fa-key addon-icon'})
                            ),
                          m('input', {type: 'password', class: 'form-control input-lg', name: 'username', placeholder: 'Enter password', value: ctrl.vm.password(), onchange: m.withAttr('value', ctrl.vm.password)})
                          ])
                        ),
                      m('div', {class: 'form-group'}, 
                        m('input', {type: 'submit', class: 'btn btn-success', value: 'Sign in'})
                        ),
                      m('div', {class: (ctrl.vm.success() ? 'alert alert-success' : ''), role: 'alert'}, ctrl.vm.success()),
                      m('div', {class: (ctrl.vm.error() ? 'alert alert-danger' : ''), role: 'alert'}, ctrl.vm.error())
                    ])
                  )
                ])
              ),
            m('div', {class: 'col-md-offset-4 col-md-4 well'}, 'eeYou can login with username: "demo" and password: "demo123"')
            ])
          )
        )
    ];
  }
};

module.exports = SigninForm;