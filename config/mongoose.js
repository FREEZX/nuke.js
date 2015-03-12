'use strict';
var mongoose = require('mongoose');
var mongooseCachebox = require('mongoose-cachebox');
var config = require('./config');

module.exports = function() {
  mongooseCachebox(mongoose, config.cachebox);

  // Bootstrap db connection
  var db = mongoose.connect(config.db.uri, config.db.options, function(err) {
    if (err) {
      console.log(err);
    }
  });
  mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
  });
};
