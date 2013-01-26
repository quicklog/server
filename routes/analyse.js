var data = require('../lib/data.js');

exports.getitems = function(req, res) {
  var who = "THEUSER";
  data.getAllCounts(who, function(e, data) {
    if(e) {
      console.error(e);
      res.send(500);
    }
    res.send(data);
  });
};

exports.getitemsbytag = function(req, res) {
  var who = "THEUSER";
  var tag = req.params.tag;
  data.getTagCounts(who, tag, function(e, data) {
    if(e) {
      console.error(e);
      res.send(500);
    }
    res.send(data);
  });
};