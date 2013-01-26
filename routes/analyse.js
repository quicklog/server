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

var testData = function() {
 	var data = [];

  	if (tag === "blood test") {

		data = [
		{
          "x": "2012-11-05",
          "y": 1
        },
        {
          "x": "2012-11-06",
          "y": 6
        }];
    } else {
    	data = [
		{
          "x": "2012-11-05",
          "y": 10
        },
        {
          "x": "2012-11-06",
          "y": 2
        }];
    }

	res.send(data);
};