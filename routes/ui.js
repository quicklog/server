exports.index = function(req, res) {
  res.render('index', { title: 'My Quicklog' });
};

exports.me = function(req, res) {
  res.render('me', { title: "me" });
};

exports.all = function(req, res) {
  res.render('all', { title: 'all' });
};