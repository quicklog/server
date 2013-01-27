var timechart;
var timechart2;

var getItemForTagForDay = function(tag, day) {
	$.getJSON('/api/1/me/items/' + tag + '/' + day + '/', function(items) {
		$('#commentsDate').empty();
		$('#comments').empty();

		if(items.length > 0) {
			var date = moment(parseInt(items[0].timestamp)).format('Do MMMM YYYY');
			$('#commentsDate').text(date);
		}

		$.each(items, function(i, item) {
			var time = moment(parseInt(item.timestamp)).format('HH:mm:ss');
			var comment = item.comment;
			$('#comments').append('<tr><td>' + time + '</td><td>' + comment + '</td><td></td></tr>');
		});
	});
};

var createTimeChart2 = function(tag, data) {

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
	                    console.log(event.point);
	                    var time = event.point.x;
	                    getItemForTagForDay(tag, time);
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

var createTimeChart = function() {
	var data = {
		  "xScale": "time",
		  "yScale": "linear",
		  "type": "line",
		  "main": [
		    {
		      "data": null
		    }
		  ]
		};

	var opts = {
	  "dataFormatX": function (x) { return d3.time.format('%Y-%m-%d').parse(x); },
	  "tickFormatX": function (x) { return d3.time.format('%A')(x); }
	};

	timechart = new xChart('line', data, '#procedurebytag', opts);
};

var getItemsForTag = function() {

	var tag = $("#tag").val();
	$('#procedure').text(tag);
	//$('#average').text('4');

	// Set comments for today
	getItemForTagForDay(tag, new Date().getTime());

	$.getJSON('/api/1/me/analyse/items/' + tag, function(items) {
		console.log(items);
		
		var total;
		total = _.reduce(items.counts, function(memo, num) {
			return memo + num[1];
		}, 0);

		$('#total').text(total);

		createTimeChart2(tag, items);
	});

};

var getItems = function(done) {

	$.getJSON('/api/1/me/analyse/items', function(items) {
		$.each(items, function(i, item) {
			var tag = item.x;
			$('#tag').append('<option value="' + tag + '">' + tag + '</option>');
		});

		done();
	});

};

var documentReady = function() {
	$(document).ready(function() {

		getItems(getItemsForTag);

		$('#tag').change(function() {
			getItemsForTag();
		});
	});
};