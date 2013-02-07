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
  var sampleItem = null;
  var sampleItems = null;

  beforeEach(function(done) {
    sampleItem = {
      id: 'ID1',
      tags: ['tag1'],
      comment: 'COMMENT',
      rating: 4,
      attempts: 3,
      timestamp: 1359486450504
    };

    sampleItems = [sampleItem];

    return helper.deleteCollections(done);
  });
  afterEach(function(done) {
    return helper.closeConnection(done);
  });
  it('addMany should not throw', function(done) {
    items.addMany('TESTUSER', sampleItems, done);
  });
  it('addMany should add tags', function(done) {
    items.addMany('TESTUSER', sampleItems, function() {
      tags.all('TESTUSER', function(e, data) {
        assert.equal(1, data.length);
        assert.equal('tag1', data[0]);
        done(e);
      });
    });
  });
   it('addMany should aggregate by day', function(done) {
    items.addMany('TESTUSER', sampleItems, function() {
      tags.allAggregations('TESTUSER', 'tag1', function(e, data) {
        assert.equal(1, data.length);
        assert.equal(1, data[0].sumProcedures);
        assert.equal(1359417600000, data[0].day);
        assert.deepEqual(sampleItems[0].tag._id, data[0].tagid);
        done(e);
      });
    });
  });
});