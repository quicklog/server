var assert = require('assert'),
    authentication = require('../lib/authentication.js'),
    sinon = require('sinon');

describe('strategy', function() {
  describe('when findByUsername errors', function() {
	beforeEach(function() {
	  sinon.stub(authentication, 'findByUsername').yields('ERROR');
	});

	afterEach(function() {
	  authentication.findByUsername.restore();
	});

	it('should return error', function(done) {
      authentication.strategy('NOTAUSER', 'NOTAPASSWORD', function(err) {
    	assert.equal('ERROR', err);
    	done();
	  });
	});
  });

  describe('when username does not exist', function() {
	beforeEach(function() {
	  sinon.stub(authentication, 'findByUsername').yields(null, null);
	});

	afterEach(function() {
	  authentication.findByUsername.restore();
	});

	it('should return error', function(done) {
      authentication.strategy('NOTAUSER', 'NOTAPASSWORD', function(err, exists, message) {
    	assert.equal(null, err);
    	assert.equal(false, exists);
    	assert.equal('Unknown user NOTAUSER', message.message);
    	done();
	  });
	});
  });

  describe('when password incorrect', function() {
	beforeEach(function() {
	  sinon.stub(authentication, 'findByUsername').yields(null, { password : "ANOTHERPASSWORD" });
	});

	afterEach(function() {
	  authentication.findByUsername.restore();
	});

	it('should return error', function(done) {
      authentication.strategy('USER', 'PASSWORD', function(err, exists, message) {
    	assert.equal(null, err);
    	assert.equal(false, exists);
    	assert.equal('Invalid password', message.message);
    	done();
	  });
	});
  });
  
  describe('when user exists and password correct', function() {
	beforeEach(function() {
	  sinon.stub(authentication, 'findByUsername').yields(null, { "id" : 42, "password" : "PASSWORD" });
	});

	afterEach(function() {
	  authentication.findByUsername.restore();
	});

    it('should return user', function(done) {
      authentication.strategy('USER', 'PASSWORD', function(err, user) {
    	assert.equal(null, err);
    	assert.equal(42, user.id);
    	done();
      });
    });
  });
});
