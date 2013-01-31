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
});