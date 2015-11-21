'use strict';

var should = require('should');
var Primus = require('primus');
var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var User = mongoose.model('User');

var article;

var go = function(client) {
  describe('Article Routes Unit Tests', function() {
    before(function(done) {
      Article.remove().exec(function(){
        User.remove().exec(function(){
          done();
        });
      });
    });
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

    it('should be able to list articles', function(done){
      var articleObj1 = new Article(article);
      articleObj1.save(function(err, article1){
        var articleObj2 = new Article(article);
        articleObj2.save(function(err, article2){
          client.request('/article/list', article)
          .then(function(data){
            data[0]._id.should.match(article2.id);
            data[0].title.should.match(article2.title);
            data[0].content.should.match(article2.content);
            data[1]._id.should.match(article1.id);
            data[1].title.should.match(article1.title);
            data[1].content.should.match(article1.content);
            done();
          })
          .fail(function(data){
            done(new Error(data));
          });
        });
      });

    });

    it('should be able to watch articles', function(done) {
      client.request('/article/watch')
      .then(function(data) {
        done();
      })
      .fail(function(data) {
        done(new Error(data));
      });
    });

    it('should be able to receive data for new articles', function(done) {
      client.request('/article/create', article);
      client.on('data', function(data){
        if(data.data.type === 'watch' && data.data.data.title === 'Title') {
          done();
        }
      });
    });

    it('should be able to receive data for updated articles', function(done) {
      var articleObj = new Article(article);
      articleObj.save(function(err, doc){
        article.title = 'Changed Title';
        client.request('/article/update/'+doc.id, article);
      });
      client.on('data', function(data){
        if(data.data.type === 'watch' && data.data.data.title === 'Changed Title') {
          done();
        }
      });
    });
  });
};

//Initialize connection and start tests
require('./clientconnection.js')(go);
