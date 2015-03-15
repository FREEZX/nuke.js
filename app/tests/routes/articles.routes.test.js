'use strict';

var should = require('should');
var Primus = require('primus');
var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var User = mongoose.model('User');

var article;

var go = function(client) {
  describe('Article Routes Unit Tests', function() {
    beforeEach(function(done) {
      // Try to login the user via the socket
      var user = new User({
        firstName: 'Full',
        lastName: 'Name',
        displayName: 'Full Name',
        email: 'test@test.com',
        username: 'username',
        password: 'password'
      });

      user.save(function(err, user){
        client.request('/auth/signin', { username: user.username, password: 'password' })
        .then(function(){
          article = {
            title: 'Title',
            content: 'Content',
            user: user.id
          };

          done();
        });
      });
    });
    afterEach(function(done) {
      Article.remove().exec(function(){
        User.remove().exec(function(){
          done();
        });
      });
    });

    it('should be able to insert article', function(done){
      client.request('/article/create', article)
      .then(function(data){
        data._id.should.be.type('string');
        data.title.should.match(article.title);
        data.content.should.match(article.content);
        done();
      })
      .fail(function(data){
        done(new Error(data));
      });
    });

    it('should be able to get article by id', function(done){
      var articleObj = new Article(article);
      articleObj.save(function(err, doc){
        client.request('/article/'+doc.id)
        .then(function(data){
          data._id.should.match(doc.id);
          data.title.should.match(article.title);
          data.content.should.match(article.content);
          done();
        })
        .fail(function(data){
          done(new Error(data));
        });
      });
    });

    it('should be able to update article by id', function(done){
      var articleObj = new Article(article);
      articleObj.save(function(err, doc){
        article.title = 'Changed Title';
        client.request('/article/update/'+doc.id, article)
        .then(function(data){
          data._id.should.match(doc.id);
          data.title.should.match(article.title);
          data.content.should.match(article.content);
          done();
        })
        .fail(function(data){
          done(new Error(data));
        });
      });
    });

    it('should be able to delete article by id', function(done){
      var articleObj = new Article(article);
      articleObj.save(function(err, doc){
        client.request('/article/delete/'+doc.id)
        .then(function(data){
          data._id.should.match(doc.id);
          done();
        })
        .fail(function(data){
          done(new Error(data));
        });
      });
    });
  });
};

//Initialize connection and start tests
require('./clientconnection.js')(go);
