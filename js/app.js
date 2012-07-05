'use strict';

/* App Module */
angular.module('trafic_app', ['traficFilters']).
    config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
}]);
