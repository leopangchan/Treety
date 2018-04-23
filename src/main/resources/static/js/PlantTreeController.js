app.controller("PlantTreeController", function($scope, $uibModalInstance, $map, $parentScope, $http) {
  let $ctrl = this;

  $scope.selectedTreeType = "";
  $scope.age = "";
  $scope.email = "";
  $scope.treeTypes = ["Shoestring Acacia",
                      "Deodar Cedar",
                      "Western Redbud",
                      "Crape Myrtle",
                      "Angel’s Trumpet Tree",
                      "Lemon Bottlebrush"];

  let insertTree = function (name, type, age, score, lat, lng, email, local_id) {
    $http({
      method: "POST",
      url: "/tree/insert",
      headers: {
        "cache-control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": -1
      },
      data: [{"name": name,
              "type": type,
              "age": age,
              "score": score,
              "lat": lat,
              "lng": lng,
              "email": email,
              "local_id": local_id}]
    });
  };
  
  let updateTreeScore = function (treeId, score) {
    $http({
      method: "PUT",
      url: "/tree/updateScore?score=" + score + "&treeId=" + treeId,
      headers: {
        "cache-control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": -1
      }
    });
  };

  $ctrl.closestPos = function(locations, coord) {
    let closestPos = undefined;
    let minDis = undefined;

    locations.forEach(function (pos) {
        if (pos) {
            let xDis = Math.abs(Math.pow(parseFloat(pos[0]), 2) - Math.pow(parseFloat(coord[0]), 2));
            let yDis = Math.abs(Math.pow(parseFloat(pos[1]), 2) - Math.pow(parseFloat(coord[1]), 2));
            let dis = Math.sqrt(Math.abs(xDis - yDis));

            if ((minDis === undefined) || (minDis > dis)) {
               minDis = dis;
               closestPos = pos;
            }
        }
    });

    return closestPos[2];
  };

  /* calculates the tree benefit score and formats a marker label */
  $ctrl.format_benefit_score = function(benefits) {
      var i = 0
      var num_benefits = 5
      var label = ""
      var score = 0

      var negative_benefits = ['avg_vehicle_speed','avg_vehicle_count',
       'evapotranspiration']


      for (var key in benefits) {
          if (benefits.hasOwnProperty(key)) {
              label += key+": "+benefits[key].toFixed(2)

              if (i < (num_benefits-1)) {
                  label += "<br/>"
              }


              if (negative_benefits.indexOf(key) < 0) {
                  score += benefits[key]
              }

              else {
                  score -= benefits[key]
              }

              i += 1
          }
      }

      return {'score':score, 'label':label}
  }

  /* extracts sensor coordinates from a json */
  $ctrl.get_coordinates = function(data, key) {
      var locations = data.data['content'];
      res = [];

      locations.forEach(function(element) {
          if (element.hasOwnProperty('coordinates')) {
              var coord = element['coordinates'].split(":");
              res.push([parseFloat(coord[0]), parseFloat(coord[1]), element[key]]);
          }
      });

      return res;
  }

  $ctrl.ok = function () {
    $parentScope.vm.googleMapClickListener = $map.addListener('click', function(point) {
      console.log("treeBenefit = " + $parentScope.vm.treeBenefit);

      let newMarker = new google.maps.Marker({
        position: point.latLng,
        map: $map,
        icon: "../img/small_tree.png"
      });

      $parentScope.vm.markers.push(newMarker);
      //TODO: Update score
      insertTree($scope.name, $scope.selectedTreeType, $scope.age, null, point.latLng.lat(),
          point.latLng.lng(), $scope.email, "null");

      google.maps.event.addListener(newMarker, 'click', function() {
         let metadataurl = 'https://ic-metadata-service-sdhack.run.aws-usw02-pr.ice.predix.io/v2/metadata';
         let coords = [point.latLng.lat(),point.latLng.lng()];

         // find the closest ped sensor
         $http({method: 'GET',
            url: metadataurl + "/locations/search?q=locationType:WALKWAY",
            headers: {
                "Authorization": "Bearer " + config.token,
                "Predix-Zone-Id": 'SD-IE-PEDESTRIAN'
            }
         })
         .then(function(data) {
            return $ctrl.closestPos($ctrl.get_coordinates(data,'locationUid'), coords)
         })
         .then(function(ped_sensor) {
            if (!ped_sensor) {
                ped_sensor = 'a49a96ea';
            }

            // find closest traffic sensor
            $http({method: 'GET',
                url: metadataurl + "/locations/search?q=locationType:TRAFFIC_LANE",
                headers: {
                    "Authorization": "Bearer " + config.token,
                    "Predix-Zone-Id": 'SD-IE-TRAFFIC'
                }
            })
            .then(function(data) {
                return $ctrl.closestPos($ctrl.get_coordinates(data,'locationUid'), coords)
            })
            .then(function(tffc_sensor) {
                if (!tffc_sensor) {
                    tffc_sensor = '9703ebfa';
                }

                // find closest environment sensor
                $http({method: 'GET',
                    url: metadataurl + "/assets/search?q=assetType:ENV_SENSOR",
                    headers: {
                        "Authorization": "Bearer " + config.token,
                        "Predix-Zone-Id": 'SD-IE-TRAFFIC'
                    }
                })
                .then(function(data) {
                    return $ctrl.closestPos($ctrl.get_coordinates(data,'locationUid'), coords)
                })
                .then(function(env_sensor) {
                    if (!env_sensor) {
                        env_sensor = '178ae263-6989-4a2a-8061-0bee0831e9ae';
                    }

                    let url = "/tree/benefit?pedId="+
                        ped_sensor +
                        "&envId=" +
                        env_sensor +
                        "&tffcId="+
                        tffc_sensor;

                    // request tree benefit measurements from the backend
                    $http({
                        method: 'GET',
                        url: url
                    })
                    .then(function (benefits) { // get the data
                        // default benefit value
                        if (benefits.data.length <= 0) {
                            benefits.data = [{
                                "avg_vehicle_speed": 9.531113641699987,
                                "avg_vehicle_count": 0.865,
                                "avg_pedestrian_count": 0.331,
                                "evapotranspiration": 9.187324184517111,
                                "carbon_reduction": 91.58621146017899
                            }]
                        }

                        console.log(benefits.data[0])
                        res = $ctrl.format_benefit_score(benefits.data[0]);

                        new google.maps.InfoWindow({
                          content: "Tree benefit = " + res['score'].toFixed(2) + "<br/>" + res['label']
                        }).open($map, newMarker);
                    });
                })
            })
         })
      });
    });

    $parentScope.vm.isPlantingTree = true;
    $uibModalInstance.dismiss('cancel');
  };


  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});