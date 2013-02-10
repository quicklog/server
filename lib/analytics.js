var _ = require('underscore'),
	async = require('async'),
	data = require('./data'),
	items = require('./items'),
	tags = require('./tags'),
	moment = require('moment');

var analytics = {};

analytics.getTagCounts = function(user, tag, done) {
	var ret = {
		name: tag,
		counts: [],
		failures: []
	};

	async.waterfall([

	function(cb) {
		return tags.get(user, tag, cb);
	}, function(tag, cb) {
		if(!tag) {
			return cb(null, ret);
		}
		return cb(null, tag);
	}, function(tag, cb) {
		return data.getCollection(data.collections.aggregate_by_day, function(e, collection) {
			return cb(e, collection, tag);
		});
	}, function(collection, tag, cb) {
		return collection.find({ tagid: tag._id }).toArray(cb);
	},
	function(aggregations, cb) {
		return cb(null, _.sortBy(aggregations, function(a) { return a.day; }));
	},
	function(aggregations, cb) {
		ret.counts = _.map(aggregations, function(a) { return [ a.day, a.sumProcedures ]; });
		ret.failures = _.map(aggregations, function(a) { return [ a.day, a.sumFailures ]; });
		return cb(null, ret);
	}], done);
};

analytics.getItems = function(user, tag, day, done) {
	data.getCollection(data.collections.itemDay, function(e, itemDays) {
		if(e) {
			console.error(e);
			return done(e);
		}

		var id = user + '_' + moment(parseInt(day, 0)).startOf('day').valueOf();
		itemDays.findOne({
			_id: id
		}, function(e, itemDay) {
			if(e) {
				console.error(e);
				return done(e);
			}
			var items = _.values(itemDay);
			var withoutId = _.reject(items, function(item) {
				return item == itemDay._id;
			});
			return done(null, withoutId);
		});
	});
};

analytics.flip = function(data) {
	var pairs = _.pairs(data);
	var withoutId = _.reject(pairs, function(pair) {
		return pair[0] == '_id';
	});
	var flipped = _.map(withoutId, function(pair) {
		return {
			x: pair[0],
			y: pair[1]
		};
	});
	return flipped;
};

analytics.flip2 = function(data) {
	var pairs = _.pairs(data);
	var withoutId = _.reject(pairs, function(pair) {
		return pair[0] == '_id';
	});
	var flipped = _.map(withoutId, function(pair) {
		return [parseInt(pair[0], 0), pair[1]];
	});
	return flipped;
};

module.exports = analytics;