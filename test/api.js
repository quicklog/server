var assert = require('assert'),
      api = require('../routes/api.js'),
      sinon = require('sinon');

describe('addItem', function() {
  it('should not throw', function() {
    var req = {};
    var res = {};
    res.send = sinon.stub();
    api.addItem(req, res);
  });
});