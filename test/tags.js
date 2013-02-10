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
    tags.add('TESTUSER', 'tag1', done);
  });
  it('calling add should return new document', function(done) {
    tags.add('TESTUSER', 'tag1', function(e, doc) {
      assert.notEqual('', doc._id);
      assert.equal('TESTUSER', doc.userid);
      assert.equal('tag1', doc.name);
      done(null);
    });
  });
  it('calling all should return empty', function(done) {
    tags.all('TESTUSER', function(e, data) {
      assert.equal(0, data.length);
      done(e);
    });
  });
  it('calling get should not throw', function(done) {
    tags.get('TESTUSER', 'tag', done);
  });
  it('calling get with missing tag should return null', function(done) {
    tags.get('TESTUSER', 'tag', function(e, data) {
      assert.equal(null, data);
      done(e);
    });
  });
  it('calling get with valid tag return it', function(done) {
    tags.add('TESTUSER', 'tag1', function(e) {
      tags.get('TESTUSER', 'tag1', function(e, data) {
        assert.deepEqual({_id:'17e3a32961bd2482c193988562894120',name:'tag1',userid:'TESTUSER'}, data);
        done(e);
      });
    });
  });
  it('calling add should add', function(done) {
    tags.add('TESTUSER', 'tag1', function(e) {
      tags.all('TESTUSER', function(e, data) {
        assert.equal(1, data.length);
        assert.equal('tag1', data[0]);
        done(e);
      });
    });
  });
  it('calling addMany should add add all', function(done) {
    tags.addMany('TESTUSER', ['tag1', 'tag2'], function(e) {
      tags.all('TESTUSER', function(e, data) {
        assert.equal(2, data.length);
        assert.equal('tag1', data[0]);
        assert.equal('tag2', data[1]);
        done(e);
      });
    });
  });
  it('calling add twice with different tag should append', function(done) {
    tags.add('TESTUSER', 'tag1', function(e) {
      tags.add('TESTUSER', 'tag2', function(e) {
        tags.all('TESTUSER', function(e, data) {
          assert.equal(2, data.length);
          done(e);
        });
      });
    });
  });
  it('calling add twice with same tag should not append', function(done) {
    tags.add('TESTUSER', 'tag1', function(e, d) {
      var id = d._id;
      tags.add('TESTUSER', 'tag1', function(e, d) {
        assert.deepEqual(id, d._id);
        tags.all('TESTUSER', function(e, d) {
          assert.equal(1, d.length);
          assert.equal("tag1", d[0]);
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
  it('calling all should return sorted list', function(done) {
    tags.addMany('TESTUSER', ['a', 'c', 'b', 'd'], function(e) {
      tags.all('TESTUSER', function(e, data) {
        assert.equal(4, data.length);
        assert.equal('a', data[0]);
        assert.equal('b', data[1]);
        assert.equal('c', data[2]);
        assert.equal('d', data[3]);
        done(e);
      });
    });
  });

});