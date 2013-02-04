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
    tags.add('TESTUSER', 'tag1' , done);
  });
  it('calling all should return empty', function(done) {
    tags.all('TESTUSER', function(e, data) {
      assert.equal(0, data.length);
      done(e);
    });
  });
  it('calling add should add it', function(done) {
    tags.add('TESTUSER', 'tag1', function(e) {
      tags.all('TESTUSER', function(e, data) {
        assert.equal(1, data.length);
        assert.equal('tag1', data[0]);
        done(e);
      });
    });
  });
  it('calling addMany should add add all', function(done) {
    tags.addMany('TESTUSER', ['tag1','tag2'], function(e) {
      tags.all('TESTUSER', function(e, data) {
        assert.equal(2, data.length);
        assert.equal('tag1', data[0]);
        assert.equal('tag2', data[1]);
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
  it('adding to two users should allow', function(done) {
    tags.add('TESTUSER1', 'tag1', function(e) {
      tags.add('TESTUSER2', 'tag1', function(e) {
        tags.all('TESTUSER1', function(e, data) {
          assert.equal(1, data.length);
          assert.equal('tag1', data[0]);
          tags.all('TESTUSER2', function(e, data) {
            assert.equal(1, data.length);
            assert.equal('tag1', data[0]);
            done(e);
          });
        });
      });
    });
  });
});