//"Access-Control-Allow-Origin": "http://localhost:8090"
//"Access-Control-Allow-Credentials": "true",
//"Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
//"Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, " +
//"Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"

app.controller("ChartController", function ($chartType, $uibModalInstance, $http, $lglat) {

  var $ctrl = this;
  var chartId = "chart";
  $ctrl.token = config.token

  /**
  *  write a function that takes in a coordinate [lat, long], calls the get locations function.
  *
  *  Note:
  *  vm.locationPos = [[32.708757321722075, -117.16414366466401, $$hashKey: "object:10"], ...]
  *
  *  @param type - a sensor type ex: TRAFFIC_LANE
  *  @param coord - [32.708757321722075, -117.16414366466401]
  *  @return the location id of the closest sensor
  *
  *  sqrt((x1^2 - x2^2)^2 + (y1^2 - y2^2)^2)
  */
  $ctrl.getClosestSensor = function(locations, coord) {
    var closestPos = undefined
    var minDis = undefined

    locations.forEach(function (pos) {
        if (pos) {
            let xDis = Math.abs(Math.pow(parseFloat(pos[0]), 2) - Math.pow(parseFloat(coord[0]), 2))
            let yDis = Math.abs(Math.pow(parseFloat(pos[1]), 2) - Math.pow(parseFloat(coord[1]), 2))
            let dis = Math.sqrt(Math.abs(xDis - yDis))

            if ((minDis === undefined) || (minDis > dis)) {
               minDis = dis
               closestPos = pos
            }
        }
    })

    if (closestPos === undefined) {
        return 'a49a96ea'
    }

    return closestPos[2]
  }

  $ctrl.make_api_request_header = function(type) {
    // query url
    var metadataurl = 'https://ic-metadata-service-sdhack.run.aws-usw02-pr.ice.predix.io/v2/metadata'
    var requestURL = metadataurl + "/locations/search?q=locationType:" + type + "&page=0&size=50"
    var zoneId = 'SD-IE-TRAFFIC'

    var req = {
        method: 'GET',
        url: requestURL,
        headers: {
            "Authorization": "Bearer " + $ctrl.token,
            "Predix-Zone-Id": zoneId
        }
    }

    return req
  }

  $ctrl.get_start_end_time = function() {
    // get dates for backend request
    var today = new Date()

    var endDate = new Date(today)
    endDate.setDate(today.getDate() - 1)
    var endts = Math.trunc(endDate.getTime())

    var startDate = new Date(today)
    startDate.setDate(today.getDate() - 7)
    var startts = Math.trunc(startDate.getTime())

    return {"startts":startts, "endts":endts}
  }

  $ctrl.formatChart = function(res, startts, endts, titles) {
      var data = new google.visualization.DataTable();

      data.addColumn('date', titles['x_axis']);
      data.addColumn('number', titles['y_axis']);
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
            title: titles['x_axis']
          },
          vAxis: {
            title: titles['y_axis']
          },
          title: titles['title']
      };

      var chart = new google.visualization.LineChart(document.getElementById(chartId));

      chart.draw(data, options);
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
    ///traffic/timeRange?start=1523762377000&end=1524107977000&locId=a49a96ea
    console.log('USER COORDS TRAFFIC CHART')
    console.log($lglat)

    if (!$lglat) {
        $lglat = [32.7157, -117.1611]
    }

    var time = $ctrl.get_start_end_time()
    var req = $ctrl.make_api_request_header('TRAFFIC_LANE')
    var titles = {
        'title': 'Average Number of Vehicles from ' +
         (new Date(time["startts"])).toDateString() +
         ' to ' +
         (new Date(time["endts"])).toDateString(),

         'x_axis': 'Date',
         'y_axis': 'Average Number of Vehicles'
    }

    $http(req)
    .then(function(data) {
        var res = []
        var locations = data.data['content']

        locations.forEach(function(element) {
            if (element.hasOwnProperty('coordinates')) {
                var coord = element['coordinates'].split(":")
                res.push( [parseFloat(coord[0]), parseFloat(coord[1]), element["locationUid"]] )
            }
        })

        return $ctrl.getClosestSensor(res, $lglat)
    })
    .then(function(sensor) {
        console.log('CLOSEST SENSOR')
        console.log(sensor)
        $http({
            method: 'GET',
            url: "/traffic/timeRange?start="+
            time["startts"] +
            "&end=" +
            time["endts"] +
            "&locId="+
            sensor
        })
        .then(function (value) { // get the data
            res = []
            var data = value.data
            data.forEach(function(element) {
                res.push([new Date(element['time']), element['avgSpeed']])
            })

            return res
        })
        .then(function(res) { // draw the chart
            console.log('DATA')
            console.log(res)
            $ctrl.formatChart(res, time["startts"], time["endts"], titles)
        })
    })


    /*var data = google.visualization.arrayToDataTable([
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

    chart.draw(data, options);*/
    console.log("Traffic: I was clicked!")
  };

  $ctrl.drawPedestrianChart = function() {
    console.log('USER COORDS PED CHART')
    console.log($lglat)

    if (!$lglat) {
        $lglat = [32.7157, -117.1611]
    }
    ///pedestrian/timeRange?start=1523762377000&end=1524107977000&locId=a49a96ea

    var time = $ctrl.get_start_end_time()
    var req = $ctrl.make_api_request_header('WALKWAY')
    var titles = {
        'title': 'Average Number of Pedestrians from ' +
         (new Date(time["startts"])).toDateString() +
         ' to ' +
         (new Date(time["endts"])).toDateString(),

         'x_axis': 'Date',
         'y_axis': 'Average Number of Pedestrians'
    }

    $http(req)
     .then(function(data) {
        var res = []
        var locations = data.data['content']

        locations.forEach(function(element) {
            if (element.hasOwnProperty('coordinates')) {
                var coord = element['coordinates'].split(":")
                res.push( [parseFloat(coord[0]), parseFloat(coord[1]), element["locationUid"]] )
            }
        })

        return $ctrl.getClosestSensor(res, $lglat)
     })
     .then(function(sensor) {
        console.log('CLOSEST SENSOR')
        console.log(sensor)
        $http({
            method: 'GET',
            url: "/pedestrian/timeRange?start="+
             time["startts"] +
             "&end=" +
             time["endts"] +
             "&locId="+
             sensor
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
            console.log('DATA')
            console.log(res)
            $ctrl.formatChart(res, time["startts"], time["endts"], titles)
        })
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