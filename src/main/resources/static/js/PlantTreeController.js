app.controller("PlantTreeController", function ($scope, $uibModalInstance, $map, $parentScope, $http) {
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
            data: [{
                "name": name,
                "type": type,
                "age": age,
                "score": score,
                "lat": lat,
                "lng": lng,
                "email": email,
                "local_id": local_id
            }]
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

    $ctrl.closestPos = function (locations, coord) {
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

        if (closestPos === undefined) {
            return 'a49a96ea';
        }

        return closestPos[2];
    };

    $ctrl.ok = function () {
        $parentScope.vm.googleMapClickListener = $map.addListener('click', function (point) {
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

            google.maps.event.addListener(newMarker, 'click', function () {
                let metadataurl = 'https://ic-metadata-service-sdhack.run.aws-usw02-pr.ice.predix.io/v2/metadata';
                let user_coords = [point.latLng.lat(), point.latLng.lng()];

                // find the closest ped sensor
                $http({
                    method: 'GET',
                    url: metadataurl + "/locations/search?q=locationType:WALKWAY",
                    headers: {
                        "Authorization": "Bearer " + config.token,
                        "Predix-Zone-Id": 'SD-IE-PEDESTRIAN'
                    }
                })
                        .then(function (data) {
                            let locations = data.data['content'];
                            res = [];

                            locations.forEach(function (element) {
                                if (element.hasOwnProperty('coordinates')) {
                                    let coord = element['coordinates'].split(":");
                                    res.push([parseFloat(coord[0]), parseFloat(coord[1]), element['locationUid']])
                                }
                            });

                            return $ctrl.closestPos(res, user_coords)
                        })
                        .then(function (ped_sensor) {
                            // find closest traffic sensor
                            $http({
                                method: 'GET',
                                url: metadataurl + "/locations/search?q=locationType:TRAFFIC_LANE",
                                headers: {
                                    "Authorization": "Bearer " + config.token,
                                    "Predix-Zone-Id": 'SD-IE-TRAFFIC'
                                }
                            })
                                    .then(function (data) {
                                        let locations = data.data['content'];
                                        res = [];

                                        locations.forEach(function (element) {
                                            if (element.hasOwnProperty('coordinates')) {
                                                let coord = element['coordinates'].split(":");
                                                res.push([parseFloat(coord[0]), parseFloat(coord[1]), element['locationUid']])
                                            }
                                        });

                                        return $ctrl.closestPos(res, user_coords)
                                    })
                                    .then(function (tffc_sensor) {
                                        // find closest environment sensor
                                        $http({
                                            method: 'GET',
                                            url: metadataurl + "/assets/search?q=assetType:ENV_SENSOR",
                                            headers: {
                                                "Authorization": "Bearer " + config.token,
                                                "Predix-Zone-Id": 'SD-IE-TRAFFIC'
                                            }
                                        })
                                                .then(function (data) {
                                                    var locations = data.data['content']
                                                    res = []

                                                    locations.forEach(function (element) {
                                                        if (element.hasOwnProperty('coordinates')) {
                                                            var coord = element['coordinates'].split(":")
                                                            res.push([parseFloat(coord[0]), parseFloat(coord[1]), element["assetUid"]])
                                                        }
                                                    })

                                                    return $ctrl.closestPos(res, user_coords)
                                                })
                                                .then(function (env_sensor) {
                                                    console.log('CLOSEST TRAFFIC SENSOR ' + tffc_sensor);
                                                    console.log('PED SENSOR LOCATION ' + ped_sensor);
                                                    console.log('ENV SENSOR LOCATION ' + env_sensor);

                                                    let url = "/tree/benefit?pedId=" +
                                                            ped_sensor +
                                                            "&envId=" +
                                                            env_sensor +
                                                            "&tffcId=" +
                                                            tffc_sensor;

                                                    console.log(url);

                                                    // request tree benefit measurements from the backend
                                                    $http({
                                                        method: 'GET',
                                                        url: url
                                                    })
                                                            .then(function (benefits) { // get the data
                                                                console.log('TREE BENEFITS');
                                                                console.log(benefits.data[0]);

                                                                let label = "";
                                                                let score = 0;
                                                                let i = 0;
                                                                let num_benefits = 5;
                                                                let negative_benefits = ['avg_vehicle_speed', 'avg_vehicle_count',
                                                                    'evapotranspiration'];

                                                                for (let key in benefits.data[0]) {

                                                                    label += key + ": " + benefits.data[0][key].toFixed(2);

                                                                    if (benefits.data[0].hasOwnProperty(key) && i < (num_benefits - 1)) {
                                                                        label += "<br/>"
                                                                    }

                                                                    if (negative_benefits.indexOf(key) < 0) {
                                                                        score += benefits.data[0][key]
                                                                    }

                                                                    else {
                                                                        score -= benefits.data[0][key]
                                                                    }

                                                                    i += 1
                                                                }

                                                                console.log(label)
                                                                new google.maps.InfoWindow({
                                                                    content: "Tree benefit = " + score.toFixed(2) + "<br/>" + label
                                                                }).open($map, newMarker)

                                                                return score;
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