app.controller("PlantTreeController", function($scope, $uibModalInstance, $map, $parentScope) {
  var $ctrl = this;

  $scope.type = "";
  $scope.age = "";
  $scope.email = "";

  $ctrl.ok = function () {
    //console.log($scope.type + ", " + $scope.age + ", " + $scope.email);
    $parentScope.vm.googleMapClickListener = $map.addListener('click', function(point) {

      var newMarker = new google.maps.Marker({
        position: point.latLng,
        map: $map,
        icon: "../img/small_tree.png"
      });

      google.maps.event.addListener(newMarker,'click',function() {
        new google.maps.InfoWindow({
          content:"Hello World!"
        }).open($map, newMarker);
      });

      /**
       * Store the marker in the database
       * */
    });



    $uibModalInstance.dismiss('cancel');
  };


  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});