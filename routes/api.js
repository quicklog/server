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
  var id = token + '_' + item.id;

  data.getCollection('items', function(e, items) {
    if(e) {
      console.error(e);
      return res.send(500);
    }

    items.update({ _id: id }, { "$set" : item }, { upsert: true }, function(e) {
      if(e) {
        console.error(e);
        return res.send(500);
      }
      res.send(200);
    });
  });
};

exports.getItems = function(req, res) {
  console.log('getItems');
  var items = [ {
    id: '1',
    tags: ['tag1', 'tag2'],
    comment: 'a comment',
    rating: 5,
    timestamp: new Date().getTime()
  },
  {
    id: '2',
    tags: ['tag1', 'tag2'],
    comment: 'another comment',
    rating: 3,
    timestamp: new Date().getTime()
  }
  ];
  res.send(items);
};