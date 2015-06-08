'use strict';

var m = require('mithril.elements');

var NavLink = m.element('NavLink', {
  controller: function(state) {
    this.state = state;
    this.active = m.route() === this.state.to;
  },
  view: function(ctrl, content) {
    var className = ctrl.active ? 'active' : '';
    return m('li', {class: className}, 
      m('Link', {state: ctrl.state}, content)
    );
  }
});