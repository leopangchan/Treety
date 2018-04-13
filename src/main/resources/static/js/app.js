var app = angular.module('TreeMap',
 ['ngRoute', 'ui.directives', 'ngMap', 'ngMaterial', 'ui.bootstrap'])
    .config(function ($locationProvider, $routeProvider) {
        $routeProvider.otherwise({
            controller: 'TreeMapController',
            templateUrl: 'templates/tree_map.html'
        });
    }
);
