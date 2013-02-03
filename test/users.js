var assert = require('assert'),
      helper = require('./helper.js'),
      users = require('../lib/users.js'),
      sinon = require('sinon');

describe('users', function() {
  beforeEach(function(done) {
    return helper.deleteCollections(done);
  });
  afterEach(function(done) {
    return helper.closeConnection(done);
  });
  it('calling add should not throw', function(done) {
    users.add('user', 'password', done);
  });
  it('calling add twice should throw', function(done) {
    users.add('user', 'password', function() {
      users.add('user', 'password', function(e) {
        assert.notEqual(null, e);
        assert.notEqual(undefined, e);
        return done();
      });
    });
  });
  it('calling byEmailAndPassword with valid details should return user', function(done) {
    users.add('user', 'password', function() {
      users.byEmailAndPassword('user', 'password', function(e, u) {
        assert.notEqual(null, u);
        assert.equal('user', u.email);
        return done(e);
      });
    });
  });
  it('calling byEmailAndPassword with invalid password should return false', function(done) {
    users.add('user', 'password', function() {
      users.byEmailAndPassword('user', 'wrong', function(e, u) {
        assert.equal(null, e);
        assert.equal(false, u);
        return done(e);
      });
    });
  });
  it('calling byEmailAndPassword with invalid user should return false', function(done) {
    users.add('user', 'password', function() {
      users.byEmailAndPassword('wrong', 'wrong', function(e, u) {
        assert.equal(null, e);
        assert.equal(false, u);
        return done(e);
      });
    });
  });
  it('calling byEmail with valid email should return user', function(done) {
    users.add('user', 'password', function() {
      users.byEmail('user', function(e, u) {
        assert.notEqual(null, u);
        assert.equal('user', u.email);
        return done(e);
      });
    });
  });
  it('calling byToken with valid token should return user', function(done) {
    users.add('user', 'password', function() {
      users.byEmail('user', function(e, u) {
        users.byToken(u.token, function(e, t) {
          assert.notEqual(null, t);
          assert.equal('user', t.email);
          return done(e);
        });
      });
    });
  });
});