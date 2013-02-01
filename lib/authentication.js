var authentication = {};

authentication.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  }
  
  res.redirect('/');
}

var users = [
    { id: 1, username: 'demo', password: 'demo', email: 'demo@demo.com' }
];

authentication.findById = function(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
};

authentication.findByUsername = function(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }

  return fn(null, null);
};

authentication.strategy = function(username, password, done) {
  authentication.findByUsername(username, function(err, user) {
    if (err) { 
      return done(err); 
    }

    if (!user) { 
      return done(null, false, { message: 'Unknown user ' + username }); 
    }

    if (user.password != password) { 
      return done(null, false, { message: 'Invalid password' }); 
    }

    return done(null, user);
  });
};

module.exports = authentication;