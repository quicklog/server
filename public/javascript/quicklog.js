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
		
		var opts = {
		  "dataFormatX": function (x) { return d3.time.format('%Y-%m-%d').parse(x); },
		  "tickFormatX": function (x) { return d3.time.format('%A')(x); }
		};

		var myChart = new xChart('line', data, '#procedurebytag', opts);

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

		getItems(getItemsForTag());

		$('#tag').change(function() {
			getItemsForTag();
		});				
	});
};