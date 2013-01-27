var timechart;
var timechart2;

var createTimeChart2 = function(tag, data) {
	
	var seriesOptions = [];
	seriesOptions[0]  = {
			name : tag.counts,
			data : data,
			tooltip: {
				valueDecimals: 0
			}
		};

	// TEST DATA
	// var faildata = [
	// 		[1357084800000,2],
	// 		[1357171200000,1],
	// 		[1357257600000,2],
	// 		[1357516800000,0],
	// 		[1357603200000,1],
	// 		[1357689600000,0],
	// 		[1357776000000,2],
	// 		[1357862400000,0],
	// 		[1358121600000,0],
	// 		[1358208000000,1],
	// 		[1358294400000,0],
	// 		[1358380800000,1],
	// 		[1358467200000,1],
	// 		[1358812800000,1],
	// 		[1358899200000,0],
	// 		[1358985600000,1]
	// 	];

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

	$.getJSON('/api/1/me/analyse/items/' + tag, function(responseData) {
		createTimeChart2(tag, responseData);
	});

};

var getItems = function(done) {

	$.getJSON('/api/1/me/analyse/items', function(items) {
		$.each(items, function(i, item) {
			var tag = item.x;
			$('#tag').append('<option value="' + tag + '">' + tag + ' (' + item.y + ')</option>');
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