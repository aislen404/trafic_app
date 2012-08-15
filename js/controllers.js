/* Controllers */
'use strict';

var module;

module = angular.module ('trafic_app.controllers',[]);

module.controller('traficCtrl', function ($scope, mapServiceProvider,dataServiceProvider,poiServiceCreator) {

    // initialization of model-view bindings
    $scope.fltr_camaras = false;
    $scope.fltr_paneles = false;
    $scope.fltr_estMeteorologia = false;
    $scope.fltr_sensorTrafico = false;
    $scope.fltr_meteo = false;
    $scope.fltr_trafico = false;


    $scope.datos;

    // map object
    $scope.mapObj = null;

    //direction layers
    $scope.directionLayer = false;

    $scope.route_mode='driving';
    $scope.route_highways=true;
    $scope.route_tolls=true;
    $scope.route_optimize=true;

    $scope.waypoints=[];

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
        $scope.sensMeteoToogle();
        $scope.sensTrafficToogle();
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

    $scope.sensMeteoToogle = function (){
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

    $scope.sensTrafficToogle = function (){
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

    //TODO: meter a fltr_meteo y fltr_camera, no esta metido en binding del model
    $scope.meteoToggle = function (){
        $scope.mapObj.weatherToogle();
    };

    $scope.trafficToogle = function (){
        $scope.mapObj.trafficToogle();
    };

    //TODO: escribe las funciones PUTO VAGO !!!
    $scope.createRoute = function(){
        var originOptions,destinationOptions;

        if (!$scope.directionLayer){

            $scope.mapObj.addDirectionsLayer();

            console.log('$scope.mapObj.addDirectionsLayer()');

            $scope.mapObj.registerMapEvent('click',function(event){

                if ($scope.origin == null) {
                    $scope.origin = event.latLng;
                    originOptions = {
                        position:$scope.origin,
                        draggable: false,
                        tipo:  'Marker',
                        title: 'origen'
                    };
                    poiServiceCreator.createGenericPoi(originOptions,$scope.mapObj);
                    console.log('originOptions',originOptions);
                } else if ($scope.destination == null) {
                    $scope.destination = event.latLng;
                    destinationOptions = {
                        position:$scope.destination,
                        draggable: false,
                        tipo:  'Marker',
                        title: 'destino 1'
                    };
                    console.log('destinationOptions',destinationOptions);
                    poiServiceCreator.createGenericPoi(destinationOptions,$scope.mapObj);

                } else {
                    if ($scope.waypoints.length < 5) {
                        $scope.waypoints.push({ location: $scope.destination, stopover: true });
                        $scope.destination = event.latLng;
                        destinationOptions = {
                            position:$scope.destination,
                            draggable: false,
                            tipo:  'Marker',
                            title: 'destino'+ $scope.waypoints.length
                        };
                        console.log('destinationOptions',destinationOptions);
                        poiServiceCreator.createGenericPoi(destinationOptions,$scope.mapObj);

                    } else {
                        alert("Maximum number of waypoints reached");
                    }
                }

            });
            $scope.directionLayer = true;
        }
    };

    $scope.calcRoute = function() {
        if($scope.directionLayer){
            if ($scope.origin == null) {
                alert("Click on the map to add a start point");
                return;
            }
            if ($scope.destination == null) {
                alert("Click on the map to add an end point");
                return;
            }

            var mode;
            switch ( $scope.route_mode ) {
                case "bicycling":
                    mode = google.maps.DirectionsTravelMode.BICYCLING;
                    break;
                case "driving":
                    mode = google.maps.DirectionsTravelMode.DRIVING;
                    break;
                case "walking":
                    mode = google.maps.DirectionsTravelMode.WALKING;
                    break;
            }

            var request = {
                origin: $scope.origin,
                destination: $scope.destination,
                waypoints: $scope.waypoints,
                travelMode: mode,
                optimizeWaypoints: $scope.route_optimize,
                avoidHighways: $scope.route_highways,
                avoidTolls: $scope.route_tolls
            };

            $scope.mapObj.calculateDirectionsLayer(request);

            //$scope.mapObj.clearMarkers();
        }
    };

    $scope.updateRoute = function(){
        if($scope.directionLayer){
            $scope.calcRoute();
        }
    };

    $scope.resetRoute = function() {
        $scope.mapObj.clearDirectionsLayer();
    };

});