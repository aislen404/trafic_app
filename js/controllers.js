/* Controllers */
'use strict';

var module;

module = angular.module ('trafic_app.controllers',[]);

module.controller('traficCtrl', function ($scope, mapServiceProvider,dataServiceProvider,poiServiceCreator) {

    // initialization of model-view bindings
    $scope.fltr_camaras = true;
    $scope.fltr_paneles = true;
    $scope.fltr_estMeteorologia = true;
    $scope.fltr_sensorTrafico = true;
    $scope.fltr_meteo = true;
    $scope.fltr_trafico = true;


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
    //TODO: meter a fltr_meteo y fltr_camera

    $scope.initData = function(){
        $scope.camarasToogle();
        $scope.panelesToogle();
        $scope.estMeteoToogle();
        $scope.sensoresToogle();
        $scope.meteoToggle();
        $scope.trafficToogle();
    };

    $scope.camarasToogle = function (){
        if($scope.fltr_camaras){
            var file = '__camaras';
            $scope.datos= dataServiceProvider.query({file:file} ,function(data) {
                $scope.camerasCluster = poiServiceCreator.createCamerasCluster(data,$scope.mapObj);
                return data;
            });
        }else{
            try { $scope.camerasCluster.clearMarkers();}catch(e){console.log('No cameras initialized true')}
        }
    };

    $scope.panelesToogle = function (){
        if($scope.fltr_paneles){
            var file = '__paneles';
            $scope.datos= dataServiceProvider.query({file:file} ,function(data) {
                $scope.panelsCluster = poiServiceCreator.createPanelsCluster(data,$scope.mapObj);
                return data;
            });
        }else{
            try { $scope.panelsCluster.clearMarkers();}catch(e){console.log('No panels initialized true')}
        }
    };

    $scope.estMeteoToogle = function (){
        if($scope.fltr_estMeteorologia){
            var file = '__meteo';
            $scope.datos= dataServiceProvider.query({file:file} ,function(data) {
                $scope.meteoCluster = poiServiceCreator.createMeteoCluster(data,$scope.mapObj);
                return data;
            });
        }else{
            try { $scope.meteoCluster.clearMarkers();}catch(e){console.log('No panels initialized true')}
        }
    };

    $scope.sensoresToogle = function (){
        if($scope.fltr_sensorTrafico){
            var file = '__sensores';
            $scope.datos= dataServiceProvider.query({file:file} ,function(data) {
                $scope.sensoresCluster = poiServiceCreator.createSensoresCluster(data,$scope.mapObj);
                return data;
            });
        }else{
            try { $scope.sensoresCluster.clearMarkers();}catch(e){console.log('No sensors initialized true')}

        }
    };

    $scope.meteoToggle = function (){
        mapServiceProvider.weatherToogle();
    };

    $scope.trafficToogle = function (){
        mapServiceProvider.trafficToogle();
    };

    $scope.loadData = function (file){
        //Call data service provider
        $scope.datos= dataServiceProvider.query({file:file} ,function(data) {
            //Call marker service creator
            poiServiceCreator.create(data,$scope.mapObj);
        });
    }
});