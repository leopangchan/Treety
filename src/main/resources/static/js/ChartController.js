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

  $ctrl.formatPedestrianChart = function(res, startts, endts) {
    var data = new google.visualization.DataTable();

    data.addColumn('date', 'Time');
    data.addColumn('number', 'Number of Pedestrians');
    data.addRows(res);

    var options = {
        hAxis: {
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
          title: 'Number of Pedestrians'
        },
        title: 'Number of Pedestrians from ' +
         (new Date(startts)).toDateString() +
         ' to ' +
         (new Date(endts)).toDateString()
    };

    var chart = new google.visualization.LineChart(document.getElementById(chartId));

    chart.draw(data, options);
  }

  $ctrl.drawPedestrianChart = function() {
    ///pedestrian/timeRange?start=1523762377000&end=1524107977000&locId=a49a96ea

    // get dates for backend request
    var today = new Date()

    var endDate = new Date(today)
    endDate.setDate(today.getDate() - 1)
    var endts = Math.trunc(endDate.getTime())

    var startDate = new Date(today)
    startDate.setDate(today.getDate() - 5)
    var startts = Math.trunc(startDate.getTime())

    $http({
        method: 'GET',
        url: "/pedestrian/timeRange?start="+
         startts +
         "&end=" +
         endts +
         "&locId=a49a96ea"
    })
    .then(function (value) { // get the data
        res = []
        var data = value.data
        data.forEach(function(element) {
            res.push([new Date(element['time']), element['count']])
        })

        return res
    })
    .then(function(res) { // draw the chart
        $ctrl.formatPedestrianChart(res, startts, endts)
    })
  };

  (function() {
    switch ($chartType) {
      case 'environmental':
        $ctrl.loadEnvTable();
        return;
      case 'pedestrian':
        $ctrl.loadPedestrianChart();
        return;
      case 'traffic':
        $ctrl.loadTrafficChart();
        return;
    }
  })();

});