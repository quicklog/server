var assert = require('assert'),
      async = require('async'),
      data = require('../lib/data.js'),
      items = require('../lib/items.js'),
      sinon = require('sinon');

var deleteCollections = function(done) {
    process.env.QUICKLOG_HOST='localhost';
    process.env.QUICKLOG_DATABASE='quicklog-test';

    async.series([
      function(cb) {
        data.open(cb);
      },
      function(cb) {
        data.client.dropCollection(items.collections.itemDay, function() { cb(); });
      },
      function(cb) {
         data.client.dropCollection(items.collections.countsAll, function() { cb(); });
      },
       function(cb) {
         data.client.dropCollection(items.collections.countsTags, function() { cb(); });
      }
    ], done);
};

var sampleItems = [{
    id: 'ID',
    tags: ['TAG'],
    comment: 'COMMENT',
    rating: 3,
    timestamp: 1359486450504
}];

describe('items.add', function() {
  beforeEach(function(done) {
    deleteCollections(done);
  });
  afterEach(function() {
      data.close();
  });
  it('should not throw', function(done) {
    items.add('TESTUSER', sampleItems, done);
  });
});