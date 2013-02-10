var assert = require('assert'),
      helper = require('./helper.js'),
      analytics = require('../lib/analytics.js'),
      sinon = require('sinon');

describe('analytics', function() {
  var user = 'TESTUSER';

  beforeEach(function(done) {
    return helper.deleteCollections(done);
  });
  afterEach(function(done) {
    return helper.closeConnection(done);
  });
  it('calling getAllCounts not throw', function(done) {
    analytics.getAllCounts(user, done);
  });
  it('calling getTagCounts not throw', function(done) {
    analytics.getTagCounts(user, 'tag', done);
  });
  it('calling getItems not throw', function(done) {
    analytics.getItems(user, 'tag', 0, done);
  });
});