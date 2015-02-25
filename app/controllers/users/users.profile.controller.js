'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(spark, message) {
	var req = spark.request;

	// Init Variables
	var user = req.user;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return spark.status(400).error({
					message: errorHandler.getErrorMessage(err)
				}, message.seq);
			} else {
				req.login(user, function(err) {
					if (err) {
						return spark.status(400).error(err, message.seq);
					} else {
						return spark.response(user, message.seq);
					}
				});
			}
		});
	} else {
		spark.response(400, {
			message: 'User is not signed in'
		},
		message.seq);
	}
};

/**
 * Send User
 */
exports.me = function(spark, message) {
	spark.response(spark.request.user, message);
};