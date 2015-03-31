[![Logo](http://nukejs.com/img/logo.png)](http://nukejs.com/)

The superfast full-stack framework

[![Build Status](https://travis-ci.org/FREEZX/nuke.js.svg?branch=master)](https://travis-ci.org/FREEZX/nuke.js)
[![Dependencies Status](https://david-dm.org/FREEZX/nuke.js.svg)](https://david-dm.org/FREEZX/nuke.js)
[![Code Climate](https://codeclimate.com/github/FREEZX/nuke.js/badges/gpa.svg)](https://codeclimate.com/github/FREEZX/nuke.js)

Nuke.js is a full-stack web framework, optimized for high speed transfer with less overhead.

## Features
 - Mongoose models
 - Express dynamic pages
 - Mongoose models
 - JWT tokens authentication with Passport.js
 - All-purpose Primus messaging
 - Intelligent building system
 - Mithril frontend out of the box

## Getting started

First, you need the nukejs yeoman generator to create a new project, intall it by running

```bash
npm install -g generator-yeoman
```

Then, create a new folder where your project will be, `cd` inside it, and execute:

```bash
yo nukejs
```

Answer the questions and you'll have a nuke.js project set up.

To start up a server with the included sample app, just modify /config/env/development.js with your mongodbdb url and redis url (if you can start up a local redis and mongo on the default ports you don't have to change anything) and then run `npm install` and finally start it up with `npm run start-dev` in development mode (This will enable automatic compilation of frontend javascript). On your server you should start it with `npm start`.

Let's start with a quick overview of the folder structure:
```text
├── app                 (All backend code)
    ├── controllers     (Code to handle user requests)
    ├── models          (Mongoose models, providing schema definitions and validation)
    ├── routes          (Defines both express and primus routes and sets their handlers)
    ├── views           (Swig-renderable html. Useful for adding some dynamic content to your pages)
├── config              (Contains files that configure all aspects of the framework)
    ├── env             (Defines NODE_ENV-specific configurations. Everything extends on top of all.js)
    ├── middleware      (Defines middleware, mainly for primus and express)
    ├── strategies      (Passport.js login strategies)
├── public              (All css, bower modules and js cpde)
    ├── dist            (All built and minified front-end static files, ready for CDN deployment)
    ├── js              (Front-end app code and other scripts you add)
    ├── lib             (Bower dependencies destination)
```

It is recommended to use [editorconfig](http://editorconfig.org/) with your editor to be able to have the same file formatting across editors.

With structure out of the way, let's check out how our backend works.

## Backend
First thing to do when starting a new project is setting up models.

You can generate a model with included controller and routes by executing

```bash
yo nukejs:module
```

### Models
The frameworks contains a sample mongoose model for article objects out of the box:

```javascript
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

ArticleSchema.index({created: -1});

mongoose.model('Article', ArticleSchema);
```
Simple, right?

For more info on writing mongoose models, check the [Mongoose docs](http://mongoosejs.com/docs/models.html)
You can cache mongodb requests by using the already-included [Mongoose cachebox](https://www.npmjs.com/package/mongoose-cachebox)

### Controllers

We also have a sample controller, which is a bit more specific to nuke.js:
```javascript
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
  article.user = spark.request.user;

  article.save(function(err) {
    if (err) {
      console.log(err);
      return spark.status(400).response({
        message: errorHandler.getErrorMessage(err)
      }, message);
    } else {
      spark.response(article, message);
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

/**
 * Article middleware
 */
exports.articleByID = function(spark, message, id, cb) {
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
        console.log(message);
      return spark.status(404).error(err, message);
    }
    spark.request.article = article;
    cb();
  });
};

/**
 * Article authorization middleware
 */
exports.hasAuthorization = function(spark, message, next) {
  if (spark.request.article.user.id !== spark.request.user.id) {
    var err = {
      message: 'User is not authorized'
    };
    spark.status(403).error(err, message);
    return next();
  }
  next();
};
```

As you can see, most of these functions probably differ from what you may be used to, mainly in their parameters. Our controller functions take `spark` and `message` as their parameters:

`spark` contains the raw primus spark object which has sent the message. In the spark's `request` field, you may find the raw request data as well as the `user` object (set by passport), if the user is logged in. If you need to add new fields that should persist during one connection, the `primus` object is where you could put them.

`message` contains the whole raw message that the has been sent from the browser. The data you're sending from your client scripts is located in `message.data` (this is your message body), whereas `message.route` and `message.seq` contain the requested route and message sequence number accordingly. Most often you will only need `message.data`.

If you need to send a response to the request, you do that by using either `spark.response(data, message)`, for normal response or `spark.error(data, message)` for rejected response. You can put anything you wish in the data, but the `message` parameter can either be:

1. left blank (in which case the client would receive the data you send, but **NOT AS A RESPONSE TO YOUR ORIGINAL REQUEST**, you can only catch it if you have set a `primus.on('data')` listener yourself)

2. (preferred) pass the original message you got, which contains the sequence number of the original message in the *seq* field, so this will be considered as a resolution to the original promise on the client side.

### Routes

Routes in the framework are enabled by using a customized implementation of crossroads.js for primus requests, and express's own routes for regular HTTP requests.

Here is a sample route file for articles:
```javascript
'use strict';
var crossroads = require('crossroads');
var articles = require('../controllers/articles.controller.js');
var users = require('../controllers/users.controller.js');

module.exports = function(app) {
  crossroads.addRoute('/article/list', articles.list);
  crossroads.addRoute('/article/create', [users.requiresLogin, articles.create]);
  crossroads.addRoute('/article/update/{articleId}', [users.requiresLogin, articles.hasAuthorization, articles.update]);
  crossroads.addRoute('/article/delete/{articleId}', articles.delete);
  crossroads.addRoute('/article/{articleId}', articles.read);

  crossroads.param('articleId', articles.articleByID);
};
```

The above file defines routes for all possible operations on articles. Note that the second parameter on the `create`, `update` and `delete` routes is an array. Our modified crossroads build allows for executing multiple functions in sequence, and if any of those calls its callback (cb function in the controller example) with a non-null first argument, the next functions in the sequence don't get executed.

Another thing to note here is the `crossroads.param` function which is also custom, and allows for calling functions upon matching a param with the name like the first argument to the function. In this case, articles.articleById will get called before anything else in all functions that have `{articleId}` as a param in their route. Callback functions for the params are sent the following arguments: `spark`, `message`, `matched` and `callback`. `spark` and `message` are the same that get passed to the controllers, `matched` is the matched parameter value, and `callback` is the function you should call after you are done preprocessing the request.

To see how one such preprocessing could be done, refer to the `articleById` function in the `Controllers` section of this doc.

## Client

For the client side we have some initial mithril code that builds with [mithrilify](https://github.com/sectore/mithrilify), which you can modify and change to work as you please, the only important thing to note here is the way requests are made.
Our framework exposes a custom `primus.request()` function, which takes two arguments, `path` and `data`, and returns a Q `promise`. The promise is either resolved or rejected depending on whether you have called `spark.response` or `spark.error` on the server, respectively.
You could also choose to use a different front-end framework if you wish, you should just modify `package.json` with updated building options.

## Building for CDN deployment

If you are building a big project, you will most likely benefit from putting resources up on a CDN.
We have an integrated intelligent build script that will take all css and included external files and place everything together in the dist folder while minifying all the css into one file, and will take all the javascript files included in your `development` config file, except for those that end with `#nomin`, minify them, and place the output in `public/dest/js/min.js`.

To run the build script execute `npm run build`.

Place your `public/build` folder on your CDN, and set the CDN_BASE environment variable to the root of your CDN url (It is recommended to prefix with // instead of http:// or https://)

## Security

Nuke.js uses JWT tokens instead of regular sessions for keeping the user id necessary for populating the `user` variable on each request. The reasoning behind this is that JWT is easier to be implemented on non-browser applications that can communicate with primus, and it also provides protection against CSRF attacks.

## Caveats

Most UNIX-like systems have a `ulimit` limitation for open file descriptors. This limit needs to be removed to be able to handle a huge number of concurrent connections.
Read up on how to make your server highly scalable in [this article](https://mrotaru.wordpress.com/category/websockets/).

## Acknowledgements

nuke was inspired and is heavily influenced by mean.js for code structure and organization.
