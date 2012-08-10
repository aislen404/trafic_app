/* Controllers */
'use strict';

var module;

module = angular.module ('trafic_app.controllers',[]);

module.controller('traficCtrl', function ($scope, mapServiceProvider,dgtServiceProvider) {

    // initialization of model-view bindings
    $scope.fltr_camaras = true;
    $scope.fltr_paneles = true;
    $scope.fltr_estMeteorologia = false;
    $scope.fltr_sensorTrafico = false;

    // map object
    $scope.mapObj = null;

    // Main function in ng-init
    $scope.BeganToBegin = function (){
        $scope.createMap();
        $scope.getDatos();

        //no other line of JQuery !!
        $('.dropdown-toggle').dropdown();
    };

    // Control the creation of map
    $scope.createMap = function() {
        $scope.mapObj = mapServiceProvider;

        // Setting map event control for zoom changes
        $scope.mapObj.registerMapEvent('zoom_changed',function(){
            //console.log ('[EVENT] ON ZOOM CHANGE --> ',$scope.mapObj.getZoom());
        });

        //Setting map event control for bounds changes
        $scope.mapObj.registerMapEvent('bounds_changed',function(){
            //console.log ('[EVENT] ON BOUNDS CHANGE --> ',$scope.mapObj.getLatNS(),$scope.mapObj.getLongNS(),$scope.mapObj.getLatSW(),$scope.mapObj.getLongSW());
        });
    };

    // Load DGT service response to the trafic controller model
    $scope.getDatos = function(){

        //Array for filter in model-view bindings
        var filtros =[];

        //Setting filter in the array
        if($scope.fltr_camaras){filtros.push('Camara');}
        if($scope.fltr_paneles){filtros.push('Panel_CMS');filtros.push('Panel_PSG');}
        if($scope.fltr_estMeteorologia){filtros.push('SensorMeteorologico');}
        if($scope.fltr_sensorTrafico){filtros.push('SensorTrafico');}

        //Call data service provider
        dgtServiceProvider.call($scope.mapObj,filtros);
    };

    // Control-view checkbox for weather layer
    $scope.meteoToggle = function (){
        mapServiceProvider.weatherToogle();
    };

    // Control-view checkbox for traffic density layer
    $scope.trafficToogle = function (){
        mapServiceProvider.trafficToogle();
    };
});