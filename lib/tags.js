var async = require('async'),
      data = require('./data.js'),
      moment = require('moment');

var tags = { };

tags.addMany = function(user, manyTags, done) {
  async.forEach(manyTags, function(tag, cb) { return tags.add(user, tag, cb); }, done);
};

tags.add = function(user, tag, done) {
  data.getCollection(data.collections.users, function(e, collection) {
    if(e) {
      return done(e);
    }

    return collection.update({ _id: user }, { "$addToSet": { 'tags': tag }}, { upsert: true }, done);
  });
};

tags.all = function(user, done) {
data.getCollection(data.collections.users, function(e, collection) {
    if(e) {
      return done(e);
    }

    collection.findOne({ _id: user }, function(e, user) {
      if(e) {
        return done(e);
      }

      var allTags = [];
      if(user && user.tags) {
        allTags = user.tags;
      }

      return done(null, allTags);
    });
  });
};

module.exports = tags;
