'use strict';
var m = require('mithril.elements');
var AppStore = require('../stores/AppStore');

var Logout = {
  controller: function (event){
    var self = this;
    m.startComputation();
    primus.request('/auth/signout', this.state)
    .then(function(data){
      AppStore.loggedin(false);
      localStorage.removeItem('nuketoken');
      m.route('/');
    })
    .fin(function(){
      m.endComputation();
    });
  },
  view: function () {
    return m('div', 'Logging out...');
  }
};

module.exports = Logout;
