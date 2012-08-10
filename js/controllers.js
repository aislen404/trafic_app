/* Controllers */
(function () {
    'use strict';

    var module;

    module = angular.module ('trafic_app.controllers',[]);

    module.controller('traficCtrl', function ($scope, mapServiceProvider,dgtServiceProvider) {

        // initialization of model bindings
        $scope.fltr_camaras = true;
        $scope.fltr_paneles = true;
        $scope.fltr_estMeteorologia = false;
        $scope.fltr_sensorTrafico = false;

        $scope.mapObj = null;

        // Main function in ng-init
        $scope.BeganToBegin = function (){
            $scope.createMap();
            $scope.getDatos();

            $('.dropdown-toggle').dropdown();
        }

        // Control the Creation of Map
        $scope.createMap = function() {
            $scope.mapObj = mapServiceProvider;

            // Setting map event control for zoom changes
            $scope.mapObj.registerMapEvent('zoom_changed',function(){

                console.log ('[EVENT] ON ZOOM CHANGE --> ',$scope.mapObj.getZoom());
            });

            //Setting map event control for bounds changes
            $scope.mapObj.registerMapEvent('bounds_changed',function(){

                console.log ('[EVENT] ON BOUNDS CHANGE --> ',$scope.mapObj.getLatNS(),$scope.mapObj.getLongNS(),$scope.mapObj.getLatSW(),$scope.mapObj.getLongSW());            });

        }

        // Load DGT service response to the trafic controller model
        $scope.getDatos = function(){
            var filtros =[];

            if($scope.fltr_camaras){filtros.push('Camara');};
            if($scope.fltr_paneles){filtros.push('Panel_CMS');filtros.push('Panel_PSG');};
            if($scope.fltr_estMeteorologia){filtros.push('SensorMeteorologico');};
            if($scope.fltr_sensorTrafico){filtros.push('SensorTrafico');};

            dgtServiceProvider.call($scope.mapObj,filtros);
        }

        // Control Checkbox for Weather Layer
        $scope.meteoToggle = function (){
            mapServiceProvider.weatherToogle();
        }

        // Control Checkbox for Traffic Density Layer
        $scope.trafficToogle = function (){
            mapServiceProvider.trafficToogle();
        }
    });

}).call(this);
