'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * User middleware
 */
exports.userByID = function(spark, message, id, cb) {
  User.findById(id).exec(function(err, user) {
    if (err) return cb(err);
    if (!user) return cb(new Error('Failed to load User ' + id));
    spark.request.profile = user;
    cb();
  });
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(spark, message, cb) {
  if (!spark.request.isAuthenticated()) {
    var err = {
      message: 'User is not logged in'
    };
    spark.status(401).error(err, message);
    return cb(err);
  }

  cb();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
  var _this = this;

  return function(spark, message, cb) {
    _this.requiresLogin(spark, message, function(err) {
      if(err){
        cb(err);
      }
      if (_.intersection(spark.request.user.roles, roles).length) {
        return cb();
      } else {
        err = {
          message: 'User is not authorized'
        };
        spark.status(403).error(err, message);
        return cb(err);
      }
    });
  };
};