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

      var message = 'Registration failed';

      if( e.err && e.err.indexOf('E11000 duplicate key error index') == 0) {
        message += ' : email already exists';
      } else {
        message += ' with an unexpected error';
      }

      req.flash('register', message);
      return res.redirect('/register');
    }

    return res.redirect('/');
  });
};

module.exports = authentication;