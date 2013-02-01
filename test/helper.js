var  async = require('async'),
      data = require('../lib/data.js');

var helper = {};

helper.deleteCollections = function(done) {
    process.env.QUICKLOG_HOST='localhost';
    process.env.QUICKLOG_DATABASE='quicklog-test';

    async.series([
      function(cb) {
        data.open(cb);
      },
      function(cb) {
        data.client.dropCollection(data.collections.users, function() { cb(); });
      },
      function(cb) {
        data.client.dropCollection(data.collections.itemDay, function() { cb(); });
      },
      function(cb) {
         data.client.dropCollection(data.collections.countsAll, function() { cb(); });
      },
       function(cb) {
         data.client.dropCollection(data.collections.countsTags, function() { cb(); });
      },
      function(cb) {
        data.open(cb);
      }
    ], done);
};

helper.closeConnection = function(done) {
  data.close();
  done();
};

module.exports = helper;