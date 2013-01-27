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
  var items = [{
    "_id": "THEUSER_2",
    "comment": "comment 1",
    "id": 2,
    "rating": 5,
    "tags": [
        "canula"
    ],
    "timestamp": 1358985600000
},
{
    "_id": "THEUSER_2",
    "comment": "happy",
    "id": 2,
    "rating": 5,
    "tags": [
        "canula"
    ],
    "timestamp": 1358985600000
}];
  res.send(items);
};