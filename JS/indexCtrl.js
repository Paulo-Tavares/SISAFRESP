var app = angular.module('index', []);
app.controller('indexCtrl', function($scope, $http) {

	$scope.logoNome = "Sisafresp";
	
	//GRAPH
	var chart = new AmCharts.AmStockChart();
	var dadosBD = [];
	var sensor1 = [];
	var sensor2 = [];

	console.log(chart.dataProvider);

	$http.get("http://localhost/SISAFRESP/PHP/server.php")
		.then(
			//SUCCESS
			function(data) {
				dadosBD = data.data;
				carregadados();
				createStockChart();
				chart.write('chartdiv');
				
			},
			//FAIL
			function(error) {
				console.log("Não foi possível carregar o BD: "+error);
			}
		);	
	
	function carregadados() {

		//console.log(dadosBD);
		for (i = 0; i<dadosBD.length; i++) {
			
			if(dadosBD[i].sensorAddress == "Node1"){
				sensor1.push({
					date: dadosBD[i].datatemp,
					qtdResp: dadosBD[i].qntdRespiracoes,
				});
			}

			if(dadosBD[i].sensorAddress == "Node2"){
				sensor2.push({
					date: dadosBD[i].datatemp,
					qtdResp: dadosBD[i].qntdRespiracoes,
				});
			}
		}
		//console.log(sensor1);
	}
	/*
	// MOVING AVERAGE PLUGIN FOR JAVASCRIPT STOCK CHARTS FROM AMCHARTS //
	AmCharts.averageGraphs = 0;
	AmCharts.addMovingAverage = function (dataSet, panel, field) {
	    // update dataset
	    
	   var avgField = "avg"+AmCharts.averageGraphs;
	   dataSet.fieldMappings.push({
	       fromField: avgField,
	       toField: avgField});
	    
	    // calculate moving average
	    var fc = 0;
	    var sum = 0;

	    for (var i = 0; i < dataSet.dataProvider.length; i++) {
	        var dp = dataSet.dataProvider[i];
	        if (dp[field] !== undefined) {
	            for(var j = 0; j < dp[field]; j++)
	            	sum++;
	            fc++;
	            dp[avgField] = Math.round(sum / fc * 10) / 10;
	        }  
	    }
	    
	    // create a graph
	    var graph = new AmCharts.StockGraph();
	    graph.valueField = avgField;
	    panel.addStockGraph(graph);
	    
	    // increment average graph count
	    AmCharts.averageGraphs++;
	    
	    // return newly created StockGraph object
	    return graph;
	}
	*/

	function createStockChart() {

		var categoryAxesSettings = new AmCharts.CategoryAxesSettings();
		categoryAxesSettings.minPeriod = "ss";
		//categoryAxesSettings.groupToPeriods = ["10mm"];
		chart.periodValue = "Average";
		chart.categoryAxesSettings = categoryAxesSettings;
		chart.responsive = {"enabled": true};
		chart.export = {"enabled": true};


		// DATASETS //////////////////////////////////////////
		// create data sets first
		var dataSet1 = new AmCharts.DataSet();
		dataSet1.title = "Sensor 1";
		dataSet1.fieldMappings = [{
			fromField: "qtdResp",
			toField: "qtdResp"
		}];
		dataSet1.dataProvider = sensor1;
		dataSet1.categoryField = "date";

		var dataSet2 = new AmCharts.DataSet();
		dataSet2.title = "Sensor 2";
		dataSet2.fieldMappings = [{
			fromField: "qtdResp",
			toField: "qtdResp"
		}];
		dataSet2.dataProvider = sensor2;
		dataSet2.categoryField = "date";

		// set data sets to the chart
		chart.dataSets = [dataSet1, dataSet2];
			

		// PANELS ///////////////////////////////////////////

		// first stock panel
		var stockPanel1 = new AmCharts.StockPanel();
		stockPanel1.title = "Qntd Respirações";
		stockPanel1.percentHeight = 100;

		// graph of first stock panel
		var graph1 = new AmCharts.StockGraph();
		graph1.valueField = "qtdResp";
		graph1.comparable = true;
		graph1.compareField = "qtdResp";
		graph1.bullet = "round";
		graph1.bulletBorderColor = "#FFFFFF";
		graph1.bulletBorderAlpha = 1;
		graph1.balloonText = "Respirações: <b>[[value]] Vezes</b>";
		graph1.compareGraphBalloonText = "Respirações:<b>[[value]] Vezes</b>";
		graph1.compareGraphBullet = "round";
		graph1.compareGraphBulletBorderColor = "#FFFFFF";
		graph1.compareGraphBulletBorderAlpha = 1;
		stockPanel1.addStockGraph(graph1);

		// create stock legend
		var stockLegend1 = new AmCharts.StockLegend();
		stockLegend1.periodValueTextComparing = "[[percents.qtdResp.close]]%";
		stockLegend1.periodValueTextRegular = "[[qtdResp.close]]";
		stockPanel1.stockLegend = stockLegend1;

		// set panels to the chart
		chart.panels = [stockPanel1];

		// OTHER SETTINGS ////////////////////////////////////
		var sbsettings = new AmCharts.ChartScrollbarSettings();
		sbsettings.graph = graph1;
		sbsettings.usePeriod = "mm"; // this will improve performance
		chart.chartScrollbarSettings = sbsettings;

		// CURSOR
		var cursorSettings = new AmCharts.ChartCursorSettings();
		cursorSettings.valueBalloonsEnabled = true;
		chart.chartCursorSettings = cursorSettings;


		// PERIOD SELECTOR ///////////////////////////////////
		var periodSelector = new AmCharts.PeriodSelector();
		periodSelector.position = "left";
		periodSelector.dateFormat = "YYYY-MM-DD JJ:NN";
		periodSelector.periods = [
		{
			period: "hh",
			count: 1,
			label: "1 hour"
		}, {
			period: "hh",
			count: 5,
			label: "5 hour"
		}, {
			period: "hh",
			count: 12,
			label: "12 hours"
		}, {
			period: "DD",
			count: 1,
			label: "1 dia"
		}, {
			period: "DD",
			count: 5,
			label: "5 dias"
		}, {
			period: "DD",
			count: 10,
			label: "10 dias"
		}, {
			period: "MM",
			count: 1,
			label: "1 mes"
		}, {
			period: "MAX",
			selected: true,
			label: "MAX"
		}];
		chart.periodSelector = periodSelector;
		
		var panelsSettings = new AmCharts.PanelsSettings();
		panelsSettings.mouseWheelZoomEnabled = true;
		panelsSettings.usePrefixes = true;
		chart.panelsSettings = panelsSettings;

		// DATA SET SELECTOR
		var dataSetSelector = new AmCharts.DataSetSelector();
		dataSetSelector.position = "left";
		dataSetSelector.language = "pt";
		chart.dataSetSelector = dataSetSelector;

		/*
		// ADD AVERAGES //////////////////////////////////////
		//console.log(dataSet1);
	    var avgGraph = AmCharts.addMovingAverage(dataSet1, stockPanel1, "qtdResp");
	    avgGraph.useDataSetColors = false;
	    avgGraph.color = "#ccffcc";
	    avgGraph.title = "Média Móvel";
	    */
	}

/*
	setInterval( function() {

	  $http.get("http://localhost/WEBSITE-BetaTeste/PHP/server.php")
		.then(
			//SUCCESS
			function(data) {
				var lastValueOnDB =  data.data[data.data.length - 1]; //ultimo valor salvo no banco de dados
				var lastValueOnChart = chart.dataSets[0].dataProvider[chart.dataSets[0].dataProvider.length - 1];//úlitmo valor no gráfico
				if(lastValueOnDB.datatemp != lastValueOnChart.datatemp) {
					console.log('changed');
					chart.dataSets[0].dataProvider.push(data.data[data.data.length - 1])
					chart.validateData();
				}
			},
			//FAIL
			function(error) {
				console.log("Não foi possível carregar o BD: "+error);
			}
		);

	}, 10000 ); */ 
});