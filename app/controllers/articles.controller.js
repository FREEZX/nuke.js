'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.controller'),
  Article = mongoose.model('Article'),
  _ = require('lodash');

/**
 * Create a article
 */
exports.create = function(spark, message) {
  var article = new Article(message.data);
  article.user = spark.request.user.id;

  article.save(function(err) {
    if (err) {
      return spark.status(400).error({
        message: errorHandler.getErrorMessage(err)
      }, message);
    } else {
      spark.response(article, message);

      //Notify other users of the new article
      spark.primus.broadcast('articles', article);
    }
  });
};

/**
 * Show the current article
 */
exports.read = function(spark, message) {
  spark.response(spark.request.article, message);
};

/**
 * Update a article
 */
exports.update = function(spark, message) {
  var article = spark.request.article;

  article = _.extend(article, message.data);

  article.save(function(err) {
    if (err) {
      return spark.status(400).error({
        message: errorHandler.getErrorMessage(err)
      }, message);
    } else {
      spark.response(article, message);
      spark.primus.broadcast('articles', article);
    }
  });
};

/**
 * Delete an article
 */
exports.delete = function(spark, message) {
  var article = spark.request.article;

  article.remove(function(err) {
    if (err) {
      return spark.status(400).error({
        message: errorHandler.getErrorMessage(err)
      }, message);
    } else {
      spark.response(article, message);
    }
  });
};

/**
 * List of Articles
 */
exports.list = function(spark, message) {
  Article.find().sort('-created').limit(30).populate('user', 'displayName').exec(function(err, articles) {
    if (err) {
      return spark.status(400).response({
        message: errorHandler.getErrorMessage(err)
      }, message);
    } else {
      spark.response(articles, message);
    }
  });
};

exports.watch = function(spark, message) {
  //Watch for new articles
  spark.join('articles', function(data) {
    spark.status(200).response({
      type: 'watch',
      data: data
    });
  });

  spark.status(200).response(true, message);
};

/**
 * Article middleware
 */
exports.articleByID = function(spark, message, id) {
  var cb = arguments[arguments.length-1];
  if (!mongoose.Types.ObjectId.isValid(id)) {
    var err = {
      message: 'Article is invalid'
    };
    spark.status(400).error(err, message);

    return cb(err);
  }
  Article.findById(id).populate('user', 'displayName').exec(function(err, article) {
    if (err) return cb(err);
    if (!article) {
      err = {
          message: 'Article not found'
        };
      return spark.status(404).error(err, message);
    }
    spark.request.article = article;
    cb();
  });
};

/**
 * Article authorization middleware
 */
exports.hasAuthorization = function(spark, message) {
  var cb = arguments[arguments.length-1];

  if (spark.request.article.user.id !== spark.request.user.id) {
    var err = {
      message: 'User is not authorized'
    };
    spark.status(403).error(err, message);
    return cb(err);
  }
  cb();
};
