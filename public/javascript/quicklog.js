var timechart2;

var clearComments = function() {
	$('#commentsDate').empty();
	$('#comments').empty();
};

var setCommentsDate = function(items) {
	if(items.length > 0) {
		var date = moment(parseInt(items[0].timestamp)).format('Do MMMM YYYY');
		$('#commentsDate').text(date);
	}
};

var appendComment = function(time, rating, comment) {
	$('#comments').append('<tr><td>' + time + '</td><td>' + rating + '</td><td>' + comment + '</td></tr>');
};

var getRating = function(item) {
	var rating = '';
	var starCount = item.rating;

	while(starCount > 0) {
		rating = rating + '<i class="icon-star"/></i> ';
		--starCount;
	}

	return rating;
};

var setComments = function(tag, day) {
	$.getJSON('/api/1/me/items/' + tag + '/' + day + '/', function(items) {
		clearComments();
		setCommentsDate(items);

		items.forEach(function(item, i) {
			var time = moment(parseInt(item.timestamp)).format('HH:mm:ss');
			var comment = item.comment;
			var rating = getRating(item);
			appendComment(time, rating, comment);
		});
	});
};

var createTimeChart = function(tag, data) {

	var seriesOptions = [];
	seriesOptions[0]  = {
			name : tag,
			data : data.counts,
			tooltip: {
				valueDecimals: 0
			}
		};

	seriesOptions[1]  = {
			name : tag + ' failures',
			data : data.failures,
			tooltip: {
				valueDecimals: 0
			}
		};

	timechart2 = new Highcharts.StockChart({
		chart : {
			renderTo : 'container'
		},

		plotOptions: {
	        series: {
	            cursor: 'pointer',
	            events: {
	                click: function(event) {
	                    var time = event.point.x;
	                    setComments(tag, time);
	                }
	            }
	        }
	    },

		rangeSelector : {
			selected : 1
		},

		title : {
			text : ''
		},

		series : seriesOptions
	});
};

var setTitle = function(name) {
	$('#procedure').text(name);
};

var setTotal = function(items) {
	var total = _.reduce(
		items.counts,
		function(memo, num) {
			return memo + num[1];
		},
		0);

	$('#total').text(total);
};

var getItemsForTag = function() {
	var tag = $("#tag").val();
	setTitle(tag);
	setComments(tag, new Date().getTime());

	$.getJSON('/api/1/me/analyse/items/' + tag, function(items) {
		setTotal(items);
		createTimeChart(tag, items);
	});

};

var appendTag = function(tag) {
	$('#tag').append('<option value="' + tag + '">' + tag + '</option>');
};

var getTags = function(done) {
	$.getJSON('/api/1/me/tags', function(items) {
		items.forEach(function(item, i) {
			appendTag(item);
		});

		done();
	});
};

var documentReady = function() {
	$(document).ready(function() {

		getTags(getItemsForTag);

		$('#tag').change(function() {
			getItemsForTag();
		});
	});
};