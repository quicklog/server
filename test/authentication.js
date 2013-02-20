var auth = require('../lib/authentication.js'),
	users = require('../lib/users.js'),
	assert = require('assert'),
	sinon = require('sinon');

describe('authentication', function() {
	describe('when request is authenticated', function() {
		it('should call next', function(done) {
			var res = {};
			var req = { isAuthenticated : function() { return true; }};
			auth.ensure(req, res, done);
		});
	});

	describe('when request not authenticated but has valid token', function() {
		beforeEach(function() {
			sinon.stub(users,'byToken').yields(null, 'USER');
		});

		afterEach(function() {
			users.byToken.restore();
		});

		it('should set user and call next', function(done) {
			var res = {};
			var req = sinon.stub();
			req.header = function(){};
			sinon.stub(req, 'header').withArgs('usertoken').returns('TOKEN');
			req.isAuthenticated = function(){ return false;};

			auth.ensure(req, res, function() {
				assert.equal(req.user, 'USER');
				done();
			});
		});
	});

	describe('when request not authenticated and has no token', function() {
		it('should redirect', function(done) {
			var res = { redirect : function(path) { done() }};
			var req = sinon.stub();
			req.header = function(){};
			sinon.stub(req, 'header').withArgs('usertoken').returns(null);
			req.isAuthenticated = function(){ return false;};

			auth.ensure(req, res, function() {
				assert(false, 'should not call next');
			});
		});
	});

	describe('when request not authenticated but has invalid token', function() {
		beforeEach(function() {
			sinon.stub(users,'byToken').yields(null, null);
		});

		afterEach(function() {
			users.byToken.restore();
		});

		it('should call redirect', function(done) {
			var res = { redirect : function(path) { done() }};

			var req = sinon.stub();
			req.header = function(){};
			sinon.stub(req, 'header').withArgs('usertoken').returns('TOKEN');
			req.isAuthenticated = function(){ return false;};

			auth.ensure(req, res, function() {
				assert(false, 'should not call next');
			});
		});
	});

	describe('when registering and user add succeeds', function() {
		beforeEach(function() {
			sinon.stub(users, 'add').yields(null);
		});

		afterEach(function() {
			users.add.restore();
		});

		it('should redirect to root page', function() {
			var req = { body : { username : 'USER', password : 'PASSWORD' } };
			var res = { redirect : function() {} };
			sinon.stub(res, 'redirect');
			auth.doregister(req, res);
			assert(res.redirect.calledOnce);
			assert(res.redirect.calledWithExactly('/'));
		});
	});

	describe('when registering and user add fails', function() {
		beforeEach(function() {
			sinon.stub(users, 'add').yields('ERROR');
		});

		afterEach(function() {
			users.add.restore();
		});

		it('should redirect to root page', function() {
			var req = { body : { username : 'USER', password : 'PASSWORD' } };
			var res = { redirect : function() {} };
			sinon.stub(res, 'redirect');
			auth.doregister(req, res);
			assert(res.redirect.calledOnce);
			assert(res.redirect.calledWithExactly('/register'));
		});
	});
});