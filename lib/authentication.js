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
      // TODO let the user know what's happened
      return res.redirect('/register');
    }

    return res.redirect('/');
  });
};

module.exports = authentication;