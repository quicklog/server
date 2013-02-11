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
		return collection.find({
			tagid: tag._id
		}).toArray(cb);
	}, function(aggregations, cb) {
		return cb(null, _.sortBy(aggregations, function(a) {
			return a.day;
		}));
	}, function(aggregations, cb) {
		ret.counts = _.map(aggregations, function(a) {
			return [a.day, a.sumProcedures];
		});
		ret.failures = _.map(aggregations, function(a) {
			return [a.day, a.sumFailures];
		});
		return cb(null, ret);
	}], done);
};

analytics.getItems = function(user, tag, day, done) {
	async.waterfall([

	function(cb) {
		return tags.get(user, tag, cb);
	}, function(tag, cb) {
		if(!tag) {
			return cb(null, []);
		}
		return cb(null, tag);
	}, function(tag, cb) {
		return data.getCollection(data.collections.items, function(e, collection) {
			return cb(e, collection, tag);
		});
	}, function(collection, tag, cb) {
		return collection.find({
			tagid: tag._id,
			day: parseInt(day, 10)
		}).toArray(cb);
	}, function(data, cb) {
		return done(null, _.map(data, function(d) {
			var ret = d;
			delete ret.tagid;
			delete ret.day;
			return ret;
		}));
	}], done);
};

module.exports = analytics;