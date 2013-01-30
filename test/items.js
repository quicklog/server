var assert = require('assert'),
      helper = require('./helper.js'),
      items = require('../lib/items.js'),
      sinon = require('sinon');

var sampleItems = [{
    id: 'ID',
    tags: ['TAG'],
    comment: 'COMMENT',
    rating: 3,
    timestamp: 1359486450504
}];

describe('items.add', function() {
  beforeEach(function(done) {
    return helper.deleteCollections(done);
  });
  afterEach(function(done) {
    return helper.closeConnection(done);
  });
  it('should not throw', function(done) {
    items.add('TESTUSER', sampleItems, done);
  });
});