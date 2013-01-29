var data = require('../lib/data.js'),
      items = require('../lib/items.js');

exports.register = function(req, res) {
  res.send('USERTOKEN');
};

exports.addItems = function(req, res) {
  console.log('addItems');
  var token = req.headers['usertoken'];

  if(!token) {
    console.error('missing header');
    return res.send('missing usertoken header', 500);
  }

  if(!req.body) {
    console.error('missing items in body');
    return res.send('missing items in body', 500);
  }

  var user = 'THEUSER';

  items.add(user, req.body, function(e) {
    if(e) {
      console.error(e);
      return res.send(500);
    }

    res.send();
  });
};

exports.getItems = function(req, res) {
  console.log('getItems');
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