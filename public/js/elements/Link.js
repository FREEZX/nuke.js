'use strict';

var m = require('mithril.elements');

var Link = m.element('Link', {
  controller: function(state) {
    if(state) {
        this.state = state;
    }
  },
  view: function(ctrl, content) {
  	var config = ctrl.state.href ? undefined : m.route;
    return m('a', {href: (ctrl.state.to || ctrl.state.href), config:config}, content);
  }
});