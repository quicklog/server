var analytics = require('../lib/analytics.js'),
  assert = require('assert'),
  helper = require('./helper.js'),
  items = require('../lib/items'),
  moment = require('moment'),
  sinon = require('sinon');

describe('analytics', function() {
  var user = 'TESTUSER';
  var startTimestamp = 1318781876406;
  var startDay = moment(startTimestamp).startOf('day').valueOf();
  var anotherTimestamp = moment(startTimestamp).add('days', 1).valueOf();
  var anotherDay = moment(anotherTimestamp).startOf('day').valueOf();

  beforeEach(function(done) {
    return helper.deleteCollections(done);
  });
  afterEach(function(done) {
    return helper.closeConnection(done);
  });
  it('calling getItems not throw', function(done) {
    analytics.getItems(user, 'tag', 0, done);
  });
  it('calling getItems with empty data should return expected', function(done) {
    analytics.getItems(user, 'tag', startDay, function(e, d) {
      var expected = [];
      assert.deepEqual(d, expected);
      return done();
    });
  });
  it('calling getItems with one item with no failures should return expected', function(done) {
    var sampleItems = [{
      id: 'ID',
      tags: ['tag'],
      comment: 'COMMENT',
      rating: 4,
      attempts: 1,
      timestamp: startTimestamp
    }];
    items.addMany(user, sampleItems, function() {
      analytics.getItems(user, 'tag', startDay, function(e, d) {
        var expected = [{
          _id: "ID",
          timestamp: 1318781876406,
          comment: "COMMENT",
          rating: 4,
          failures: 0
        }];
        assert.deepEqual(d, expected);
        return done();
      });
    });
  });
  it('calling getTagCounts not throw', function(done) {
    analytics.getTagCounts(user, 'tag', done);
  });
  it('calling getTagCounts with empty data should return expected', function(done) {
    analytics.getTagCounts(user, 'tag', function(e, d) {
      var expected = {
        name: 'tag',
        counts: [],
        failures: []
      };
      assert.deepEqual(d, expected);
      return done();
    });
  });
  it('calling getTagCounts with one item with no failures should return expected', function(done) {
    var sampleItems = [{
      id: 'ID',
      tags: ['tag'],
      comment: 'COMMENT',
      rating: 4,
      attempts: 1,
      timestamp: startTimestamp
    }];

    items.addMany(user, sampleItems, function() {
      analytics.getTagCounts(user, 'tag', function(e, d) {
        var expected = {
          name: "tag",
          counts: [
            [startDay, 1]
          ],
          failures: [
            [startDay, 0]
          ]
        };
        assert.deepEqual(d, expected);
        return done();
      });
    });
  });
  it('calling getTagCounts with one item with one failures should return expected', function(done) {
    var sampleItems = [{
      id: 'ID',
      tags: ['tag'],
      comment: 'COMMENT',
      rating: 4,
      attempts: 2,
      timestamp: startTimestamp
    }];

    items.addMany(user, sampleItems, function() {
      analytics.getTagCounts(user, 'tag', function(e, d) {
        var expected = {
          name: "tag",
          counts: [
            [startDay, 1]
          ],
          failures: [
            [startDay, 1]
          ]
        };
        assert.deepEqual(d, expected);
        return done();
      });
    });
  });
  it('calling getTagCounts with many items with failures should return expected', function(done) {
    var sampleItems = [{
      id: 'ID',
      tags: ['tag'],
      comment: 'COMMENT',
      rating: 4,
      attempts: 2,
      timestamp: startTimestamp
    }, {
      id: 'ID2',
      tags: ['tag'],
      comment: 'COMMENT',
      rating: 2,
      attempts: 1,
      timestamp: startTimestamp
    }, {
      id: 'ID3',
      tags: ['tag'],
      comment: 'COMMENT',
      rating: 2,
      attempts: 1,
      timestamp: anotherTimestamp
    }];

    items.addMany(user, sampleItems, function() {
      analytics.getTagCounts(user, 'tag', function(e, d) {
        var expected = {
          name: "tag",
          counts: [
            [startDay, 2],
            [anotherDay, 1]
          ],
          failures: [
            [startDay, 1],
            [anotherDay, 0]
          ]
        };
        assert.deepEqual(d, expected);
        return done();
      });
    });
  });
});