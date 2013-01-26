var assert = require('assert'),
      data = require('../lib/data.js'),
      sinon = require('sinon');

describe('open', function() {
  it('should connect', function(done) {
    setTimeout(done, 300);
    data.getCollection('items', function(e, collection) {
      done(e);
    });
  });
});
