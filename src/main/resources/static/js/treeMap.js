
app.controller("TreeMapController", function($compile, $scope, $http, NgMap, callAjaxFactory){
	
	var vm = this;
	
	vm.markers = [];
	vm.cities = [];

      vm.CrimeloadChart = function() {
      console.log("Load Chart");
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(this.drawCrimeChart);
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
                      var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
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

       var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
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

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
        console.log("Crime: I was clicked!")
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

              var chart = new google.visualization.PieChart(document.getElementById('piechart'));

              chart.draw(data, options);
              console.log("Crime: I was clicked!")
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