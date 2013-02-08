var assert = require('assert'),
	idgen = require('../lib/idgen');

describe('idgen', function() {
	describe('getcreate', function() {
		it('should return expected', function() {
			assert.equal(idgen.create("SAMPLESTRING"), '6c981c26a55b64cc5918a80afe09f6c3');
		});
		it('should return expected for empty', function() {
			assert.equal(idgen.create(""), 'd41d8cd98f00b204e9800998ecf8427e');
		});
	});
});