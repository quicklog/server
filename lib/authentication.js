var authentication = {};

authentication.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  }
  
  res.redirect('/');
}

var users = [
    { id: 1, username: 'me', password: 'me', email: 'demo@demo.com' }
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

module.exports = authentication;