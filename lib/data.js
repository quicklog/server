var _ = require('underscore'),
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

      return done(null);
    });

    return done(null);
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

      var pairs = _.pairs(count);
      var withoutId  = _.rest(pairs, 1);
      var data = _.map(withoutId, function(pair) { return { x: pair[0], y: pair[1] }; });

      return done(null, data);
    });
  });
};

module.exports = data;