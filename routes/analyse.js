var data = require('../lib/data.js');

exports.getitems = function(req, res) {
  data.getAllCounts(req.user._id, function(e, data) {
    if(e) {
      console.error(e);
      res.send(500);
    }
    res.send(data);
  });
};

exports.getitemsbytag = function(req, res) {
  var tag = req.params.tag;

  data.getTagCounts(req.user._id, tag, function(e, data) {
    if(e) {
      console.error(e);
      res.send(500);
    }
    res.send(data);
  });
};