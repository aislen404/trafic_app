/* Controllers */
(function () {
    'use strict';

    var module;

    module = angular.module ('trafic_app.controllers',[]);

    module.controller('traficCtrl', function ($scope, mapServiceProvider,dgtServiceProvider,markServiceProvider) {

        $scope.mapObj;
        $scope.datos;

        // Main function in ng-init
        $scope.BeganToBegin = function (){
            $scope.createMap();
            $scope.getDatos();
            $scope.setDgtMarks();

            $('.dropdown-toggle').dropdown();
        }

        // Control the Creation of Map
        $scope.createMap = function() {
            $scope.mapObj = mapServiceProvider;
            console.log ('reponse de mapServiceProvider: ',$scope.mapObj);
        }

        // Load DGT service response to the trafic controller model
        $scope.getDatos = function(){
            $scope.datos = dgtServiceProvider.query();
            console.log ('response de dgtServiceProvider.query(): ',$scope.datos);
        }

        //Control the Creation of marks in the Map
        $scope.setDgtMarks = function(){

            var i=0;
            var lat,lng,ico,title;

            while(i<=$scope.datos.length-1){
             lat=$scope.datos.lat;
             lng=$scope.datos.lng;
             ico = [$scope.datos[i].tipo,$scope.datos[i].tipoInci];
             title = $scope.datos[i].tipo+" : "+ $scope.datos[i].alias;

             i++;
            }

            console.log ('response de setDgtMarks: ',markServiceProvider);
        }

        // Control Checkbox for Weather Layer
        $scope.meteoToggle = function (){
            mapServiceProvider.weatherToogle();
            console.log('response de mapServiceProvider.weatherToogle(): ');
        }

        // Control Checkbox for Traffic Density Layer
        $scope.trafficToogle = function (){
            mapServiceProvider.trafficToogle();
            console.log('response de mapServiceProvider.trafficToogle(): ');
        }

    });

}).call(this);
