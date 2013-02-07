var data = require('../lib/data.js'),
      items = require('../lib/items.js'),
      tags = require('../lib/tags.js'),
      users = require('../lib/users.js');

var api = {};

api.authenticate = function(req, res) {
  var email = req.header('email');
  var password = req.header('password');
  if(!email || !password) {
    return res.send(404);
  }

  users.byEmailAndPassword(email, password, function(e, u) {
    if(e) {
      return res.send(404);
    }
    return res.send(u.token);
  });
};

api.getTags = function(req, res) {
  var who = "THEUSER";
  tags.all(who, function(e, theTags) {
    if(e) {
      console.error(e);
      return res.send(500);
    }

    return res.send(theTags);
  });
};

api.getItems = function(req, res) {
  var who = "THEUSER";
  var tag = req.params.tag;
  var day = req.params.day;

  data.getItems(who, tag, day, function(e, items) {
    if(e) {
      console.error(e);
      return res.send(500);
    }

    return res.send(items);
  });
};

api.addItems = function(req, res) {
  if(!req.headers['usertoken']) {
    console.error('missing header [usertoken]');
    return res.send('you are not authenticated to use this service', 500);
  }

  if(!req.body) {
    console.error('missing items in body');
    return res.send('no items found in message body', 500);
  }

  var user = 'THEUSER';

  items.addMany(user, req.body, function(e) {
    if(e) {
      console.error(e);
      return res.send(500);
    }

    res.send();
  });
};

module.exports = api;