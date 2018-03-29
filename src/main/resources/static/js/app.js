angular.module('TreeMap', ['ngRoute', 'ui.directives']).
    config(function ($locationProvider, $routeProvider) {
        $routeProvider.otherwise({
            controller: 'TreeMapController',
            templateUrl: 'templates/tree_map.html'
        });
    }
);
