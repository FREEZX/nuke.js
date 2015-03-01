'use strict';
var swig = require('swig');

swig.setFilter('isCdn', function(element) {
  return element.indexOf('#nocdn') === -1;
});