app.controller("TreeMapController",
 function($scope, $http, $timeout, NgMap, $mdDialog, $uibModal, $log, $document){
	
        var vm = this
        var heatmap = null
        vm.token = config.token
        vm.user_coords = null
        vm.showMarkers = true
        vm.locationPos = []

    /* open dialog for planting a new tree */
    vm.newTree = function($event) {
      var modalInstance = $uibModal.open({
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: '../templates/plant.tree.dialog.html',
        backdrop: false,
        controller: "PlantTreeController",
        controllerAs: '$ctrl',
        size: 'md',
        resolve: {
          items: function () {
            return undefined
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        //$ctrl.selected = selectedItem;
      }, function (error) {
        $log.info('Modal dismissed at: ' + new Date());
        $log.info(error);
      });
    }

    /* map functions */
    NgMap.getMap().then(function(map) {
      vm.map = map
      heatmap = map.heatmapLayers.foo
      heatmap.setMap(null)

      if (map.markers) {
        vm.marker = map.markers[0].getPosition()
      }
    })

    vm.toggleHeatmap= function(event) {
        console.log('Toggle heatmap')
        heatmap.setMap(heatmap.getMap() ? null : vm.map);
    };

    vm.toggleMarkers = function() {
        console.log('Toggle markers')
        vm.showMarkers = !vm.showMarkers
    }

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

    /* zoom into user coordinates */
    vm.getpos = function(event) {
        console.log('USER LOCATION ' + event.latLng)
        // update user location
        vm.user_coords = [event.latLng.lat(), event.latLng.lng()]

        // zoom to their location
        vm.map.setCenter(event.latLng)
        vm.marker = event.latLng
        vm.map.setZoom(16);
    };

    // get coordinates for all city sensors
    vm.getLocations = function(type) {
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
                //"Access-Control-Allow-Origin": "http://localhost:8090"
                //"Access-Control-Allow-Credentials": "true",
                //"Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
                //"Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, " +
                //"Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
            }
        }

        return $http(req)
         .then(function(data) {
            var locations = data.data['content']
            locations.forEach(function(element) {
                if (element.hasOwnProperty('coordinates')) {
                    var coord = element['coordinates'].split(":")
                    vm.locationPos.push([parseFloat(coord[0]), parseFloat(coord[1])])
                }
            })
         })
    }

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
    vm.getClosestSensor = function(locations, coord) {
      var closestPos = undefined;
      locations.forEach(function (pos) {
        let xDis = Math.abs(Math.pow(pos[0], 2) - Math.pow(coord[0], 2))
        let yDis = Math.abs(Math.pow(pos[1], 2) - Math.pow(coord[1], 2))
        closestPos = closestPos === undefined || closestPos > Math.sqrt(Math.abs(xDis - yDis)) ? pos : closestPos
      });

      return closestPos[2]
    };

    vm.loadChart = function (chartType) {
      var modalInstance = $uibModal.open({
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: '../templates/chart.dialog.html',
        backdrop: false,
        controller: "ChartController",
        controllerAs: '$ctrl',
        size: 'lg',
        resolve: {
          $chartType: function() {
            return chartType
          },
          $lglat: function() {
            return vm.user_coords
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
      }, function (error) {
        $log.info('Modal dismissed at: ' + new Date());
        $log.info(error);
      });
    };

    vm.init = function() {
        vm.getLocations('TRAFFIC_LANE');
    }
});
