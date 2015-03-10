'use strict';
var m = require('mithril.elements');
var _ = require('lodash');

var AppStore = {
  loggedin: m.prop(false),
  articles: Array
};

AppStore.getLoggedUser = function(){
  m.startComputation();
  primus.request('/users/me').then(function(data){
    AppStore.loggedin(data);
    m.endComputation();
  });
};

AppStore.getLoggedUser();

module.exports = AppStore;