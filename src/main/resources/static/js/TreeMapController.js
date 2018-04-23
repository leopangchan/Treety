app.controller("TreeMapController",
        function ($scope, $http, $timeout, NgMap, $mdDialog, $uibModal, $log, $document) {

            var vm = this
            var heatmap = null
            vm.map = null
            vm.token = config.token
            vm.user_coords = [32.7157, -117.1611]
            vm.locationPos = []
            vm.markers = []
            vm.showMarkers = true
            vm.showHeatmap = false
            vm.isPlantingTree = false
            vm.googleMapClickListener = undefined
            vm.treeBenefit = undefined

            vm.toggleHeatmap = function (event) {
                vm.showHeatmap = !vm.showHeatmap
            };

            vm.toggleMarkers = function () {
                console.log('Toggle markers')
                vm.showMarkers = !vm.showMarkers
                mapValue = vm.showMarkers ? vm.map : null

                for (var i = 0; i < vm.markers.length; i++) {
                    vm.markers[i].setMap(mapValue);
                }
            }

            /* zoom to center when user clicked on a marker */
            vm.centerChanged = function (event) {
                $timeout(function () {
                    if (vm.marker) {
                        vm.map.panTo(vm.marker)
                    }
                }, 3000)
            }

            /* change center when user clicks on marker */
            vm.markerClicked = function (marker) {

                if (marker) {
                    vm.map.setCenter(marker.getPosition())
                    vm.marker = marker.getPosition()
                    vm.map.setZoom(16)
                }

                vm.get_tree_benefit(marker)
            }

            /* zoom into user coordinates */
            vm.getpos = function (event) {
                console.log('USER LOCATION ' + event.latLng)
                // update user location
                vm.user_coords = [event.latLng.lat(), event.latLng.lng()]

                // zoom to their location
                vm.map.setCenter(event.latLng)
                vm.marker = event.latLng
                vm.map.setZoom(16);
            };

            /* calculates the tree benefit score and formats a marker label */
            vm.format_benefit_score = function (benefits) {
                var i = 0
                var num_benefits = 5
                var label = ""
                var score = 0

                var negative_benefits = ['avg_vehicle_speed', 'avg_vehicle_count',
                    'evapotranspiration']


                for (var key in benefits) {
                    if (benefits.hasOwnProperty(key)) {
                        label += key + ": " + benefits[key].toFixed(2)

                        if (i < (num_benefits - 1)) {
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

                return {'score': score, 'label': label}
            }

            /* extracts sensor coordinates from a json */
            vm.get_coordinates = function (data, key) {
                var locations = data.data['content'];
                res = [];

                locations.forEach(function (element) {
                    if (element.hasOwnProperty('coordinates')) {
                        var coord = element['coordinates'].split(":");
                        res.push([parseFloat(coord[0]), parseFloat(coord[1]), element[key]]);
                    }
                });

                return res;
            }

            /**
             *  write a function that takes in a coordinate [lat, long]
             * and list of coordinates to return the closest sensor in the list.
             *
             *  @param coord - [32.708757321722075, -117.16414366466401]
             *  @param locations = [[32.708757321722075, -117.16414366466401, sensorId]]
             *  @return the sensor id of the closest sensor
             *
             *  sqrt((x1^2 - x2^2)^2 + (y1^2 - y2^2)^2)
             */
            vm.closestPos = function (locations, coord) {
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

                return closestPos[2]
            }

            /* return tree benefit score from the backend */
            vm.get_tree_benefit = function (newMarker) {
                var coords = [newMarker.getPosition().lat(), newMarker.getPosition().lng()]

                var metadataurl = 'https://ic-metadata-service-sdhack.run.aws-usw02-pr.ice.predix.io/v2/metadata'
                var asseturl = "/assets/search?q=assetType:"
                var params = "&page=0&size=200"

                // find the closest ped sensor
                $http({
                    method: 'GET',
                    url: metadataurl + "/locations/search?q=locationType:WALKWAY" + params,
                    headers: {
                        "Authorization": "Bearer " + vm.token,
                        "Predix-Zone-Id": 'SD-IE-PEDESTRIAN'
                    }
                })
                        .then(function (data) {
                            return vm.closestPos(vm.get_coordinates(data, 'locationUid'), coords)
                        })
                        .then(function (ped_sensor) {
                            // if no closest sensor could be found use this default
                            if (!ped_sensor) {
                                ped_sensor = 'a49a96ea';
                            }

                            // find closest traffic sensor
                            $http({
                                method: 'GET',
                                url: metadataurl + "/locations/search?q=locationType:TRAFFIC_LANE" + params,
                                headers: {
                                    "Authorization": "Bearer " + vm.token,
                                    "Predix-Zone-Id": 'SD-IE-TRAFFIC'
                                }
                            })
                                    .then(function (data) {
                                        return vm.closestPos(vm.get_coordinates(data, 'locationUid'), coords)
                                    })
                                    .then(function (tffc_sensor) {
                                        // find closest environment sensor
                                        $http({
                                            method: 'GET',
                                            url: metadataurl + asseturl + "ENV_SENSOR" + params,
                                            headers: {
                                                "Authorization": "Bearer " + vm.token,
                                                "Predix-Zone-Id": 'SD-IE-TRAFFIC'
                                            }
                                        })
                                                .then(function (data) {
                                                    return vm.closestPos(vm.get_coordinates(data, 'assetUid'), coords)
                                                })
                                                .then(function (env_sensor) {
                                                    console.log('CLOSEST TRAFFIC SENSOR ' + tffc_sensor)
                                                    console.log('PED SENSOR LOCATION ' + ped_sensor)
                                                    console.log('ENV SENSOR LOCATION ' + env_sensor)

                                                    // request tree benefit measurements from the backend
                                                    $http({
                                                        method: 'GET',
                                                        url: "/tree/benefit?pedId=" + ped_sensor + "&envId=" + env_sensor + "&tffcId=" + tffc_sensor
                                                    })
                                                            .then(function (benefits) { // get the data
                                                                console.log('TREE BENEFITS')
                                                                console.log(benefits.data[0])

                                                                res = vm.format_benefit_score(benefits.data[0])

                                                                new google.maps.InfoWindow({
                                                                    content: "Tree benefit = " + res['score'].toFixed(2) + "<br/>" + res['label']
                                                                }).open(vm.map, newMarker)
                                                            })
                                                })

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
                        $chartType: function () {
                            return chartType
                        },
                        $lglat: function () {
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
             * Hide the putting maker button, and show the planting tree button.
             * Unregister the click event listener from the google map api.
             * */
            vm.stopPlantingTree = function () {
                vm.isPlantingTree = false;
                console.log("stop listener = " + vm.googleMapClickListener);
                google.maps.event.removeListener(vm.googleMapClickListener);
            };

            /* open dialog for planting a new tree */
            vm.newTree = function ($event) {
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
            };

            vm.init = function () {
                vm.locationPos = [[32.71375594, -117.16810915], [32.71497082, -117.15003429],
                    [32.71307246, -117.15189225], [32.72552396, -117.16240669], [32.71167202, -117.15030701],
                    [32.71823226, -117.15079255], [32.71193698, -117.15568149], [32.71752808, -117.15159649],
                    [32.71383252, -117.16592375], [32.72208209, -117.15390776], [32.70876973, -117.16058296],
                    [32.71692875, -117.17196371], [32.70601003, -117.1564232], [32.70816054, -117.16380988],
                    [32.72042531, -117.16675222], [32.70505725, -117.16215597],
                    [32.71994916, -117.15757904], [32.70983255, -117.16118476],
                    [32.72036971, -117.16434272], [32.72281502, -117.16821282]]

                /* map functions */
                NgMap.getMap().then(function (map) {
                    vm.map = map

                    if (map.heatmapLayers) {
                        heatmap = map.heatmapLayers.foo
                        heatmap.setMap(null)
                    }

                    vm.locationPos.forEach(function (point) {

                        var newMarker = new google.maps.Marker({
                            position: {lat: point[0], lng: point[1]},
                            map: vm.map,
                            icon: "../img/small_tree.png"
                        });

                        vm.markers.push(newMarker)

                        google.maps.event.addListener(newMarker, 'click', function () {
                            vm.markerClicked(newMarker)
                        })
                    })
                })
            }
        });
