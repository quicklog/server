process.env.QUICKLOG_DATABASE  = 'quicklog';
process.env.QUICKLOG_HOST  = 'localhost';
process.env.QUICKLOG_PORT = 27017;
process.env.QUICKLOG_USER = 'user';
process.env.QUICKLOG_PASSWORD = 'password';

var data = require('../lib/data.js');
var users = require('../lib/users.js');

var email = process.argv[2];
var password = process.argv[3];

data.open(function(e) {
    if(e) {
      console.error(e);
      process.exit(1);
    }
  users.add(email, password, function(e) {
    if(e) {
      console.error(e);
      process.exit(1);
    }

    console.log('finished');
    process.exit(0);
  });
});