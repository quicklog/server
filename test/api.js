var assert = require('assert'),
      api = require('../routes/api.js'),
      sinon = require('sinon');

describe('addItems', function() {
  it('should not throw', function() {
    var req = {};
    var res = {};
    res.send = sinon.stub();
    api.addItems(req, res);
  });
});

describe('getItems', function() {
  it('should not throw', function() {
    var req = {};
    var res = {};
    res.send = sinon.stub();
    api.getItems(req, res);
  });
});

describe('register', function() {
  it('should not throw', function() {
    var req = {};
    var res = {};
    res.send = sinon.stub();
    api.register(req, res);
  });
});