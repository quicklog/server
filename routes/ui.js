exports.index = function(req, res) {
  res.render('index');
};

exports.me = function(req, res) {
  res.render('me');
};

exports.all = function(req, res) {
  res.render('all', { title: 'all' });
};