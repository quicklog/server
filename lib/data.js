var _ = require('underscore'),
      moment = require('moment'),
      mongodb = require('mongodb');

var data = { };

data.client = null;

data.configuration = function() {
  return {
    database: process.env.QUICKLOG_DATABASE,
    host: process.env.QUICKLOG_HOST,
    port: parseInt(process.env.QUICKLOG_PORT, 10),
    user: process.env.QUICKLOG_USER,
    password: process.env.QUICKLOG_PASSWORD,
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

data.addItem = function(user, item, done) {
  console.log('addItem');
  var id = user + '_' + item.id;

  data.getCollection('items', function(e, items) {
    if(e) {
      return done(e);
    }

    items.update({ _id: id }, { "$set" : item }, { upsert: true }, function(e) {
      if(e) {
        return done(e);
      }

      return done(null);
    });
  });
};

data.addItemDay = function(user, item, done) {
  console.log('addItemDay');

  var day = moment(item.timestamp).sod().valueOf();
  var id = user + '_' + day;

  data.getCollection('itemDays', function(e, items) {
    if(e) {
      return done(e);
    }

    var set = { };
    set[item.id] = item;

    items.update({ _id: id }, { "$set" :  set }, { upsert: true }, function(e) {
      if(e) {
        return done(e);
      }

      return done(null);
    });
  });
};

data.addAllCounts = function(user, item, done) {
  console.log('addAllCounts');
  data.getCollection('countsAll', function(e, counts) {
    if(e) {
      return done(e);
    }
    var tag = item.tags[0];
    var inc = { };
    inc[tag] = 1;

    counts.update({ _id: user }, { "$inc" : inc }, { upsert: true }, function(e) {
      if(e) {
        return done(e);
      }

      return data.addTagCounts(user, item, done);
    });
  });
};

data.addTagCounts = function(user, item, done) {
  console.log('addAllCounts');
  data.getCollection('countsTags', function(e, counts) {
    if(e) {
      return done(e);
    }

    var tag = item.tags[0];
    var id = user + '_' + tag;
    var inc = { };
    //inc[moment(item.timestamp).format("YYYY-MM-DD")] = 1;
    inc[moment(item.timestamp).sod().valueOf()] = 1;

    counts.update({ _id: id }, { "$inc" : inc }, { upsert: true }, function(e) {
      if(e) {
        return done(e);
      }

      return done(null);
    });
  });
};

data.getAllCounts = function(user, done) {
  data.getCollection('countsAll', function(e, counts) {
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
  data.getCollection('countsTags', function(e, counts) {
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
  data.getCollection('itemDays', function(e, itemDays) {
    if(e) {
      return done(e);
    }

    var id = user + '_' + moment(parseInt(day, 0)).sod().valueOf();
    itemDays.findOne({ _id: id }, function(e, itemDay) {
        if(e) {
          return done(e);
        }
        var items = _.values(itemDay);
        return done(null, items);
      });
  });
};

//   var items = [{
//     "_id": "THEUSER_2",
//     "comment": "comment 1",
//     "id": 2,
//     "rating": 5,
//     "tags": [
//         "canula"
//     ],
//     "timestamp": 1358985600000
// },
// {
//     "_id": "THEUSER_2",
//     "comment": "happy",
//     "id": 2,
//     "rating": 5,
//     "tags": [
//         "canula"
//     ],
//     "timestamp": 1358985600000
// }];
//   return done(null, items);

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