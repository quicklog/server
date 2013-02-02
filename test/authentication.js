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

		it('should call next', function(done) {
			var res = {};
			var req = { 
				isAuthenticated : function() { return false; },
				header: function(name) { return 'TOKEN'; }
			};

			auth.ensure(req, res, done);
		});
	});

	describe('when request not authenticated and has no token', function() {
		it('should redirect', function(done) {
			var res = { redirect : function(path) { done() }};
			var req = { 
				isAuthenticated : function() { return false; },
				header: function(name) { return null; }
			};

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
			var req = { 
				isAuthenticated : function() { return false; },
				header: function(name) { return 'TOKEN'; }
			};

			auth.ensure(req, res, function() {
				assert(false, 'should not call next');
			});
		});
	});
});