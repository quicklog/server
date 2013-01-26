exports.index = function(req, res) {
  res.render('index', { title: 'Quicklog' });
};

exports.all = function(req, res) {
  res.render('all', { title: 'all' });
};

exports.tagged = function(req, res) {
	var tag = req.params.tag;
	res.render('tag', { tag: tag });
};
