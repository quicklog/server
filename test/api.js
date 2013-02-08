var assert = require('assert'),
	api = require('../routes/api.js'),
	sinon = require('sinon'),
	users = require('../lib/users.js');

describe('getToken', function() {
	var req = {};
	var res = {};
	beforeEach(function() {
		sinon.stub(users, 'byEmailAndPassword');
		req = {
			header: sinon.stub()
		};
		res = {
			send: sinon.stub()
		};
	});
	afterEach(function() {
		users.byEmailAndPassword.restore();
	});

	it('should 404 if missing email', function() {
		req.header.withArgs('password').returns('1234');
		api.getToken(req, res);
		assert(res.send.calledWith(404));
	});
	it('should 404 if missing password', function() {
		req.header.withArgs('email').returns('a@a.a');
		api.getToken(req, res);
		assert(res.send.calledWith(404));
	});
	it('should 404 if authentication errors', function() {
		req.header.withArgs('email').returns('a@a.a');
		req.header.withArgs('password').returns('1234');
		users.byEmailAndPassword.withArgs('a@a.a', '1234').yields('ERROR');
		api.getToken(req, res);
		assert(res.send.calledWith(404));
	});
	it('should 404 if authentication fails', function() {
		req.header.withArgs('email').returns('a@a.a');
		req.header.withArgs('password').returns('1234');
		users.byEmailAndPassword.withArgs('a@a.a', '1234').yields(null, false);
		api.getToken(req, res);
		assert(res.send.calledWith(404));
	});
	it('should return token if valid credentials', function() {
		req.header.withArgs('email').returns('a@a.a');
		req.header.withArgs('password').returns('1234');
		var user = { token: 'TOKEN' };
		users.byEmailAndPassword.withArgs('a@a.a', '1234').yields(null, user);
		api.getToken(req, res);
		assert(res.send.calledWith('TOKEN'));
	});
});