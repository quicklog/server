var async = require('async'),
      data = require('./data.js'),
      moment = require('moment'),
      tags = require('./tags.js');

var items = { };

items.addMany = function(user, manyItems, done) {
  async.forEach(manyItems, function(item, cb) { return items._add(user, item, cb); }, done);
};

items._add = function(user, item, done) {

  async.series([
    function(cb) { items._addDay(user, item, cb); },
    function(cb) { items._addTags(user, item, cb); },
    function(cb) { items._aggregateByDay(user, item, cb); },
    // old methods
    function(cb) { items._addForDay(user, item, cb); },
    function(cb) { items._addAllCounts(user, item, cb); },
    function(cb) { items._addTagCounts(user, item, cb); }
  ], done);
};

items._addDay = function(userid, item, done) {
  item.day = moment(item.timestamp).sod().valueOf();
  return done();
};

items._addTags = function(userid, item, done) {
  return tags.add(userid, item.tags[0], function(e, tag) {
    item.tag = tag;
    item.tags = undefined;
    return done(e);
  });
};

items._aggregateByDay = function(userid, item, done) {
   async.waterfall([
    function(cb) {
      return data.getCollection(data.collections.aggregate_by_day, cb);
    },
    function(collection, cb) {
      var byDay = {
        tagid: item.tag._id,
        day: item.day
      };

      return collection.update(byDay, { "$inc" : { sumProcedures: 1 } }, { upsert: true }, cb);
    }
  ], done);
};

items._addForDay = function(user, item, done) {
  var id = user + '_' + item.day;
  var set = { };
  set[item.id] = item;

  data.getCollection(data.collections.itemDay, function(e, collection) {
    if(e) {
      return done(e);
    }

    return collection.update({ _id: id }, { "$set" :  set }, { upsert: true }, done);
  });
};

items._addAllCounts = function(user, item, done) {
  data.getCollection(data.collections.countsAll, function(e, collection) {
    if(e) {
      return done(e);
    }

    var tag = item.tag.name;
    var inc = { };
    inc[tag] = 1;

    collection.update({ _id: user }, { "$inc" : inc }, { upsert: true }, done);
  });
};

items._addTagCounts = function(user, item, done) {

  data.getCollection(data.collections.countsTags, function(e, collection) {
    if(e) {
      return done(e);
    }

    var tag = item.tag.name;
    var id = user + '_' + tag;
    var inc = { };

    inc[item.day] = 1;

    collection.update({ _id: id }, { "$inc" : inc }, { upsert: true }, done);
  });
};

module.exports = items;
