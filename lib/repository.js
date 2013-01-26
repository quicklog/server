var mongodb = require('mongodb');

var spokemongodb = { };

spokemongodb.configuration = function() {
  return {
    database: process.env.SPOKE_MONGO_DATABASE || 'spoke',
    host: process.env.SPOKE_MONGO_HOST || 'localhost',
    port: parseInt(process.env.SPOKE_MONGO_PORT || mongodb.Connection.DEFAULT_PORT, 10),
    user: process.env.SPOKE_MONGO_USER,
    password: process.env.SPOKE_MONGO_PASSWORD
  };
};

spokemongodb.open = function(callback) {
  var config = spokemongodb.configuration();
  var db = new mongodb.Db(config.database, new mongodb.Server(config.host, config.port, { ssl: false}), {});
  db.open(function(e, d) {
    if(e) {
      return callback(e, d);
    }     
    db.authenticate(config.user, config.password, function(e, d) {
      if(e) {
        return callback(e, d);
      }
      
      return callback(null, db);
    });
  });
};

module.exports = spokemongodb;
