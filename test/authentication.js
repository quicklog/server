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

	describe('when registering and user add fails for reason other than user exists', function() {
		var res, req;

		beforeEach(function() {
			sinon.stub(users, 'add').yields('ERROR');
			sinon.stub(console, 'log');

			req = { body : { username : 'USER', password : 'PASSWORD' } };
			req.flash = sinon.stub();
			res = { redirect : function() {} };
			sinon.stub(res, 'redirect');
			auth.doregister(req, res);
		});

		afterEach(function() {
			users.add.restore();
			console.log.restore();
		});

		it('should redirect to root page', function() {
			assert(res.redirect.calledOnce);
			assert(res.redirect.calledWithExactly('/register'));
		});

		it('should show user friendly error message', function() {
			assert(res.redirect.calledOnce);
			assert(res.redirect.calledWithExactly('/register'));

			assert(req.flash.calledOnce);
			assert.equal(req.flash.args[0][0], 'register');
			assert.equal(req.flash.args[0][1], 'Registration failed with an unexpected error');
		});
	});

	describe('when registering and user already exists', function() {
		beforeEach(function() {
			sinon.stub(users, 'add').yields({ err: 'E11000 duplicate key error index and some other stuff'});
			sinon.stub(console, 'log');
		});

		afterEach(function() {
			users.add.restore();
			console.log.restore();
		});

		it('should raise message that tells the user', function() {
			var req = { body : { username : 'USER', password : 'PASSWORD' } };
			req.flash = sinon.stub();
			var res = { redirect : function() {} };
			sinon.stub(res, 'redirect');
			auth.doregister(req, res);
			assert(req.flash.calledOnce);
			assert.equal(req.flash.args[0][0], 'register');
			assert.equal(req.flash.args[0][1], 'Registration failed : email already exists');
		});
	});
});