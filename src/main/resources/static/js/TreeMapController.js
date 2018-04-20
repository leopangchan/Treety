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
    vm.treeBenefit = undefined

    vm.toggleHeatmap = function(event) {
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
            vm.map.panTo(vm.marker)
        }
      }, 3000)
    }

    /* change center when user clicks on marker */
    vm.markerClicked = function(marker) {

        if (marker) {
            vm.map.setCenter(marker.getPosition())
            vm.marker = marker.getPosition()
            vm.map.setZoom(16)
        }

        vm.get_tree_benefit(marker)
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
    vm.get_tree_benefit = function(newMarker) {
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
                    .then(function (benefits) { // get the data
                        console.log('TREE BENEFITS')
                        console.log(benefits.data[0])
                        vm.treeBenefit = benefits.data[0]

                        var score = 0

                        for (var key in benefits.data[0]) {
                            if (benefits.data[0].hasOwnProperty(key)) {
                                score += benefits.data[0][key]
                            }
                        }

                        new google.maps.InfoWindow({
                          content: "Tree benefit = " + score.toFixed(2)
                        }).open(vm.map, newMarker)
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
        vm.locationPos = [[32.71375594, -117.16810915], [32.71497082, -117.15003429],
        [32.71307246, -117.15189225], [32.72552396, -117.16240669], [32.71167202, -117.15030701],
        [32.71823226, -117.15079255], [32.71193698, -117.15568149], [32.71752808, -117.15159649],
        [32.71383252, -117.16592375], [32.72208209, -117.15390776], [32.70876973, -117.16058296],
        [32.71692875, -117.17196371], [32.70601003, -117.1564232], [32.70816054, -117.16380988],
        [32.72042531, -117.16675222], [32.70505725, -117.16215597],
        [32.71994916, -117.15757904], [32.70983255, -117.16118476],
        [32.72036971, -117.16434272], [32.72281502, -117.16821282]]

        /* map functions */
        NgMap.getMap().then(function(map) {
              vm.map = map
              heatmap = map.heatmapLayers.foo
              heatmap.setMap(null)

              if (map.markers) {
                vm.marker = map.markers[0].getPosition()
              }

              vm.locationPos.forEach(function(point) {
                  console.log(point)
                  var newMarker = new google.maps.Marker({
                      position: {lat: point[0], lng: point[1]},
                      map: vm.map,
                      icon: "../img/small_tree.png"
                  });

                  google.maps.event.addListener(newMarker,'click', function() {
                      vm.markerClicked(newMarker)
                  })
              })
        })
    }
});
