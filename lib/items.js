var async = require('async'),
  data = require('./data.js'),
  moment = require('moment'),
  tags = require('./tags.js');

var items = {};

items.addMany = function(user, manyItems, done) {
  async.forEach(manyItems, function(item, cb) {
    return items._add(user, item, cb);
  }, done);
};

items._add = function(user, item, done) {
  async.series([

  function(cb) {
    items._addStartOfDay(user, item, cb);
  }, function(cb) {
    items._addTags(user, item, cb);
  }, function(cb) {
    items._addItem(user, item, cb);
  }, function(cb) {
    items._aggregateByDay(user, item, cb);
  }], done);
};

items._addStartOfDay = function(userid, item, done) {
  item.day = moment(item.timestamp).startOf('day').valueOf();
  return done();
};

items._addTags = function(userid, item, done) {
  return tags.add(userid, item.tags[0], function(e, tag) {
    item.tag = tag;
    item.tags = undefined;
    return done(e);
  });
};

items._addItem = function(userid, item, done) {
  async.waterfall([

  function(cb) {
    return data.getCollection(data.collections.items, cb);
  }, function(collection, cb) {
    var toAdd = {
      _id: item.id,
      tagid: item.tag._id,
      day: item.day,
      timestamp: item.timestamp,
      comment: item.comment,
      rating: item.rating,
      failures: item.attempts - 1
    };

    return collection.insert(toAdd, cb);
  }], done);
};

items._aggregateByDay = function(userid, item, done) {
  async.waterfall([

  function(cb) {
    return data.getCollection(data.collections.aggregate_by_day, cb);
  }, function(collection, cb) {
    var byDay = {
      tagid: item.tag._id,
      day: item.day
    };

    return collection.update(byDay, {
      "$inc": {
        sumProcedures: 1,
        sumRatings: item.rating,
        sumFailures: item.attempts - 1
      }
    }, {
      upsert: true
    }, cb);
  }], done);
};

module.exports = items;