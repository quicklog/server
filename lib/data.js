var  async = require('async'),
      mongodb = require('mongodb');

var data = { };

data.collections = {
   users: 'users',
   tags: 'tags',
   items: 'items',
   aggregate_by_day : 'aggregate_by_day'
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
      return data.client.ensureIndex(data.collections.items, { tagid: 1, day: 1}, { unique: false }, cb);
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

module.exports = data;