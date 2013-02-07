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

module.exports = authentication;