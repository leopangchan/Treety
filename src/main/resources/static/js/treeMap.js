
app.controller("TreeMapController", function($compile, $scope, $http, NgMap, callAjaxFactory){
	
	var vm = this;
	
	vm.markers = [];
	vm.cities = [];
	
	
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