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
		credits : {
			enabled : false
		},
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
			title : {
				text : 'TM1234 value'
			},
			min : 0,
			max : 1
		}, { // Secondary TM parameter
			title : {
				text : 'TM5678 value'
			},
			min : 0,
			max : 1000,
			opposite : true
		}, ],
		series : [ {
			name : 'TM1234',
			yAxis : 0,
			type : 'spline',
			data : []
		}, {
			name : 'TM5678',
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
	$.ajax({
		url : '/nest/get/TM1234,TM5678',
		success : function(data) {
			tm1234 = data['TM1234'];
			tm5678 = data['TM5678'];
			
			// add the points
			tmChart.series[0].addPoint([ Date.parse(tm1234['time']), tm1234['data'] ], true, tmChart.series[0].data.length > 20);
			tmChart.series[1].addPoint([ Date.parse(tm5678['time']), tm5678['data'] * 1000 ], true, tmChart.series[1].data.length > 20);

			// call it again after one second
			setTimeout(serverData, 1000);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert("AJAX request failed with status: " + textStatus);
		},
		cache : false
	});
}
