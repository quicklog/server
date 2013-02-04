var _ = require('underscore'),
      async = require('async'),
      data = require('./data.js'),
      moment = require('moment');

var tags = { };

tags.addMany = function(userid, manyTags, done) {
  async.forEach(manyTags, function(tag, cb) { return tags.add(userid, tag, cb); }, done);
};

tags.add = function(userid, tag, done) {
  var theTag = {
      userid: userid,
      name: tag
  };

  async.waterfall([
    function(cb) {
      return data.getCollection(data.collections.tags, cb);
    },
    function(collection, cb) {
      return collection.update(theTag, { "$set" : theTag}, { upsert: true }, cb);
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

module.exports = tags;
