/* Controllers */
(function () {
    'use strict';

    var module;

    module = angular.module ('trafic_app.controllers',[]);

    module.controller('traficCtrl', function ($scope, mapServiceProvider,dgtServiceProvider,addPoisDGT) {

        $scope.mapObj;
        $scope.datos;

        $scope.BeganToBegin = function (){
            $scope.createMap();
            $scope.getDatos();
            $scope.setDgtMarks();

            $('.dropdown-toggle').dropdown();
        }

        $scope.createMap = function() {
            $scope.mapObj = mapServiceProvider;
            console.log ('reponse de mapServiceProvider: ',$scope.mapObj);
        }

        $scope.getDatos = function(){
            $scope.datos = dgtServiceProvider.query();
            console.log ('response de dgtServiceProvider.query(): ',$scope.datos);
        }

        $scope.setDgtMarks = function(){
            console.log ('response de setDgtMarks: ',addPoisDGT);
        }

        $scope.meteoToggle = function (){
            mapServiceProvider.weatherToogle();
            console.log('response de mapServiceProvider.weatherToogle(): ');
        }

        $scope.trafficToogle = function (){
            mapServiceProvider.trafficToogle();
            console.log('response de mapServiceProvider.trafficToogle(): ');
        }

    });

}).call(this);
