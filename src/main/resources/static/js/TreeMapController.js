app.controller("TreeMapController",
 function($scope, $http, $timeout, NgMap, $mdDialog, $uibModal, $log, $document){
	
    var vm = this
    var heatmap = null
    vm.token = config.token
    vm.user_coords = [32.7157, -117.1611]
    vm.locationPos = []
    vm.showMarkers = true
    vm.isPlantingTree = false
    vm.googleMapClickListener = undefined

    /* map functions */
    NgMap.getMap().then(function(map) {
      vm.map = map
      heatmap = map.heatmapLayers.foo
      heatmap.setMap(null)
      //heatmap.set('radius', 10)
      //heatmap.set('maxIntensity', 0)
      heatmap.set('dissipate', true)

      if (map.markers) {
        vm.marker = map.markers[0].getPosition()
      }
    })

    vm.toggleHeatmap = function(event) {
        console.log('Toggle heatmap')
        heatmap.setMap(heatmap.getMap() ? null : vm.map);
        //heatmap.set('maxIntensity', 0)
        heatmap.set('dissipate', true)
    };

    vm.toggleMarkers = function() {
        console.log('Toggle markers')
        vm.showMarkers = !vm.showMarkers
    }

    /* zoom to center when user clicked on a marker */
    vm.centerChanged = function(event) {
      $timeout(function() {
        if (vm.marker) {
            vm.map.panTo(vm.marker)
        }
      }, 3000)
    }

    /* change center when user clicks on marker */
    vm.markerClicked = function(event, pos) {
        var marker = vm.map.markers[vm.locationPos.indexOf(pos)]

        if (pos) {
            vm.map.setCenter(marker.getPosition())
            vm.marker = marker.getPosition()
            vm.map.setZoom(16)
        }

        vm.get_tree_benefit()
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

    // return tree benefit score from the backend
    vm.get_tree_benefit = function() {
        var metadataurl = 'https://ic-metadata-service-sdhack.run.aws-usw02-pr.ice.predix.io/v2/metadata'

         // find the closest ped sensor
         $http({method: 'GET',
            url: metadataurl + "/locations/search?q=locationType:WALKWAY",
            headers: {
                "Authorization": "Bearer " + vm.token,
                "Predix-Zone-Id": 'SD-IE-PEDESTRIAN'
            }
         })
         .then(function(data) {
            var locations = data.data['content']
            res = []

            locations.forEach(function(element) {
                if (element.hasOwnProperty('coordinates')) {
                    var coord = element['coordinates'].split(":")
                    res.push([parseFloat(coord[0]), parseFloat(coord[1]), element['locationUid']])
                }
            })

            return vm.closestPos(res, vm.user_coords)
         })
         .then(function(ped_sensor) {
            // find closest traffic sensor
            $http({method: 'GET',
                url: metadataurl + "/locations/search?q=locationType:TRAFFIC_LANE",
                headers: {
                    "Authorization": "Bearer " + vm.token,
                    "Predix-Zone-Id": 'SD-IE-TRAFFIC'
                }
            })
            .then(function(data) {
                var locations = data.data['content']
                res = []

                locations.forEach(function(element) {
                   if (element.hasOwnProperty('coordinates')) {
                       var coord = element['coordinates'].split(":")
                       res.push([parseFloat(coord[0]), parseFloat(coord[1]), element['locationUid']])
                   }
                })

                return vm.closestPos(res, vm.user_coords)
            })
            .then(function(tffc_sensor) {
                // find closest environment sensor
                $http({method: 'GET',
                    url: metadataurl + "/assets/search?q=assetType:ENV_SENSOR",
                    headers: {
                        "Authorization": "Bearer " + vm.token,
                        "Predix-Zone-Id": 'SD-IE-TRAFFIC'
                    }
                })
                .then(function(data) {
                    var locations = data.data['content']
                    res = []

                    locations.forEach(function(element) {
                       if (element.hasOwnProperty('coordinates')) {
                           var coord = element['coordinates'].split(":")
                           res.push([parseFloat(coord[0]), parseFloat(coord[1]), element["assetUid"]])
                       }
                    })

                    return vm.closestPos(res, vm.user_coords)
                })
                .then(function(env_sensor) {
                    console.log('CLOSEST TRAFFIC SENSOR ' + tffc_sensor)
                    console.log('PED SENSOR LOCATION ' + ped_sensor)
                    console.log('ENV SENSOR LOCATION ' + env_sensor)

                    var url = "/tree/benefit?pedId="+
                        ped_sensor +
                        "&envId=" +
                        env_sensor +
                        "&tffcId="+
                        tffc_sensor

                    console.log(url)

                    // request tree benefit measurements from the backend
                    $http({
                        method: 'GET',
                        url: url
                    })
                    .then(function (value) { // get the data
                        console.log('TREE BENEFITS')
                        console.log(value)
                    })
                })

            })
         })
    }

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
    vm.closestPos = function(locations, coord) {
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

    /**
     * Hide the putting maker button, and show the planting tree button.
     * Unregister the click event listener from the google map api.
     * */
    vm.stopPlantingTree = function(){
      vm.isPlantingTree = false;
      console.log("stop listener = " + vm.googleMapClickListener);
      google.maps.event.removeListener(vm.googleMapClickListener);
    };

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
         $map: function () {
           return vm.map;
         },
         $parentScope: function () {
           return $scope;
         }
        }
      });

      modalInstance.result.then(function (googleMapClickListener) {
        vm.googleMapClickListener = googleMapClickListener;
        console.log("googleMapClickListener = " + googleMapClickListener);
      }, function (error) {
        $log.info('Modal dismissed at: ' + new Date());
        $log.info(error);
      });

      vm.isPlantingTree = true;
    };

    vm.init = function() {
        vm.getLocations('TRAFFIC_LANE');
    }
});
