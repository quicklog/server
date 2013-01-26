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

  var testing = true;
  if (testing) {
    var thedata = testData(tag);
    res.send(thedata);
  } else {
  	data.getTagCounts(who, tag, function(e, data) {
    	if(e) {
      		console.error(e);
      		res.send(500);
    	}
    	res.send(data);
  	});
  }
};

var testData = function(tag) {
 	var thedata = [];

	if (tag === "blood test") {
    thedata = [
        [1357084800000,9],
        [1357171200000,4],
        [1357257600000,2],
        [1357516800000,2],
        [1357603200000,2],
        [1357689600000,1],
        [1357776000000,2],
        [1357862400000,2],
        [1358121600000,1],
        [1358208000000,8],
        [1358294400000,6],
        [1358380800000,2],
        [1358467200000,0],
        [1358812800000,4],
        [1358899200000,1],
        [1358985600000,5]
      ];
  } else {
  	thedata = [
        [1357084800000,9],
        [1357171200000,5],
        [1357257600000,2],
        [1357516800000,2],
        [1357603200000,2],
        [1357689600000,1],
        [1357776000000,2],
        [1357862400000,2],
        [1358121600000,1],
        [1358208000000,5],
        [1358294400000,6],
        [1358380800000,2],
        [1358467200000,0],
        [1358812800000,4],
        [1358899200000,4],
        [1358985600000,5]
      ];
  }

	return thedata;
};