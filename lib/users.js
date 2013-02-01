var async = require('async'),
      crypto = require('crypto'),
      data = require('./data.js'),
      moment = require('moment'),
      uuid = require('node-uuid');

var users = { };

var createHash = function(salt, password) {
  var s = crypto.createHash('sha256');
  s.update(salt + password);
  return s.digest('hex');
};

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
      var hash = createHash(salt, password);

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

users.byEmailAndPassword = function(email, password, done) {
  return users.byEmail(email, function(e, user) {
    if(e) {
      return done(e);
    }

    var hash = createHash(user.salt, password);
    if(hash != user.hash) {
      return done();
    }

    return done(null, user);
  });
};

users.byEmail = function(email, done) {
  data.getCollection(data.collections.users, function(e, collection) {
    if(e) {
      return done(e);
    }

    return collection.findOne({ email: email }, done);
  });
};

users.byToken = function(token, done) {
  data.getCollection(data.collections.users, function(e, collection) {
    if(e) {
      return done(e);
    }

    return collection.findOne({ token: token }, done);
  });
};

module.exports = users;