
var _ = require('underscore'),
      moment = require('moment'),
      request = require('request');

var numberOfDays = 30;

var host = process.argv[2] || 'localhost:5000';
var addItemUrl  = 'http://' + host + '/api/1/me/items';

var currentDay = moment().sod().subtract('days', numberOfDays).add('hours', 8);
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
    var json = [{
        id: id,
        tags: [procedure],
        comment: comment,
        rating: _.random(1, 5),
        timestamp: currentDay.valueOf()
    }];

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
  var item = data.pop();
  if(item) {
    var options = {
      headers: { 'USERTOKEN': token },
      url: addItemUrl,
      json: item
    };

    console.log('adding: ' + item[0].id + ' to ' + host);

    request.post(options, function(e, response) {
      if(e) {
        console.error(e);
      }
      else
      {
        if(response.statusCode != 200) {
          console.error('ERROR: status code: ' + response.statusCode);
        } else {
          send(token);
        }
      }
    });
  }
};

console.log('loading...');

send('ABCDS');