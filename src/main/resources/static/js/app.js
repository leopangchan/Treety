let app = angular.module('TreeMap',
 ['ngRoute', 'ui.directives', 'ngMap', 'ngMaterial', 'ui.bootstrap'])
    .config(function ($locationProvider, $routeProvider) {
        $routeProvider.otherwise({
            controller: 'TreeMapController',
            templateUrl: 'templates/tree_map.html'
        });
    }
);

app.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.get = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
});
