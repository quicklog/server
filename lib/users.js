var async = require('async'),
      crypto = require('crypto'),
      data = require('./data.js'),
      moment = require('moment'),
      uuid = require('node-uuid');

var users = { };

users.add = function(email, password, done) {
  data.getCollection(data.collections.users, function(e, collection) {
    if(e) {
      return done(e);
    }

    crypto.randomBytes(64, function(e, buf) {
      if(e) {
        return done(e);
      }

      var salt = buf.toString('base64');
      var hash = users.createHash(salt, password);

      var user = {
        email: email,
        token: uuid.v4(),
        salt: salt,
        hash: hash
      };

      return collection.insert(user, done);
    });
  });
};

users.createHash = function(salt, password) {
  var s = crypto.createHash('sha256');
  s.update(salt + password);
  return s.digest('hex');
};

module.exports = users;