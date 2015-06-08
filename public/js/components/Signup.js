'use strict';

var m = require('mithril.elements');
var Header = require('./Header');

var Signup = {
  controller: function() {
    this.vm = {};
    this.vm.firstName = m.prop('');
    this.vm.lastName = m.prop('');
    this.vm.username = m.prop('');
    this.vm.password = m.prop('');
    this.vm.email = m.prop('');
    this.vm.success = m.prop('');
    this.vm.error = m.prop('');

    this.signup = function (event){
      event.preventDefault();
      var self = this;
      console.log(this.vm);
      var userdata = {
        firstName: this.vm.firstName(),
        lastName: this.vm.lastName(),
        username: this.vm.username(),
        password: this.vm.password(),
        email: this.vm.email()
      };

      m.startComputation();
      primus.request('/auth/signup', userdata)
      .then(function(data){
        self.vm.error('');
        self.vm.success('Successfully created user '+data.displayName);
      })
      .fail(function(error){
        self.vm.error('Signup failed with error '+error.message);
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
          m('div', {class: 'container'},
            m('div', {class: 'col-md-offset-4 col-md-4'},
              m('div', {class: 'panel panel-default'}, [
                m('div', {class: 'panel-heading'},
                  m('h3', {class: 'panel-title'})
                  ),
                m('div', {class: 'panel-body'}, 
                  m('form', {onsubmit: ctrl.signup.bind(ctrl)}, [
                    m('div', {class: 'form-group'}, 
                      m('input', {type: 'text', className: 'form-control input-lg', name: 'firstName', placeholder: 'Enter first name', value: ctrl.vm.firstName(), onchange: m.withAttr('value', ctrl.vm.firstName)})
                      ),
                    m('div', {class: 'form-group'}, 
                      m('input', {type: 'text', className: 'form-control input-lg', name: 'lastName', placeholder: 'Enter last name', value: ctrl.vm.lastName(), onchange: m.withAttr('value', ctrl.vm.lastName)})
                      ),
                    m('div', {class: 'form-group'}, 
                      m('input', {type: 'text', className: 'form-control input-lg', name: 'username', placeholder: 'Enter username', value: ctrl.vm.username(), onchange: m.withAttr('value', ctrl.vm.username)})
                      ),
                    m('div', {class: 'form-group'}, 
                      m('input', {type: 'text', className: 'form-control input-lg', name: 'email', placeholder: 'Enter email', value: ctrl.vm.email(), onchange: m.withAttr('value', ctrl.vm.email)})
                      ),
                    m('div', {class: 'form-group'}, 
                      m('input', {type: 'password', className: 'form-control input-lg', name: 'password', placeholder: 'Enter password', value: ctrl.vm.password(), onchange: m.withAttr('value', ctrl.vm.password)})
                      ),
                    m('div', {class: 'form-group'}, 
                      m('input', {type: 'submit', className: 'btn btn-success', value: 'Sign up'})
                      ),
                    m('div', {class: (ctrl.vm.success() ? 'alert alert-success' : ''), role: 'alert'}, ctrl.vm.success()),
                    m('div', {class: (ctrl.vm.error() ? 'alert alert-danger' : ''), role: 'alert'}, ctrl.vm.error())
                    ])
                  )
                ])
              )
            )
          )
        )
    ];
  }
};

module.exports = Signup;