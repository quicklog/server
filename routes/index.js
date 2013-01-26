exports.index = function(req, res) {
  res.render('index', { title: 'Express' })
};

exports.addItem = function(req, res) {
  console.log(req);
  res.send();
};