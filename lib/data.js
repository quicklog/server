var _ = require('underscore'),
      moment = require('moment'),
      mongodb = require('mongodb');

var data = { };

data.collections = {
   users: 'users',
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
  var config = data.configuration();
  var db = new mongodb.Db(config.database, new mongodb.Server(config.host, config.port, config.serverOptions), { safe: true });
  db.open(function(e, d) {
    if(e) {
      return done(e);
    }
    db.authenticate(config.user, config.password, function(e, d) {
      if(e) {
        return done(e);
      }
      data.client = db;
      return done();
    });
  });
};

data.close = function() {
  if(data.client) {
    data.client.close();
    data.client = null;
  }
};

data.getCollection = function(name, done) {
  if(data.client) {
    return data.client.collection(name, done);
  }
  return done('data has not been opened');
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
      return done(e);
    }

    var id = user + '_' + moment(parseInt(day, 0)).sod().valueOf();
    itemDays.findOne({ _id: id }, function(e, itemDay) {
        if(e) {
          return done(e);
        }

        var items = _.values(itemDay);
        var withoutId  = _.reject(items, function(item){ return item == itemDay._id; });
        var correctTag = _.reject(withoutId, function(item) { return item.tags[0]  !== tag; });
        return done(null, correctTag);
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