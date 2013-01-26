exports.register = function(req, res) {
  res.send(200);
};

exports.addItems = function(req, res) {
  console.log('addItem');
  console.log(req);
  res.send(200);
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