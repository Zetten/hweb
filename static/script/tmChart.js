Highcharts
		.setOptions({
			chart : {
				style : {
					fontFamily : "'Inconsolata', 'Droid Sans Mono', 'Consolas', sans-serif"
				}
			}
		});

var tmChart;
var tmParams = ['Azimuth', 'Elevation'];

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
			title : { text : tmParams[0] },
		}, { // Secondary TM parameter
			title : { text : tmParams[1] },
			opposite : true
		}, ],
		series : [ {
			name : tmParams[0],
			yAxis : 0,
			type : 'spline',
			data : []
		}, {
			name : tmParams[1],
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
		tmParams.forEach(getAjaxParamData);
	}
	
	setTimeout(serverData, 1000);
}

function getAjaxParamData(element, idx, array) {
	$.ajax({
		url : '/nest/get/'+element+'/last/1',
		dataType : 'json',
		async : true,
		success : function(data) {
			param = data[element][0];
			time = new Date(param['receivedTime']);
			value = param['value'];
			tmChart.series[idx].addPoint({x : time, y : value}, true, tmChart.series[idx].data.length > 30);
		}
	});
}



