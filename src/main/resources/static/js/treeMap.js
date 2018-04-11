app.controller("TreeMapController", function($compile, $scope, $http, NgMap, callAjaxFactory){
	
	var vm = this;

	vm.token = token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImxlZ2FjeS10b2tlbi1rZXkiLCJ0eXAiOiJKV1QifQ" +
	 ".eyJqdGkiOiI3Y2ZiYTQ2MTBkZDc0ZmRiODNlZDBiMjQyZmE0Y2Q0MCIsInN1YiI6InNkLmhhY2thdGhvbiIsInN" +
	 "jb3BlIjpbImllLWN1cnJlbnQuUFNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQuREVWRUxPUCIsImllLWN1cnJ" +
	 "lbnQuUFNELUlFLVRSQUZGSUMuSUUtVFJBRkZJQy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLVZ" +
	 "JREVPLklFLVZJREVPLkxJTUlURUQuREVWRUxPUCIsInVhYS5yZXNvdXJjZSIsImllLWN1cnJlbnQuUFNELUlFLVB" +
	 "FREVTVFJJQU4uSUUtUEVERVNUUklBTi5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLVBBUktJTkc" +
	 "uSUUtUEFSS0lORy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUl" +
	 "URUQuREVWRUxPUCIsImllLWN1cnJlbnQuUFNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVELkRFVkVMT1A" +
	 "iLCJpZS1jdXJyZW50LlBTRC1JRS1WSURFTy5JRS1WSURFTy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlN" +
	 "ELUlFLVRSQUZGSUMuSUUtVFJBRkZJQy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLUVOVklST05" +
	 "NRU5UQUwuSUUtRU5WSVJPTk1FTlRBTC5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlBTRC1JRS1FTlZJUk9" +
	 "OTUVOVEFMLklFLUVOVklST05NRU5UQUwuTElNSVRFRC5ERVZFTE9QIiwiaWUtY3VycmVudC5TRC1JRS1QRURFU1R" +
	 "SSUFOLklFLVBFREVTVFJJQU4uTElNSVRFRC5ERVZFTE9QIl0sImNsaWVudF9pZCI6InNkLmhhY2thdGhvbiIsImN" +
	 "pZCI6InNkLmhhY2thdGhvbiIsImF6cCI6InNkLmhhY2thdGhvbiIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGV" +
	 "udGlhbHMiLCJyZXZfc2lnIjoiNWE0YzhlYyIsImlhdCI6MTUxODY3MzUzMywiZXhwIjoxNTE5Mjc4MzMzLCJpc3M" +
	 "iOiJodHRwczovLzYyNGVmZjAyLWRiYjEtNGM2Yy05MGJjLWZhODVhMjllNWZhOC5wcmVkaXgtdWFhLnJ1bi5hd3M" +
	 "tdXN3MDItcHIuaWNlLnByZWRpeC5pby9vYXV0aC90b2tlbiIsInppZCI6IjYyNGVmZjAyLWRiYjEtNGM2Yy05MGJ" +
	 "jLWZhODVhMjllNWZhOCIsImF1ZCI6WyJpZS1jdXJyZW50LlNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQiLCJpZS1jdXJyZW5" +
	 "0LlBTRC1JRS1WSURFTy5JRS1WSURFTy5MSU1JVEVEIiwiaWUtY3VycmVudC5QU0QtSUUtVFJBRkZJQy5JRS1UUkFGRklDLkxJTUlURUQiLCJpZS1" +
	 "jdXJyZW50LlBTRC1JRS1QRURFU1RSSUFOLklFLVBFREVTVFJJQU4uTElNSVRFRCIsImllLWN1cnJlbnQuUFNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU" +
	 "1JVEVEIiwiaWUtY3VycmVudC5QU0QtSUUtRU5WSVJPTk1FTlRBTC5JRS1FTlZJUk9OTUVOVEFMLkxJTUlURUQiLCJpZS1jdXJyZW50LlNELUlFLVZJREVPLklFLVZJREVPL" +
	 "kxJTUlURUQiLCJpZS1jdXJyZW50LlNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVEIiwiaWUtY3VycmVudC5TRC1JRS1UUkFGRklDLklFLVRSQUZGSUMuTElNSVRFRCIsImllLWN1cnJlbnQuUFNELUlFLUlN" +
	 "QUdFLklFLUlNQUdFLkxJTUlURUQiLCJ1YWEiLCJpZS1jdXJyZW50LlNELUlFLUVOVklST05NRU5UQUwuSUUtRU5WSVJPTk1FTlRBTC5MSU1JVEVEIiwiaWUtY3VycmVudC5TRC1JRS1QRUR" +
	 "FU1RSSUFOLklFLVBFREVTVFJJQU4uTElNSVRFRCIsInNkLmhhY2thdGhvbiJdfQ.QrzYfVOnu9h5NLxcfkMiLChzMhjbS9h-tRNJuO4D-oxjEJFKVArcqn50H2RDRlxV7_UUkT42wbMFu7eSB" +
	 "DrjJiZVbGxdzx6By8tN2fDJiCt2Yu9TcuW5VZGHep9XY4HmyHcZQN-ooGk1chhGw6svp9otIP5tRPZNtO52MPoF2qKUOcIZzfkjiX9tI-TlFW8b1v5g-7-djo9RAWClTtJ8ckwhnS3e76ZWL" +
	 "MF5u9pztpKc2H7La52h_CiNzK58v0X3JIsLW6UYm24MsoDWWp_4i6PkK-fY2hUMtIXriXIJ5Y1dx-rm8YwtJogBK5XKjmpQLJmfGt-LPD84hKvprh1A5A"

	vm.markers = [];
	vm.cities = [];

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

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
        console.log("I was clicked!")
    }

    // get average
    vm.getMonthlyPedestrians = function() {
        var startts = '1523315626342'
        var endts = '1523834026342'
        var eventurl = "https://ic-event-service-sdhack.run.aws-usw02-pr.ice.predix.io/v2"
        var locationId = '9bbdcec9'

        var requestURL = eventurl + '/locations/' + locationId +
         '/events?eventType=PEDEVT&startTime=' +
         startts + '&' + 'endTime=' + endts

        console.log('getting pedestrian data')
        var request = new XMLHttpRequest()
        request.withCredentials = true

        request.open('GET', requestURL, true)
        request.setRequestHeader("Authorization", "Bearer " + vm.token)
        request.setRequestHeader("Predix-Zone-Id", "SD-IE-TRAFFIC")

        //request.setRequestHeader("Access-Control-Allow-Origin", "*");
        //request.setRequestHeader("Access-Control-Allow-Credentials", "true");
        //request.setRequestHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        //request.setRequestHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

        request.responseType = 'json'
        request.send()

        request.onload = function() {
            var pedestrians = request.response;
            console.log(pedestrians)
        }

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