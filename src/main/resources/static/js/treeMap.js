app.controller("TreeMapController", function($compile, $scope, $http, NgMap, callAjaxFactory){
	
	var vm = this;

	vm.token = token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImxlZ2FjeS10b2tlbi1rZXkiLCJ0eXAiOiJKV1QifQ.eyJqdGkiOiI1MDhjMjE2YzU3ZmY0MGFhODAxYWI0YzFlNDU5ZGQ3OCIsInN1YiI6InNkLmhhY2thdGhvbiIsInNjb3BlIjpbImllLWN1cnJlbnQuUFNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQuREVWRUxPUCIsImllLWN1cnJlbnQuUFNELUlFLVRSQUZGSUMuSUUtVFJBRkZJQy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLVZJREVPLklFLVZJREVPLkxJTUlURUQuREVWRUxPUCIsInVhYS5yZXNvdXJjZSIsImllLWN1cnJlbnQuUFNELUlFLVBFREVTVFJJQU4uSUUtUEVERVNUUklBTi5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQuREVWRUxPUCIsImllLWN1cnJlbnQuUFNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlBTRC1JRS1WSURFTy5JRS1WSURFTy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLVRSQUZGSUMuSUUtVFJBRkZJQy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLUVOVklST05NRU5UQUwuSUUtRU5WSVJPTk1FTlRBTC5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlBTRC1JRS1FTlZJUk9OTUVOVEFMLklFLUVOVklST05NRU5UQUwuTElNSVRFRC5ERVZFTE9QIiwiaWUtY3VycmVudC5TRC1JRS1QRURFU1RSSUFOLklFLVBFREVTVFJJQU4uTElNSVRFRC5ERVZFTE9QIl0sImNsaWVudF9pZCI6InNkLmhhY2thdGhvbiIsImNpZCI6InNkLmhhY2thdGhvbiIsImF6cCI6InNkLmhhY2thdGhvbiIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJyZXZfc2lnIjoiNWE0YzhlYyIsImlhdCI6MTUyMzQwMjAyNiwiZXhwIjoxNTI0MDA2ODI2LCJpc3MiOiJodHRwczovLzYyNGVmZjAyLWRiYjEtNGM2Yy05MGJjLWZhODVhMjllNWZhOC5wcmVkaXgtdWFhLnJ1bi5hd3MtdXN3MDItcHIuaWNlLnByZWRpeC5pby9vYXV0aC90b2tlbiIsInppZCI6IjYyNGVmZjAyLWRiYjEtNGM2Yy05MGJjLWZhODVhMjllNWZhOCIsImF1ZCI6WyJpZS1jdXJyZW50LlNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQiLCJpZS1jdXJyZW50LlBTRC1JRS1WSURFTy5JRS1WSURFTy5MSU1JVEVEIiwiaWUtY3VycmVudC5QU0QtSUUtVFJBRkZJQy5JRS1UUkFGRklDLkxJTUlURUQiLCJpZS1jdXJyZW50LlBTRC1JRS1QRURFU1RSSUFOLklFLVBFREVTVFJJQU4uTElNSVRFRCIsImllLWN1cnJlbnQuUFNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVEIiwiaWUtY3VycmVudC5QU0QtSUUtRU5WSVJPTk1FTlRBTC5JRS1FTlZJUk9OTUVOVEFMLkxJTUlURUQiLCJpZS1jdXJyZW50LlNELUlFLVZJREVPLklFLVZJREVPLkxJTUlURUQiLCJpZS1jdXJyZW50LlNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVEIiwiaWUtY3VycmVudC5TRC1JRS1UUkFGRklDLklFLVRSQUZGSUMuTElNSVRFRCIsImllLWN1cnJlbnQuUFNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQiLCJ1YWEiLCJpZS1jdXJyZW50LlNELUlFLUVOVklST05NRU5UQUwuSUUtRU5WSVJPTk1FTlRBTC5MSU1JVEVEIiwiaWUtY3VycmVudC5TRC1JRS1QRURFU1RSSUFOLklFLVBFREVTVFJJQU4uTElNSVRFRCIsInNkLmhhY2thdGhvbiJdfQ.BumE9iuNyePgtUcJrsVuN-fVVCoO7NVV_fedWN8M4zvoN3EbxIVwq_01Y01IEmQdD6NpWue6N7ER2qvzYBvDISFhJ4XMD9GisQU-xnDRGOT-SxwtUCPiy2UnR0Gqa_jejHBUS11csD-6WUN1ItT3U3i-uasDW4S2KjgRZD5GWXMcx5mvUwqn2R4RF9hereJn_wxd3cNohp8NBlTLSXOw_vAkzl6ha049-U4OjNSYZAfKIWbdtE01oRhic6M_y_4jJkyyJzi9DDFKnuJTFg2IJ09OyGWqlZ6Cqmu95Q7XifjXxWP7_EUhqix2gE-M73bbohwOdDVZ36JjTFoXcUsh9g"

	vm.markers = [];
	vm.cities = [];
	vm.chart = ""

    /* load a google pie chart */
    vm.loadPieChart = function() {
        console.log("Load Chart");
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(this.drawPieChart);
    }

    /* draws a google pie chart */
    vm.drawPieChart = function() {
        var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Work',     11],
          ['Eat',      2],
          ['Commute',  2],
          ['Watch TV', 2],
          ['Sleep',    7]
        ]);

        var options = {
          title: 'My Daily Activities'
        };

        var chart = new google.visualization.PieChart(document.getElementById('chart'));

        chart.draw(data, options);
        console.log("I was clicked!")
    }

    vm.loadLineChart = function() {
        console.log('Loading line chart')
        google.charts.load('current', {packages: ['corechart', 'line']});
        google.charts.setOnLoadCallback(vm.drawLineChart);
    }

    vm.drawLineChart = function() {
        var data = new google.visualization.DataTable();

        data.addColumn('number', 'X');
        data.addColumn('number', 'Pedestrians');

        data.addRows([
        [0, 0],   [1, 10],  [2, 23],  [3, 17],  [4, 18],  [5, 9],
        [6, 11],  [7, 27]
        ]);

        var options = {
        hAxis: {
          title: 'Date'
        },
        vAxis: {
          title: 'Number of Pedestrians'
        },
        title: 'Number of Pedestrians This Week'
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart'));

        chart.draw(data, options);
    }

    // adds number of pedestrians to res
    vm.getNumberOfPedestrians = function(method, requestURL, zoneId, res) {
        var req = {
         method: method,
         url: requestURL,
         headers: {
           "Authorization": "Bearer " + vm.token,
           "Predix-Zone-Id": zoneId,
           "Access-Control-Allow-Origin": "https://localhost:8090",
           "Access-Control-Allow-Credentials": "true",
           "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
           "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, " +
            "Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
         }
        }

        $http(req)
         .then(function(data) {
            var pedestrians = data.data
            var sum = 0

            if (pedestrians.hasOwnProperty('content')) {
                pedestrians['content'].forEach(function(element) {
                    if (element.hasOwnProperty('measures') &&
                     element['measures'].hasOwnProperty('pedestrianCount')) {
                        sum += element['measures']['pedestrianCount']
                    }
                });

                console.log('Total number of pedestrians: ' + sum)
                res.push(sum)
                return sum
            }
         })

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
            endDate = today.setDate(today.getDate() - i)
            startDate = (new Date(endDate)).setDate((new Date(endDate)).getDate() - 1)
            vm.getDailyPedestrians(startDate, endDate, res)
        }

        console.log(res)
        vm.loadLineChart()

        return res
    }

    // get number of pedestrians from startts to endts
    vm.getDailyPedestrians = function(startts, endts, res) {
        console.log('start ' + new Date(startts))
        console.log('end ' + new Date(endts))

        var eventurl = "https://ic-event-service-sdhack.run.aws-usw02-pr.ice.predix.io/v2"
        var locationId = '9bbdcec9'
        var zoneId = "SD-IE-PEDESTRIAN"

        // query url
        var requestURL = eventurl + '/locations/' + locationId +
         '/events?eventType=PEDEVT&startTime=' +
         startts + '&' + 'endTime=' + endts

        var sum = vm.getNumberOfPedestrians('GET', requestURL, zoneId, res)
        return sum
    }

	// Ajax Factory request which loads the list of cities.
	callAjaxFactory.getAjax("getAllCities", '').then(
		function(response) {
			vm.cities = response;
			console.log(vm.cities);
		}
	);
	
	// Event which shows information about the marked clicked, also performs a zoom in the city
	vm.showCityInfo = function(event, city){
		vm.map.setZoom(14);
		vm.map.setCenter(new google.maps.LatLng(city.latitude, city.longitude));
		
		vm.selectedCity = city;
		vm.map.showInfoWindow('myInfoWindow', this);
	}
	
	// Attribute the NgMap to the map variable from the page
	// Displaying the markers
	NgMap.getMap().then(function(map) {
		vm.map = map;
		
		vm.showCustomMarker = function(evt){
			console.log('showing marker');
		}
		
		vm.closeCustomMarker= function(evt) {
            this.style.display = 'none';
        };
	});
	

});

app.factory('callAjaxFactory', function($http){
	return{
		getAjax: function(method, country){
			
			var inData = {'country' : country};
			
			return $http({
				url: '/WebAppProject2nd/'+method,
				method: 'POST',
				param: inData
			})
			.then(
				function(response){
					console.log(response.data);
					return response.data;
				}
			);
		}
	}
});