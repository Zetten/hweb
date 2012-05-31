Highcharts
		.setOptions({
			chart : {
				style : {
					fontFamily : "'Inconsolata', 'Droid Sans Mono', 'Consolas', sans-serif"
				}
			}
		});

var tmChart;

$(document).ready(function() {
	tmChart = new Highcharts.Chart({
		chart : {
			renderTo : 'tmChart',
			animation : false,
			events : {
				load : serverData
			}
		},
		credits : { enabled : false },
		title : {
			text : 'Thunderbird rocket telemetry',
			style : {
				fontFamily : "'Signika', 'Lucida Sans Unicode', serif",
				fontWeight : 'bold'
			}
		},
		xAxis : {
			type : 'datetime'
		},
		yAxis : [ { // Primary TM parameter
			title : { text : 'Azimuth' },
//			min : 0,
//			max : 10
		}, { // Secondary TM parameter
			title : { text : 'Elevation' },
//			min : 0,
//			max : 1000,
			opposite : true
		}, ],
		series : [ {
			name : 'Azimuth',
			yAxis : 0,
			type : 'spline',
			data : []
		}, {
			name : 'Elevation',
			yAxis : 1,
			type : 'spline',
			data : []
		} ]
	});
});

/**
 * Retrieve new data points from the Nest every second.
 */
function serverData() {
	if (tmChart) {
		$.ajax({
			url : '/nest/get/Azimuth/last/1',
			dataType : 'json',
			async : true,
			success : function(data) {
				param1 = data['Azimuth'][0];
				p1time = new Date(param1['receivedTime']);
				p1value = param1['value'];
				tmChart.series[0].addPoint({x : p1time, y : p1value}, true, tmChart.series[0].data.length > 30);
			}
		});
		$.ajax({
			url : '/nest/get/Elevation/last/1',
			dataType : 'json',
			async : true,
			success : function(data) {
				param2 = data['Elevation'][0];
				p2time = new Date(param2['receivedTime']);
				p2value = param2['value'];
				tmChart.series[1].addPoint({x : p2time, y : p2value}, true, tmChart.series[0].data.length > 30);
			}
		});
	}
	
	setTimeout(serverData, 1000);
}
