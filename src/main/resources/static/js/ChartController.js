app.controller("ChartController", function ($chartType, $uibModalInstance, $http) {

  var $ctrl = this;
  var chartId = "chart";

  $ctrl.showMarkers = true

  $ctrl.toggleMarkers = function() {
    console.log('Toggle markers')
    $ctrl.showMarkers = false
  }

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $ctrl.loadCrimeChart = function() {
    console.log("Load Chart");
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback($ctrl.drawCrimeChart);
  };

  $ctrl.loadPieChart = function() {
    console.log("Load Chart");
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback($ctrl.drawPieChart);
  };

  $ctrl.loadCarbonChart = function() {
    console.log("Load Chart");
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback($ctrl.drawCarbonChart);
  };

  $ctrl.loadTrafficChart = function() {
    console.log("Load Chart");
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback($ctrl.drawTrafficChart);
  };

  $ctrl.loadPedestrianChart = function(data) {
    console.log('Loading line chart');
    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback($ctrl.drawPedestrianChart);
  };

  /* load a google pie chart */
  $ctrl.loadEnvTable = function() {
    console.log("Load Chart");
    google.charts.load('current', {'packages':['corechart']});
    google.charts.load('current', { 'packages': ['table'] });
    google.charts.setOnLoadCallback($ctrl.drawEnvTable);
  };

  $ctrl.loadWaterChart = function() {
    console.log("Load Chart");
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback($ctrl.drawWaterChart);
  };

  $ctrl.drawWaterChart = function() {
    var data = google.visualization.arrayToDataTable([
      ['Year', 'Sales', 'Expenses'],
      ['2004',  1000,      400],
      ['2005',  1170,      460],
      ['2006',  660,       1120],
      ['2007',  1030,      540]
    ]);

    var options = {
      title: 'Company Performance',
      curveType: 'function',
      legend: { position: 'bottom' }
    };
    var chart = new google.visualization.LineChart(document.getElementById(chartId));
    chart.draw(data, options);
  };

  $ctrl.drawCarbonChart = function() {
    var data = google.visualization.arrayToDataTable([
      ['Year', 'Visitations', { role: 'style' } ],
      ['2010', 10, 'color: gray'],
      ['2020', 14, 'color: #76A7FA'],
      ['2030', 16, 'opacity: 0.2'],
      ['2040', 22, 'stroke-color: #703593; stroke-width: 4; fill-color: #C5A5CF'],
      ['2050', 28, 'stroke-color: #871B47; stroke-opacity: 0.6; stroke-width: 8; fill-color: #BC5679; fill-opacity: 0.2']
    ]);
    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
      { calc: "stringify",
        sourceColumn: 1,
        type: "string",
        role: "annotation" },
      2]);

    var options = {
      title: "Carbon Reduced, in metric-tons",
      width: 600,
      height: 400,
      bar: {groupWidth: "95%"},
      legend: { position: "none" },
    };

    var chart = new google.visualization.BarChart(document.getElementById(chartId));
    chart.draw(view, options);
    console.log("I was clicked!")
  };

  $ctrl.drawCrimeChart = function() {
    var data = google.visualization.arrayToDataTable([
      ['Crime', 'Recent (Past Week)'],
      ['Theft',     11],
      ['Drugs',      2],
      ['Hit-Run',  2],
      ['Violence', 2],
      ['Ticket',    7]
    ]);

    var options = {
      title: 'Crime'
    };

    var chart = new google.visualization.PieChart(document.getElementById(chartId));

    chart.draw(data, options);
    console.log("Crime: I was clicked!")
  };

  $ctrl.drawEnvTable = function() {
    var data = new google.visualization.DataTable();
    data.addColumn("string", "Types");
    data.addColumn('number', "Benefit");
    data.addRows([
      ['Energy Conserved (kw/h)', {v: 10000, f: '$10,000'}],
      ['Stormwater Filtered (gal/year)', {v: 10000, f: '$10,000'}],
      ['Air Quality Improved (gal/year)', {v: 10000, f: '$10,000'}],
      ['Carbon Dioxide Removed (lbs/year)', {v: 10000, f: '$10,000'}]
    ]);

    var table = new google.visualization.Table(document.getElementById(chartId));

    var options = {
      allowHtml: true,
      cssClassNames: {
        tableCell: 'small-font'
      }
    };

    table.draw(data, options);
  };

  $ctrl.drawTrafficChart = function() {
    var data = google.visualization.arrayToDataTable([
      ['Crime', 'Recent (Past Week)'],
      ['Theft',     11],
      ['Drugs',      2],
      ['Hit-Run',  2],
      ['Violence', 2],
      ['Ticket',    7]
    ]);

    var options = {
      title: 'Traffic'
    };

    var chart = new google.visualization.PieChart(document.getElementById(chartId));

    chart.draw(data, options);
    console.log("Crime: I was clicked!")
  };

  $ctrl.drawPedestrianChart = function() {
    var eventurl = "https://ic-event-service-sdhack.run.aws-usw02-pr.ice.predix.io/v2"
    var locationId = '9bbdcec9'
    var zoneId = "SD-IE-PEDESTRIAN"
    var res = []

    today = new Date()
    endts = today.setDate(today.getDate()-1)
    startts = (new Date(endts)).setDate((new Date(endts)).getDate() - 1)

    console.log('start ' + new Date(startts))
    console.log('end ' + new Date(endts))

    // query url
    var requestURL = eventurl + '/locations/' + locationId +
        '/events?eventType=PEDEVT&startTime=' +
        startts + '&' + 'endTime=' + endts

    var req = {
      method: 'GET',
      url: requestURL,
      headers: {
        "Authorization": "Bearer " + config.token,
        "Predix-Zone-Id": zoneId,
        /*"Access-Control-Allow-Origin": "https://localhost:8090",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, " +
        "Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"*/
      }
    }

    $http(req)
        .then(function(data) {
          var pedestrians = data.data
          var sum = 0
          var index = 0
          var count = 0
          var min = endts
          var max = startts

          if (pedestrians.hasOwnProperty('content')) {
            pedestrians['content'].forEach(function(element) {

              if (element.hasOwnProperty('measures') &&
                  element['measures'].hasOwnProperty('pedestrianCount')) {

                count = element["measures"]["counter_direction_pedestrianCount"] +
                    element['measures']['pedestrianCount']

                time = element['timestamp']
                min = time < min ? time : min
                max = time > max ? time : max

                sum += count
                res.push([new Date(time), count])

                index += 1
              }
            });

            console.log('Total number of pedestrians: ' + sum)
            console.log('Total number of data points ' + res.length)

            var data = new google.visualization.DataTable();
            console.log(res)

            data.addColumn('date', 'Time');
            data.addColumn('number', 'Number of Pedestrians');
            data.addRows(res);

            var options = {
              hAxis: {
                viewWindow: {
                  min: new Date(startts),
                  max: new Date(endts)
                },
                gridlines: {
                  count: -1,
                  units: {
                    days: {format: ['MMM dd']},
                    hours: {format: ['HH:mm', 'ha']},
                  }
                },
                minorGridlines: {
                  units: {
                    hours: {format: ['hh:mm:ss a', 'ha']},
                    minutes: {format: ['HH:mm a Z', ':mm']}
                  }
                },
                title: 'Time of Day (hours)'
              },
              vAxis: {
                title: 'Number of Pedestrians',
                minValue: 0, maxValue: 5
              },
              title: 'Number of Pedestrians from ' + (new Date(startts)).toDateString() + ' to ' + (new Date(endts)).toDateString()
            };

            var chart = new google.visualization.LineChart(document.getElementById(chartId));

            chart.draw(data, options);
          }
        })
  };

  (function() {
    switch ($chartType) {
      case 'environmental':
        $ctrl.loadEnvTable();
        return;
      case 'pesdestrain':
        $ctrl.loadPedestrianChart();
        return;
      case 'carbon':
        $ctrl.loadCarbonChart();
        return;
      case 'crime':
        $ctrl.loadCrimeChart();
        return;
      case 'water':
        $ctrl.loadWaterChart();
        return;
      case 'traffic':
        $ctrl.loadTrafficChart();
        return;
    }
  })();

});