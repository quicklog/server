var assert = require('assert'),
      helper = require('./helper.js'),
      tags = require('../lib/tags.js'),
      sinon = require('sinon');

describe('tags', function() {
  beforeEach(function(done) {
    return helper.deleteCollections(done);
  });
  afterEach(function(done) {
    return helper.closeConnection(done);
  });
  it('calling add should not throw', function(done) {
    tags.add('TESTUSER', ['tag1', 'tag2'], done);
  });
  it('calling all should return empty', function(done) {
    tags.all('TESTUSER', function(e, data) {
      assert.equal(0, data.length);
      done(e);
    });
  });
  it('calling addMany should add add all', function(done) {
    tags.addMany('TESTUSER', ['tag1','tag2'], function(e) {
      tags.all('TESTUSER', function(e, data) {
        assert.equal(2, data.length);
        done(e);
      });
    });
  });
  it('calling add should add add all', function(done) {
    tags.add('TESTUSER', 'tag1', function(e) {
      tags.all('TESTUSER', function(e, data) {
        assert.equal(1, data.length);
        done(e);
      });
    });
  });
  it('calling add twice should append', function(done) {
    tags.add('TESTUSER', 'tag1', function(e) {
      tags.add('TESTUSER', 'tag2', function(e) {
        tags.all('TESTUSER', function(e, data) {
          assert.equal(2, data.length);
          done(e);
        });
      });
    });
  });
});