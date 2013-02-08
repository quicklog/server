var crypto = require('crypto');

var id = {};

id.create = function(string) {
	return crypto.createHash('md5').update(string).digest("hex");
};

module.exports = id;