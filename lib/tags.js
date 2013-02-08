var _ = require('underscore'),
      idgen = require('./idgen'),
      async = require('async'),
      data = require('./data'),
      moment = require('moment');

var tags = { };

tags.addMany = function(userid, manyTags, done) {
  async.forEach(manyTags, function(tag, cb) { return tags.add(userid, tag, cb); }, done);
};

tags.add = function(userid, tag, done) {
  var id = idgen.create(userid + '_' + tag);
  var theTag = {
      userid: userid,
      name: tag
  };

  async.waterfall([
    function(cb) {
      return data.getCollection(data.collections.tags, cb);
    },
    function(collection, cb) {
      // would like to use findAndModify here, but it doesn't work in mongolab :(
      return collection.update({ _id: id }, { "$set" :  theTag }, { upsert: true }, cb);
    },
    function(a, b, cb) {
      theTag._id = id;
      return cb(null, theTag);
    }
  ], done);
};

tags.all = function(userid, done) {
  async.waterfall([
      function(cb) {
        return data.getCollection(data.collections.tags, cb);
      },
      function(collection, cb) {
        return collection.find({ userid: userid }).toArray(cb);
      },
      function(userTags, cb) {
        return cb(null, _.map(userTags, function(tag){ return tag.name; }));
      }
  ], done);
};

tags.allAggregations = function(userid, tag, done) {
  async.waterfall([
      function(cb) {
        return tags.add(userid, tag, cb);
      },
      function(tag, cb) {
        return data.getCollection(data.collections.aggregate_by_day, function(e, collection) {
          return cb(e, tag, collection);
        });
      },
      function(tag, collection, cb) {
        return collection.find({ tagid: tag._id }).toArray(cb);
      }
  ], done);
};

module.exports = tags;
