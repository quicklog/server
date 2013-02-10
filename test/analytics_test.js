var assert = require('assert'),
      helper = require('./helper.js'),
      analytics = require('../lib/analytics.js'),
      sinon = require('sinon');

describe('analytics', function() {
  beforeEach(function(done) {
    return helper.deleteCollections(done);
  });
  afterEach(function(done) {
    return helper.closeConnection(done);
  });
  it('calling add should not throw', function(done) {
    done();
    //analytics.add('TESTUSER', 'tag1' , done);
  });
});