var mongodb = require('mongodb');

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

module.exports = data;