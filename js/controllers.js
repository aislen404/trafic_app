/* Controllers */
'use strict';

var module;

module = angular.module ('trafic_app.controllers',[]);

module.controller('traficCtrl', function ($scope, mapServiceProvider,dataServiceProvider,poiServiceCreator) {

    // initialization of model-view bindings
    $scope.fltr_camaras = true;
    $scope.fltr_paneles = true;
    $scope.fltr_estMeteorologia = false;
    $scope.fltr_sensorTrafico = false;
    $scope.datos;

    // map object
    $scope.mapObj = null;

    // Main function in ng-init
    $scope.BeganToBegin = function (){
        $scope.createMap();
        $scope.initData();

        //no other line of JQuery !!
        $('.dropdown-toggle').dropdown();
    };

    // Control the creation of map
    $scope.createMap = function() {
        $scope.mapObj = mapServiceProvider;

        // Setting map event control for zoom changes
        $scope.mapObj.registerMapEvent('zoom_changed',function(){
            //console.log ('[EVENT] ZOOM:',$scope.mapObj.getZoom());
        });

        //Setting map event control for bounds changes
        $scope.mapObj.registerMapEvent('bounds_changed',function(){
            //console.log ('[EVENT] BOUNDS:',$scope.mapObj.getLatNS(),$scope.mapObj.getLongNS(),$scope.mapObj.getLatSW(),$scope.mapObj.getLongSW());
        });
    };

    // Load DGT service response to the trafic controller model
    $scope.initData = function(){
        $scope.camaras();
        $scope.paneles();
        $scope.meteo();
        $scope.sensor();
    };

    $scope.camaras = function (){
        if($scope.fltr_camaras){
            $scope.loadData('__camaras');
        }
    };
    $scope.paneles = function (){
        if($scope.fltr_paneles){
            $scope.loadData('__paneles');
        }
    };
    $scope.meteo = function (){
        if($scope.fltr_estMeteorologia){
            $scope.loadData('__meteo');
        }
    };
    $scope.sensor = function (){
        if($scope.fltr_sensorTrafico){
            $scope.loadData('__sensores');
        }
    };

    $scope.loadData = function (file){
        //Call data service provider
        $scope.datos= dataServiceProvider.query({file:file} ,function(data) {
            //Call marker service creator
            poiServiceCreator.create(data,$scope.mapObj,file);
        });
    }

    // Control-view checkbox for weather layer
    $scope.meteoToggle = function (){
        mapServiceProvider.weatherToogle();
    };

    // Control-view checkbox for traffic density layer
    $scope.trafficToogle = function (){
        mapServiceProvider.trafficToogle();
    };
});