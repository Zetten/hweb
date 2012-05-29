Highcharts.setOptions({
	chart : {
		style : {
			fontFamily : "'Inconsolata', 'Droid Sans Mono', 'Consolas', sans-serif"
		}
	}
});

$(document).ready(function() {
	tmChart = new Highcharts.Chart({
		chart : {
			renderTo : 'tmChart',
			animation : false,
			events : { load : randomData }
		},
		credits : { enabled : false },
		title : {
			text : 'Thunderbird rocket telemetry',
			style : {
				fontFamily : "'Signika', 'Lucida Sans Unicode', serif",
				fontWeight : 'bold'
			}
		},
		xAxis : { type : 'datetime' },
		yAxis : [ { // Primary TM parameter
			title : { text : 'TM1234 value' },
			min : 0,
			max : 1
		}, { // Secondary TM parameter
			title : { text : 'TM5678 value' },
			min : 0,
			max : 1000,
			opposite : true
		}, ],
		series : [ {
			name : 'TM1234',
			yAxis : 0,
			type : 'spline',
			data : (function() {
				// generate an array of random data
				var data = [], time = (new Date()).getTime(), i;

				for (i = -19; i <= 0; i++) {
					data.push({
						x : time + i * 1000,
						y : Math.random()
					});
				}
				return data;
			})()
		}, {
			name : 'TM5678',
			yAxis : 1,
			type : 'spline',
			data : (function() {
				// generate an array of random data
				var data = [], time = (new Date()).getTime(), i;

				for (i = -19; i <= 0; i++) {
					data.push({
						x : time + i * 1000,
						y : Math.random() * 1000
					});
				}
				return data;
			})()
		} ]
	});
});

/**
 * Plot a random point for each TM type each second.
 */
function randomData() {
	var tm1234 = this.series[0];
	var tm5678 = this.series[1];

	setInterval(function() {
		x = (new Date()).getTime();
		y1 = Math.random();
		y2 = Math.random() * 1000;
		tm1234.addPoint([ x, y1 ], true, true);
		tm5678.addPoint([ x, y2 ], true, true);
	}, 1000);
}

/**
 * Retrieve new data points from the Nest every second.
 */
function serverData() {
	var tm1234 = this.series[0];
	var tm5678 = this.series[1];

	$.ajax({
		url : 'nest-url',
		success : function(data) {
			x = (new Date()).getTime();

			// add the points

			// call it again after one second
			setTimeout(serverData, 1000);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert("AJAX request failed with status: " + textStatus);
		},
		cache : false
	});
}
