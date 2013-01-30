var assert = require('assert'),
      api = require('../routes/api.js'),
      sinon = require('sinon');

describe('register', function() {
  it('should not throw', function() {
    var req = {};
    var res = {};
    res.send = sinon.stub();
    api.register(req, res);
  });
});