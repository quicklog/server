var assert = require('assert'),
      helper = require('./helper.js'),
      items = require('../lib/items.js'),
      tags = require('../lib/tags.js'),
      sinon = require('sinon');

var sampleItems = [{
    id: 'ID',
    tags: ['tag1'],
    comment: 'COMMENT',
    rating: 4,
    timestamp: 1359486450504
}];

describe('items', function() {
  beforeEach(function(done) {
    return helper.deleteCollections(done);
  });
  afterEach(function(done) {
    return helper.closeConnection(done);
  });
  it('addMany should not throw', function(done) {
    items.addMany('TESTUSER', sampleItems, done);
  });
  it('add should not throw', function(done) {
    items.add('TESTUSER', sampleItems[0], done);
  });
  it('add should add tags', function(done) {
    items.add('TESTUSER', sampleItems[0], function() {
      tags.all('TESTUSER', function(e, data) {
        assert.equal(1, data.length);
        assert.equal('tag1', data[0]);
        done(e);
      });
    });
  });
});