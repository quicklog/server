var data = require('../lib/data.js'),
      items = require('../lib/items.js'),
      tags = require('../lib/tags.js'),
      users = require('../lib/users.js');

var api = {};

api.getToken = function(req, res) {
  var email = req.header('email');
  var password = req.header('password');
  if(!email || !password) {
    return res.send(404);
  }

  users.byEmailAndPassword(email, password, function(e, u) {
    if(e) {
      return res.send(404);
    }

    if(u === false) {
      return res.send(404);
    }

    return res.send(u.token);
  });
};

api.getTags = function(req, res) {
  tags.all(req.user._id, function(e, theTags) {
    if(e) {
      console.error(e);
      return res.send(500);
    }

    return res.send(theTags);
  });
};

api.getItems = function(req, res) {
  var tag = req.params.tag;
  var day = req.params.day;

  data.getItems(req.user._id, tag, day, function(e, items) {
    if(e) {
      console.error(e);
      return res.send(500);
    }

    return res.send(items);
  });
};

api.addItems = function(req, res) {
  if(!req.body) {
    console.error('missing items in body');
    return res.send('no items found in message body', 500);
  }

  items.addMany(req.user._id, req.body, function(e) {
    if(e) {
      console.error(e);
      return res.send(500);
    }

    res.send();
  });
};

api.getitems = function(req, res) {
  data.getAllCounts(req.user._id, function(e, data) {
    if(e) {
      console.error(e);
      res.send(500);
    }
    res.send(data);
  });
};

api.getitemsbytag = function(req, res) {
  var tag = req.params.tag;

  data.getTagCounts(req.user._id, tag, function(e, data) {
    if(e) {
      console.error(e);
      res.send(500);
    }
    res.send(data);
  });
};

module.exports = api;