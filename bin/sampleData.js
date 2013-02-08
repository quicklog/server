
var _ = require('underscore'),
      moment = require('moment'),
      request = require('request');

var numberOfDays = 30;

var email = process.argv[2] || 'demo';
var password = process.argv[3] || 'demo';
var host = process.argv[4] || 'localhost:5000';

var meUrl  = 'http://' + host + '/api/1/me';
var getTokenUrl  = meUrl + '/token';
var addItemUrl  = meUrl + '/items';

var currentDay = moment().startOf('day').subtract('days', numberOfDays).add('hours', 8);
var procedures = ["Blood Test", "Cannula", "Catheter", "Blood Cultures", "Chest Drain"];
var comments = ["", "difficult patient", "awkward parents", "rushed", "happy", "no comment", ""];

var data = [];
var id = 0;
while(currentDay < moment()) {
    ++id;
    var procedure = procedures[_.random(0, procedures.length - 1)];
    var comment = comments[_.random(0, comments.length - 1)];
    if(_.random(0, 10) < 5) {
        comment = '';
    }
    var json = {
        id: id,
        tags: [procedure],
        comment: comment,
        rating: _.random(1, 5),
        attempts: _.random(1, 3),
        timestamp: currentDay.valueOf()
    };

    data.push(json);

     if (Math.random() > 0.5) {
        currentDay = currentDay.add('minutes', 20);
     }

     currentDay = currentDay.add('minutes', Math.random() * 13);

    if(currentDay.hours() > 19) {
        currentDay = currentDay.add('hours', 13);
    }
}

var send = function(token) {
  var options = {
    headers: { 'USERTOKEN': token },
    url: addItemUrl,
    json: data
  };

  request.post(options, function(e, response) {
    if(e) {
      console.error(e);
      return process.exit(1);
    }
    else
    {
      if(response.statusCode != 200) {
        console.error('ERROR: status code: ' + response.statusCode);
        return process.exit(1);
      }

      return process.exit(0);
    }
  });
};

console.log('getting token');

var options = {
      headers: { email: email, password: password },
      url: getTokenUrl
};

request.get(options, function(e, response) {
  if(e) {
    console.error(e);
    process.exit(1);
  }
  if(response.statusCode != 200) {
    console.error('ERROR: status code: ' + response.statusCode);
  } else {
    console.log('obtained token: ' + response.body);
    send(response.body);
  }
});
