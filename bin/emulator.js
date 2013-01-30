var request = require('request');

var host = "http://localhost:5000";
var api = host + "/api/1/me";
var user = "jsmith";

var addItems = function(items, done) {
    console.log('adding ' + JSON.stringify(items));
    var options = {
      headers: { 'USERTOKEN': user },
      url: api + '/items',
      json: items
    };

    request.post(options, done);
};

var items = [{
    "id": new Date().getTime(),
    "tags": ["my item"],
    "comment": "my new comment",
    "rating": 3,
    "timestamp": new Date().getTime()
 }];

addItems(items, function(e, response) {
    if(e) {
        console.error(e);
    }

    console.log(response);
});