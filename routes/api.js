var data = require('../lib/data.js');

exports.register = function(req, res) {
  res.send('USERTOKEN');
};

exports.addItems = function(req, res) {
  data.getCollection('items', function(e, items) {
    if(e) {
      console.error(e);
      return res.send(500);
    }

    var item = {
      _id: '1',
      tags: ['tag1', 'tag2'],
      comment: 'a comment',
      rating: 5,
      timestamp: new Date().getTime()
    };

    items.update({ _id: item._id }, { "$set" : item }, { upsert: true }, function(e) {
      if(e) {
        console.error(e);
        return res.send(500);
      }
      res.send(200);
    });
  });
};

exports.getItems = function(req, res) {
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