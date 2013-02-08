var _ = require('underscore'),
      async = require('async'),
      moment = require('moment'),
      mongodb = require('mongodb');

var data = { };

data.collections = {
   users: 'users',
   tags: 'tags',
   aggregate_by_day : 'aggregate_by_day',
   itemDay : 'itemDays',
   countsAll : 'countsAll',
   countsTags : 'countsTags'
};

data.client = null;
data.configuration = function() {
  return {
    database: process.env.QUICKLOG_DATABASE  || 'quicklog',
    host: process.env.QUICKLOG_HOST  || 'localhost',
    port: parseInt(process.env.QUICKLOG_PORT || 27017, 10),
    user: process.env.QUICKLOG_USER || 'user',
    password: process.env.QUICKLOG_PASSWORD || 'password',
    serverOptions: {
      auto_reconnect: true,
      poolSize: 5,
      ssl: false
    }
  };
};

data.open = function(done) {
  async.series([
    function(cb) {
      data.close();
      var config = data.configuration();
      data.client = new mongodb.Db(config.database, new mongodb.Server(config.host, config.port, config.serverOptions), { safe: true });
      return cb();
    },
    function(cb) {
      return data.client.open(cb);
    },
    function(cb) {
      var config = data.configuration();
      return data.client.authenticate(config.user, config.password, cb);
    },
    function(cb) {
      return data.client.ensureIndex(data.collections.aggregate_by_day, { tagid: 1}, { unique: false }, cb);
    },
    function(cb) {
      return data.client.ensureIndex(data.collections.aggregate_by_day, { tagid: 1, day: 1}, { unique: true }, cb);
    },
    function(cb) {
      return data.client.ensureIndex(data.collections.tags, { userid: 1, name: 1}, { unique: true }, cb);
    },
    function(cb) {
      return data.client.ensureIndex(data.collections.users, { email: 1}, { unique: true }, cb);
    },
    function(cb) {
      return data.client.ensureIndex(data.collections.users, { token: 1}, { unique: true }, cb);
    }], done);
};

data.close = function() {
  if(data.client) {
    data.client.close();
    data.client = null;
  }
};

data.getCollection = function(name, done) {
  if(!data.client) {
    return done('data has not been opened');
  }

  return data.client.collection(name, done);
};

data.getAllCounts = function(user, done) {
  data.getCollection(data.collections.countsAll, function(e, counts) {
    if(e) {
      return done(e);
    }

    counts.findOne({ _id: user }, function(e, count) {
      if(e) {
        return done(e);
      }

      return done(null, data.flip(count));
    });
  });
};

data.getTagCounts = function(user, tag, done) {
  data.getCollection(data.collections.countsTags, function(e, counts) {
    if(e) {
      return done(e);
    }

    var id = user + '_' + tag;
    counts.findOne({ _id: id }, function(e, count) {
      if(e) {
        return done(e);
      }

      var flipped = data.flip2(count);

      // Hardcode failures to be 25% with a 50% chance of happening
      var failures = _.map(flipped, function(point) {
        var failureCount = 0;
        if (Math.random() > 0.5) {
          failureCount = Math.abs(point[1] * 0.25);
        }

        return [point[0], failureCount];
      });

      var ret = {
        counts: flipped,
        failures: failures
      };

      return done(null, ret);
    });
  });
};

data.getItems = function(user, tag, day, done) {
  data.getCollection(data.collections.itemDay, function(e, itemDays) {
    if(e) {
      console.error(e);
      return done(e);
    }

    var id = user + '_' + moment(parseInt(day, 0)).sod().valueOf();
    itemDays.findOne({ _id: id }, function(e, itemDay) {
        if(e) {
          console.error(e);
          return done(e);
        }
        var items = _.values(itemDay);
        var withoutId  = _.reject(items, function(item){ return item == itemDay._id; });
        return done(null, withoutId);
      });
  });
};

data.flip = function(data) {
      var pairs = _.pairs(data);
      var withoutId  = _.reject(pairs, function(pair){ return pair[0] == '_id'; });
      var flipped = _.map(withoutId, function(pair) { return { x: pair[0], y: pair[1] }; });
      return flipped;
};

data.flip2 = function(data) {
      var pairs = _.pairs(data);
      var withoutId  = _.reject(pairs, function(pair){ return pair[0] == '_id'; });
      var flipped = _.map(withoutId, function(pair) { return [ parseInt(pair[0], 0), pair[1] ]; });
      return flipped;
};

module.exports = data;