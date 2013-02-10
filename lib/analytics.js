var _ = require('underscore'),
	async = require('async'),
	data = require('./data'),
	moment = require('moment');

var analytics = {};

analytics.getAllCounts = function(user, done) {
	data.getCollection(data.collections.countsAll, function(e, counts) {
		if(e) {
			return done(e);
		}

		counts.findOne({
			_id: user
		}, function(e, count) {
			if(e) {
				return done(e);
			}

			return done(null, analytics.flip(count));
		});
	});
};

analytics.getTagCounts = function(user, tag, done) {
	data.getCollection(data.collections.countsTags, function(e, counts) {
		if(e) {
			return done(e);
		}

		var id = user + '_' + tag;
		counts.findOne({
			_id: id
		}, function(e, count) {
			if(e) {
				return done(e);
			}

			var flipped = analytics.flip2(count);

			// Hardcode failures to be 25% with a 50% chance of happening
			var failures = _.map(flipped, function(point) {
				var failureCount = 0;
				if(Math.random() > 0.5) {
					failureCount = Math.abs(point[1] * 0.25);
				}

				return [point[0], failureCount];
			});

			var ret = {
				counts: flipped,
				failures: failures
			};

			return done(null, ret);
		});
	});
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