var timechart;
var timechart2;

var createTimeChart2 = function(tag, data) {

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

		series : [{
			name : tag,
			data : data,
			tooltip: {
				valueDecimals: 0
			}
		}]
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