/* App Module */
(function () {

    'use strict';

    var app ;

    app = angular.module ('trafic_app', ['trafic_app.filters','trafic_app.services','trafic_app.directives','trafic_app.controllers']);

    app.config ( function ($routeProvider) {
        return $routeProvider.otherwise({redirectTo: '/'});
    });

    app.run (function ($rootScope){
        $('.dropdown-toggle').dropdown();
        $('#myModal').hide();
        return true;

    });

}).call(this);

