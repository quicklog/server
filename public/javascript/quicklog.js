var timechart;

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

	$.getJSON('/api/1/me/analyse/items/' + tag, function(responseData) {

		var data = {
		  "xScale": "time",
		  "yScale": "linear",
		  "type": "line",
		  "main": [
		    {
		      "data": responseData
		    }
		  ]
		};

		timechart.setData(data);
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

		createTimeChart();
		getItems(getItemsForTag);

		$('#tag').change(function() {
			getItemsForTag();
		});				
	});
};