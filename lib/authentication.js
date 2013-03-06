var users = require('./users.js');

var authentication = {};

authentication.ensure = function(req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  }

  var token = req.header('usertoken');
  if (!token) {
    return res.redirect('/');
  }

  users.byToken(token, function(error, user) {
    if (!error && user) {
      req.user = user;
      return next();
    }

    return res.redirect('/');
  });    
};

authentication.doregister = function(req, res) {
  users.add(req.body.username, req.body.password, function(e) {
    if(e) {
      console.log(e);
      req.flash('register', 'Registration failed');
      return res.redirect('/register');
    }

    return res.redirect('/');
  });
};

module.exports = authentication;