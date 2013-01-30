var async = require('async'),
      data = require('./data.js'),
      moment = require('moment');

var items = { };

items.add = function(user, itemsToAdd, done) {
  var item =  itemsToAdd[0];
  item.day = moment(item.timestamp).sod().valueOf();

  async.series([
    function(cb) { items.addForDay(user, item, cb); },
    function(cb) { items.addAllCounts(user, item, cb); },
    function(cb) { items.addTagCounts(user, item, cb); }
  ], done);
};

items.addForDay = function(user, item, done) {
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

items.addAllCounts = function(user, item, done) {
  data.getCollection(data.collections.countsAll, function(e, collection) {
    if(e) {
      return done(e);
    }

    var tag = item.tags[0];
    var inc = { };
    inc[tag] = 1;

    collection.update({ _id: user }, { "$inc" : inc }, { upsert: true }, done);
  });
};

items.addTagCounts = function(user, item, done) {

  data.getCollection(data.collections.countsTags, function(e, collection) {
    if(e) {
      return done(e);
    }

    var tag = item.tags[0];
    var id = user + '_' + tag;
    var inc = { };

    inc[item.day] = 1;

    collection.update({ _id: id }, { "$inc" : inc }, { upsert: true }, done);
  });
};

module.exports = items;
