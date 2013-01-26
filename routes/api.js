var data = require('../lib/data.js');

exports.register = function(req, res) {
  console.log('register');
  res.send('USERTOKEN');
};

exports.addItems = function(req, res) {
  console.log('addItems');
  var token = req.headers['usertoken'];
  if(!token) {
    console.error('missing header');
    return res.send('missing usertoken', 500);
  }

  var items = req.body;
  if(!items) {
    console.error('missing items');
    return res.send('missing items', 500);
  }

  var item = items[0];

  data.addItem(token, item, function(e) {
    if(e) {
      console.error(e);
      return res.send(500);
    }
    data.addAllCounts(token, item, function(e) {
      if(e) {
        console.error(e);
        return res.send(500);
      }

      return res.send(200);
    });
  });
};

exports.getItems = function(req, res) {
  console.log('getItems');
  var items = [
  ];
  res.send(items);
};