app.controller("TreeMapController",
 function($scope, $http, $timeout, NgMap, $mdDialog){
	
	var vm = this;
	vm.token = token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImxlZ2FjeS10b2tlbi1rZXkiLCJ0eXAiOiJKV1QifQ.eyJqdGkiOiI1MDhjMjE2YzU3ZmY0MGFhODAxYWI0YzFlNDU5ZGQ3OCIsInN1YiI6InNkLmhhY2thdGhvbiIsInNjb3BlIjpbImllLWN1cnJlbnQuUFNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQuREVWRUxPUCIsImllLWN1cnJlbnQuUFNELUlFLVRSQUZGSUMuSUUtVFJBRkZJQy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLVZJREVPLklFLVZJREVPLkxJTUlURUQuREVWRUxPUCIsInVhYS5yZXNvdXJjZSIsImllLWN1cnJlbnQuUFNELUlFLVBFREVTVFJJQU4uSUUtUEVERVNUUklBTi5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQuREVWRUxPUCIsImllLWN1cnJlbnQuUFNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlBTRC1JRS1WSURFTy5JRS1WSURFTy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLVRSQUZGSUMuSUUtVFJBRkZJQy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLUVOVklST05NRU5UQUwuSUUtRU5WSVJPTk1FTlRBTC5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlBTRC1JRS1FTlZJUk9OTUVOVEFMLklFLUVOVklST05NRU5UQUwuTElNSVRFRC5ERVZFTE9QIiwiaWUtY3VycmVudC5TRC1JRS1QRURFU1RSSUFOLklFLVBFREVTVFJJQU4uTElNSVRFRC5ERVZFTE9QIl0sImNsaWVudF9pZCI6InNkLmhhY2thdGhvbiIsImNpZCI6InNkLmhhY2thdGhvbiIsImF6cCI6InNkLmhhY2thdGhvbiIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJyZXZfc2lnIjoiNWE0YzhlYyIsImlhdCI6MTUyMzQwMjAyNiwiZXhwIjoxNTI0MDA2ODI2LCJpc3MiOiJodHRwczovLzYyNGVmZjAyLWRiYjEtNGM2Yy05MGJjLWZhODVhMjllNWZhOC5wcmVkaXgtdWFhLnJ1bi5hd3MtdXN3MDItcHIuaWNlLnByZWRpeC5pby9vYXV0aC90b2tlbiIsInppZCI6IjYyNGVmZjAyLWRiYjEtNGM2Yy05MGJjLWZhODVhMjllNWZhOCIsImF1ZCI6WyJpZS1jdXJyZW50LlNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQiLCJpZS1jdXJyZW50LlBTRC1JRS1WSURFTy5JRS1WSURFTy5MSU1JVEVEIiwiaWUtY3VycmVudC5QU0QtSUUtVFJBRkZJQy5JRS1UUkFGRklDLkxJTUlURUQiLCJpZS1jdXJyZW50LlBTRC1JRS1QRURFU1RSSUFOLklFLVBFREVTVFJJQU4uTElNSVRFRCIsImllLWN1cnJlbnQuUFNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVEIiwiaWUtY3VycmVudC5QU0QtSUUtRU5WSVJPTk1FTlRBTC5JRS1FTlZJUk9OTUVOVEFMLkxJTUlURUQiLCJpZS1jdXJyZW50LlNELUlFLVZJREVPLklFLVZJREVPLkxJTUlURUQiLCJpZS1jdXJyZW50LlNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVEIiwiaWUtY3VycmVudC5TRC1JRS1UUkFGRklDLklFLVRSQUZGSUMuTElNSVRFRCIsImllLWN1cnJlbnQuUFNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQiLCJ1YWEiLCJpZS1jdXJyZW50LlNELUlFLUVOVklST05NRU5UQUwuSUUtRU5WSVJPTk1FTlRBTC5MSU1JVEVEIiwiaWUtY3VycmVudC5TRC1JRS1QRURFU1RSSUFOLklFLVBFREVTVFJJQU4uTElNSVRFRCIsInNkLmhhY2thdGhvbiJdfQ.BumE9iuNyePgtUcJrsVuN-fVVCoO7NVV_fedWN8M4zvoN3EbxIVwq_01Y01IEmQdD6NpWue6N7ER2qvzYBvDISFhJ4XMD9GisQU-xnDRGOT-SxwtUCPiy2UnR0Gqa_jejHBUS11csD-6WUN1ItT3U3i-uasDW4S2KjgRZD5GWXMcx5mvUwqn2R4RF9hereJn_wxd3cNohp8NBlTLSXOw_vAkzl6ha049-U4OjNSYZAfKIWbdtE01oRhic6M_y_4jJkyyJzi9DDFKnuJTFg2IJ09OyGWqlZ6Cqmu95Q7XifjXxWP7_EUhqix2gE-M73bbohwOdDVZ36JjTFoXcUsh9g"
    vm.markerPos = []

    // measurements are in meters
    // radius refers to canopy radius
    vm.trees = {
     "oak" : {"height": 18.288, "radius": 7.9248},
     "pear" : {"height": 13.716, "radius": 6.096},
     "mulberry" : {"height": 9.144, "radius": 7.62}
    }

    // default tree type
    vm.selected_tree = "oak"

    /* open dialog for planting a new tree */
    vm.newTree = function($event) {
        console.log('Plant tree')

        $mdDialog.show({
            template: '<p>Hello There</p>',
            //parent: $rootElement,
            scope: $scope,
            preserveScope: true,
            clickOutsideToClose: true
        });
    }

    /* map functions */
    NgMap.getMap().then(function(map) {
      vm.map = map
      if (map.markers) {
        vm.marker = map.markers[0].getPosition()
      }
    })

    /* zoom to center when user clicked on a marker */
    vm.centerChanged = function(event) {
      $timeout(function() {
        if (vm.marker) {
            vm.map.panTo(vm.marker);
        }
      }, 3000);
    }

    /* change center when user clicks on marker */
    vm.markerClicked = function(event, pos) {
        var marker = vm.map.markers[vm.locationPos.indexOf(pos)]

        if (pos) {
            vm.map.setCenter(marker.getPosition());
            vm.marker = marker.getPosition()
            vm.map.setZoom(16);
        }
    }

    /* CHART FUNCTIONS */

    /* load a google pie chart */
    vm.CrimeloadChart = function() {
        console.log("Load Chart");
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(this.drawCrimeChart);
    }

    vm.loadPieChart = function() {
        console.log("Load Chart");
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(this.drawPieChart);
    }

    vm.CarbonloadChart = function() {
        console.log("Load Chart");
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(this.drawCarbonChart);
    }

    vm.TrafficloadChart = function() {
        console.log("Load Chart");
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(this.drawTrafficChart);
    }

    vm.WaterloadChart = function() {
        console.log("Load Chart");
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(this.drawWaterChart);
    }

    vm.drawWaterChart = function() {
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
        var chart = new google.visualization.LineChart(document.getElementById('chart'));
        chart.draw(data, options);
    }

    vm.drawCarbonChart = function() {
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

       var chart = new google.visualization.BarChart(document.getElementById("chart"));
        chart.draw(view, options);
        console.log("I was clicked!")
      }

      vm.drawCrimeChart = function() {
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

        var chart = new google.visualization.PieChart(document.getElementById('chart'));

        chart.draw(data, options);
        console.log("Crime: I was clicked!")
    }

    vm.loadPedestrianChart = function(data) {
        console.log('Loading line chart')
        google.charts.load('current', {packages: ['corechart', 'line']});
        google.charts.setOnLoadCallback(vm.drawPedestrianChart);
    }

    vm.drawPedestrianChart = function() {
        var eventurl = "https://ic-event-service-sdhack.run.aws-usw02-pr.ice.predix.io/v2"
        var locationId = '9bbdcec9'
        var zoneId = "SD-IE-PEDESTRIAN"
        var res = []

        today = new Date()
        endts = today.setDate(today.getDate()-1)
        startts = (new Date(endts)).setDate((new Date(endts)).getDate() - 1)

        // query url
        var requestURL = eventurl + '/locations/' + locationId +
         '/events?eventType=PEDEVT&startTime=' +
         startts + '&' + 'endTime=' + endts

        var req = {
            method: 'GET',
            url: requestURL,
            headers: {
                "Authorization": "Bearer " + vm.token,
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

                var chart = new google.visualization.LineChart(document.getElementById('chart'));

                chart.draw(data, options);
            }
        })
    }

    /* load a google pie chart */
    vm.loadTable = function() {
        console.log("Load Chart");
        google.charts.load('current', {'packages':['corechart']});
        google.charts.load('current', { 'packages': ['table'] });
        google.charts.setOnLoadCallback(this.drawTable);
    }

    vm.drawTable = function() {
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'Energy Conserved (kw/h)');
        data.addColumn('number', 'Stormwater Filtered (gal/year)');
        data.addColumn('number', 'Air Quality Improved (gal/year)');
        data.addColumn('number', 'Carbon Dioxide Removed (lbs/year)');
        data.addRows([
          [{v: 10000, f: '$10,000'},  {v: 10000, f: '$10,000'}, {v: 10000, f: '$10,000'}, {v: 10000, f: '$10,000'}]
        ]);

        var table = new google.visualization.Table(document.getElementById('chart'));

        var options = {
            allowHtml: true,
            cssClassNames: {
              tableCell: 'small-font'
            }
          };


        table.draw(data, options);
    }

    // get a week's worth of pedestrian data
    vm.getWeeklyPedestrians = function() {
        var days_in_week = 7
        var i, sum
        var today, startDate, endDate
        var sum = []
        var res = []

        for (i = days_in_week; i >= 1; i--) {
            today = new Date()
            endDate = today.setDate(today.getDate() - 1)
            startDate = (new Date(endDate)).setDate((new Date(endDate)).getDate() - 1)

            console.log(startDate)
            console.log(endDate)
        }

        return res
    }

    vm.drawTrafficChart = function() {
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

        var chart = new google.visualization.PieChart(document.getElementById('chart'));

        chart.draw(data, options);
        console.log("Crime: I was clicked!")
    }

    // functions for calculating benefits

    // counts total number of pedestrians from a pedestrian json
    vm.sumPedestrians = function(pedestrians) {
        sum = 0

        if (pedestrians.hasOwnProperty('content')) {
            pedestrians['content'].forEach(function(element) {

                if (element.hasOwnProperty('measures') &&
                 element['measures'].hasOwnProperty('pedestrianCount')) {
                    sum += element['measures']['pedestrianCount']
                }
            })
        }

        return sum
    }

    // helper functions to calculate tree water retention
    vm.calc_e_delta = function(radius, height, temperature) {
        var tmp = (7.5 * temperature) / (237.3 + temperature)
        var S =  610.7 * Math.pow(10, tmp)
        return (((100 - radius*height) * S) / 100.0) * S
    }

    vm.calc_delta = function(temperature) {
        var power = (17.27*temperature) / (temperature + 273.3)
        var numerator = 4098 * (0.6108 * Math.pow(e, power))
        var denominator = Math.pow(temperature + 237.3, 2)
        return numerator / denominator
    }

    // calculate evapotranspirtation in mm / day
    vm.calc_evapotranspiration = function(radius, height, temperature) {
        var e_delta = vm.calc_e_delta(radius, height, temperature)
        var delta = vm.calc_delta(temperature)
        var gamma = 0.675
        var U = 11.3 // wind speed (KPM)
        var numerator = (0.408 * delta) + (gamma * (900/(T+273)) * U * e_delta)
        var denominator = delta + (gamma * (1 + 0.34 * U))

        return numerator / denominator
    }

    // calculate % of water retained by the tree
    vm.calc_water_retention = function(radius, height, temperature) {
        var evapotranspiration = vm.calc_evapotranspiration(radius, height, temperature)
        var avg_rainfall = 300 // mm
        return (1 - evapotranspiration) / avg_rainfall
    }

    // calculate the average temperature from a list of environment jsons
    vm.average_temperature = function(environment) {
        var sum = 0
        var length = environment.length

        environment.forEach(function(element) {
            if (element.hasOwnProperty('measures') && element.hasOwnProperty('properties')) {
                var power = element['properties']['powerOf10']

                // convert to Celcius
                sum += (element['measures']['median'] * Math.pow(10, power)) - 273
            }
        })

        return sum / length
    }

    // initialize the coordinate for the controller's markers
    vm.initMarkers = function(type) {
        // query url
        var metadataurl = 'https://ic-metadata-service-sdhack.run.aws-usw02-pr.ice.predix.io/v2/metadata'
        var requestURL = metadataurl + "/locations/search?q=locationType:" + type + "&page=0&size=50"
        var zoneId = 'SD-IE-TRAFFIC'

        var req = {
            method: 'GET',
            url: requestURL,
            headers: {
                "Authorization": "Bearer " + vm.token,
                "Predix-Zone-Id": zoneId
            }
        }

        $http(req)
         .then(function(data) {
            var locations = data.data['content']

            locations.forEach(function(element) {
                if (element.hasOwnProperty('coordinates')) {
                    var coord = element['coordinates'].split(":")
                    vm.markerPos.push([parseFloat(coord[0]), parseFloat(coord[1])])
                }
            })
         })
    }

    // TODO:
    // write a function that takes in a coordinate [lat, long]
    // calls the get locations function with a sensor type ex: 'TRAFFIC_LANE'
    // returns the location id of the closest sensor

    vm.getClosestSensor = function(type, coord) {
    }

    vm.init = function() {
        vm.initMarkers('TRAFFIC_LANE')
    }

});