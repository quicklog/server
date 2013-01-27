
var _ = require('underscore'),
      request = require('request');

var data = [
    [ "blood test", 1357084800000 ],
    [ "blood test", 1357084800000 ],
    [ "blood test", 1357084800000 ],
    [ "blood test", 1357084800000 ],
    [ "blood test", 1357084800000 ],
    [ "blood test", 1357084800000 ],
    [ "blood test", 1357084800000 ],
    [ "blood test", 1357084800000 ],
    [ "blood test", 1357084800000 ],
    [ "blood test", 1357171200000 ],
    [ "blood test", 1357171200000 ],
    [ "blood test", 1357171200000 ],
    [ "blood test", 1357171200000 ],
    [ "blood test", 1357171200000 ],
    [ "blood test", 1357171200000 ],
    [ "blood test", 1357257600000 ],
    [ "blood test", 1357257600000 ],
    [ "blood test", 1357257600000 ],
    [ "blood test", 1357516800000 ],
    [ "blood test", 1357603200000 ],
    [ "blood test", 1357603200000 ],
    [ "blood test", 1357603200000 ],
    [ "blood test", 1357603200000 ],
    [ "blood test", 1357603200000 ],
    [ "blood test", 1357689600000 ],
    [ "blood test", 1357689600000 ],
    [ "blood test", 1357689600000 ],
    [ "blood test", 1357776000000 ],
    [ "blood test", 1357776000000 ],
    [ "blood test", 1357776000000 ],
    [ "blood test", 1357776000000 ],
    [ "blood test", 1357862400000 ],
    [ "blood test", 1357862400000 ],
    [ "blood test", 1357862400000 ],
    [ "blood test", 1357862400000 ],
    [ "blood test", 1357862400000 ],
    [ "blood test", 1357862400000 ],
    [ "blood test", 1357862400000 ],
    [ "blood test", 1357862400000 ],
    [ "blood test", 1357862400000 ],
    [ "blood test", 1357862400000 ],
    [ "blood test", 1357862400000 ],
    [ "blood test", 1358121600000 ],
    [ "blood test", 1358121600000 ],
    [ "blood test", 1358121600000 ],
    [ "blood test", 1358208000000 ],
    [ "blood test", 1358208000000 ],
    [ "blood test", 1358208000000 ],
    [ "blood test", 1358294400000 ],
    [ "blood test", 1358294400000 ],
    [ "blood test", 1358294400000 ],
    [ "blood test", 1358380800000 ],
    [ "blood test", 1358380800000 ],
    [ "blood test", 1358467200000 ],
    [ "blood test", 1358467200000 ],
    [ "blood test", 1358467200000 ],
    [ "blood test", 1358812800000 ],
    [ "blood test", 1358812800000 ],
    [ "blood test", 1358899200000 ],
    [ "blood test", 1358899200000 ],
    [ "blood test", 1358899200000 ],
    [ "blood test", 1358899200000 ],
    [ "blood test", 1358985600000 ],
    [ "blood test", 1358985600000 ],
    [ "canula", 1357084800000 ],
    [ "canula", 1357084800000 ],
    [ "canula", 1357084800000 ],
    [ "canula", 1357084800000 ],
    [ "canula", 1357171200000 ],
    [ "canula", 1357171200000 ],
    [ "canula", 1357171200000 ],
    [ "canula", 1357171200000 ],
    [ "canula", 1357171200000 ],
    [ "canula", 1357171200000 ],
    [ "canula", 1357171200000 ],
    [ "canula", 1357257600000 ],
    [ "canula", 1357257600000 ],
    [ "canula", 1357257600000 ],
    [ "canula", 1357257600000 ],
    [ "canula", 1357516800000 ],
    [ "canula", 1357516800000 ],
    [ "canula", 1357516800000 ],
    [ "canula", 1357516800000 ],
    [ "canula", 1357516800000 ],
    [ "canula", 1357516800000 ],
    [ "canula", 1357516800000 ],
    [ "canula", 1357603200000 ],
    [ "canula", 1357603200000 ],
    [ "canula", 1357603200000 ],
    [ "canula", 1357603200000 ],
    [ "canula", 1357603200000 ],
    [ "canula", 1357603200000 ],
    [ "canula", 1357603200000 ],
    [ "canula", 1357603200000 ],
    [ "canula", 1357603200000 ],
    [ "canula", 1357603200000 ],
    [ "canula", 1357689600000 ],
    [ "canula", 1357689600000 ],
    [ "canula", 1357689600000 ],
    [ "canula", 1357689600000 ],
    [ "canula", 1357689600000 ],
    [ "canula", 1357776000000 ],
    [ "canula", 1357776000000 ],
    [ "canula", 1357776000000 ],
    [ "canula", 1357776000000 ],
    [ "canula", 1357776000000 ],
    [ "canula", 1357862400000 ],
    [ "canula", 1357862400000 ],
    [ "canula", 1357862400000 ],
    [ "canula", 1357862400000 ],
    [ "canula", 1358121600000 ],
    [ "canula", 1358121600000 ],
    [ "canula", 1358121600000 ],
    [ "canula", 1358208000000 ],
    [ "canula", 1358208000000 ],
    [ "canula", 1358208000000 ],
    [ "canula", 1358208000000 ],
    [ "canula", 1358208000000 ],
    [ "canula", 1358208000000 ],
    [ "canula", 1358208000000 ],
    [ "canula", 1358294400000 ],
    [ "canula", 1358294400000 ],
    [ "canula", 1358294400000 ],
    [ "canula", 1358294400000 ],
    [ "canula", 1358380800000 ],
    [ "canula", 1358380800000 ],
    [ "canula", 1358380800000 ],
    [ "canula", 1358380800000 ],
    [ "canula", 1358380800000 ],
    [ "canula", 1358380800000 ],
    [ "canula", 1358467200000 ],
    [ "canula", 1358467200000 ],
    [ "canula", 1358467200000 ],
    [ "canula", 1358812800000 ],
    [ "canula", 1358812800000 ],
    [ "canula", 1358812800000 ],
    [ "canula", 1358812800000 ],
    [ "canula", 1358812800000 ],
    [ "canula", 1358812800000 ],
    [ "canula", 1358812800000 ],
    [ "canula", 1358812800000 ],
    [ "canula", 1358899200000 ],
    [ "canula", 1358899200000 ],
    [ "canula", 1358899200000 ],
    [ "canula", 1358899200000 ],
    [ "canula", 1358899200000 ],
    [ "canula", 1358985600000 ],
    [ "canula", 1358985600000 ],
    [ "canula", 1358985600000 ]
];

var id = 1;

var send = function() {
  id = id + 1;
  var item = data.pop();
  //console.log(JSON.stringify(json));
  if(item) {
    var json = [{
        id: id,
        tags: [item[0]],
        comment: "happy",
        rating: 5,
        timestamp: item[1]
      }];

    console.log(json);
    var options = {
      headers: { "USERTOKEN": "THEUSER" },
      url: "http://localhost:5000/api/1/me/items",
      json: json
    };

    request.post(options, function(e, response) {
      if(e) {
        console.error(e);
      }
      else
      {
        if(response.statusCode != 200) {
          console.error('ERROR: status code: ' + response.statusCode);
        } else {
          send();
        }
      }
    });
  }
};

console.log('loading...');
send();