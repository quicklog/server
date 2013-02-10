var assert = require('assert'),
      data = require('../lib/data.js'),
      sinon = require('sinon');

describe('calling open', function() {
  beforeEach(function() {
    process.env.QUICKLOG_HOST='localhost';
    process.env.QUICKLOG_DATABASE='quicklog-test';
  });
  afterEach(function() {
    data.close();
  });
  it('should connect', function(done) {
    setTimeout(done, 1000);
    data.open(function(e) {
      assert.notEqual(null, data.client);
      assert.notEqual(undefined, data.client);
      done(e);
    });
  });
});
