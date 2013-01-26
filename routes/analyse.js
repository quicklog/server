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
	var tag = req.params.tag;

	var data = [
        {
          "x": "2013-01-05",
          "y": 1
        },
        {
          "x": "2013-01-06",
          "y": 6
        },
        {
          "x": "2013-01-07",
          "y": 13
        },
        {
          "x": "2013-01-08",
          "y": 0
        },
        {
          "x": "2013-01-09",
          "y": 0
        },
        {
          "x": "2013-01-10",
          "y": 9
        },
        {
          "x": "2013-01-11",
          "y": 6
        }
    ];

    res.send(data);
};