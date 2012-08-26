/* Controllers */
'use strict';

var module;

module = angular.module ('trafic_app.controllers',[]);

module.controller('traficCtrl', function ($scope, mapServiceProvider,dataServiceProvider,poiServiceCreator) {

// --------- initialization of model-view bindings  --------- \\

    //filter for info filters & google layers
    $scope.fltr_camaras = false;
    $scope.fltr_paneles = false;
    $scope.fltr_estMeteorologia = false;
    $scope.fltr_sensorTrafico = false;
    $scope.fltr_meteo = false;
    $scope.fltr_trafico = false;
    $scope.fltr_gas = false;

    //filter for route planning form
    $scope.route_mode='driving';
    $scope.route_highways=true;
    $scope.route_tolls=true;
    $scope.route_optimize=true;

    //the dataset
    $scope.datos;

    // map object
    $scope.mapObj = null;

    //direction layer
    $scope.directionLayer = false;
    $scope.waypoints=[];
    $scope.origin = null;
    $scope.destination = null;

    //Marker clusters
    $scope.camerasCluster;
    $scope.panelsCluster;
    $scope.meteoCluster;
    $scope.sensoresCluster;
    $scope.wayPointsCluster=[];
    $scope.OLDwayPointsCluster = [];


    // Main function in ng-init
    $scope.BeganToBegin = function (){
        $scope.createMap();
        $scope.initData();
    };

    // Control the creation of map
    $scope.createMap = function() {

        //calling the servce for create a map to display the datasets
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

    // Firts time load data
    $scope.initData = function(){
        $scope.camarasToogle();
        $scope.panelesToogle();
        $scope.sensMeteoToogle();
        $scope.sensTrafficToogle();
    };

// --------- Controls for info --------- \\
    // Cameras control
    $scope.camarasToogle = function (){
        if($scope.fltr_camaras){

            var file = '__camaras';//file name for data load

            //calling the service for data load , the only parameter is the name of the file with the JSON data
            $scope.datos= dataServiceProvider.query({file:file} ,function(data) {

                //calling the marker service creator to create a especific cluster for this kind of element
                $scope.camerasCluster = poiServiceCreator.createCamerasCluster(data,$scope.mapObj);
                return data;
            });
        }else{
            try { $scope.camerasCluster.clearMarkers();}catch(e){} //clearMarkers is a method of MarkerCluster
        }
    };

    // Panels control
    $scope.panelesToogle = function (){
        if($scope.fltr_paneles){

            var file = '__paneles';//file name for data load

            //calling the service for data load , the only parameter is the name of the file with the JSON data
            $scope.datos= dataServiceProvider.query({file:file} ,function(data) {

                //calling the marker service creator to create a especific cluster for this kind of element
                $scope.panelsCluster = poiServiceCreator.createPanelsCluster(data,$scope.mapObj);
                return data;
            });
        }else{
            try { $scope.panelsCluster.clearMarkers();}catch(e){} //clearMarkers is a method of MarkerCluster
        }
    };

    // Meteo sensor control
    $scope.sensMeteoToogle = function (){
        if($scope.fltr_estMeteorologia){

            var file = '__meteo'; //file name for data load

            //calling the service for data load , the only parameter is the name of the file with the JSON data
            $scope.datos= dataServiceProvider.query({file:file} ,function(data) {

                //calling the marker service creator to create a especific cluster for this kind of element
                $scope.meteoCluster = poiServiceCreator.createMeteoCluster(data,$scope.mapObj);
                return data;
            });
        }else{
            try { $scope.meteoCluster.clearMarkers();}catch(e){} //clearMarkers is a method of MarkerCluster
        }
    };

    // Traffic sensors control
    $scope.sensTrafficToogle = function (){
        if($scope.fltr_sensorTrafico){

            var file = '__sensores'; //file name for data load

            //calling the service for data load , the only parameter is the name of the file with the JSON data
            $scope.datos= dataServiceProvider.query({file:file} ,function(data) {


                //calling the marker service creator to create a especific cluster for this kind of element
                $scope.sensoresCluster = poiServiceCreator.createSensoresCluster(data,$scope.mapObj);
                return data;
            });
        }else{
            try { $scope.sensoresCluster.clearMarkers();}catch(e){} //clearMarkers is a method of MarkerCluster

        }
    };

    // Weather [google layer]
    $scope.meteoToggle = function (){
        $scope.mapObj.weatherToogle();
    };

    // Traffic density [google layer]
    $scope.trafficToogle = function (){
        $scope.mapObj.trafficToogle();
    };

    // Gas control
    $scope.gasToogle = function (){

        $.ajax({
            type: 'GET',
            url: 'dataModels/mitycProxy.php',
            dataType: 'xml',
            success: function (data){
                $(data).find('elemento').each(function()
                {
                    var myOptions = {
                        tipo : $(this).find('rotulo').text(),
                        alias : $(this).find('precio').text(),
                        lat : $(this).find('y').text(),
                        lng : $(this).find('x').text()
                    }

                    $scope.res = myOptions;

                    poiServiceCreator.createGenericPoi(myOptions,$scope.mapObj)

                    //console.log(myOptions)

                });
            }
        });
    };


// --------- Controls for route planning --------- \\
    // Init the direction routine and register click event to creater the route marks (waypoints)
    $scope.createRoute = function(){
        var originOptions,destinationOptions;

        if (!$scope.directionLayer){
            //calling the method to create the directions layer and directions service
            $scope.mapObj.addDirectionsLayer();

            //register click event
            $scope.mapObj.registerMapEvent('click',function(event){
                // the first mark, the origin
                if ($scope.origin == null) {
                    $scope.origin = event.latLng; // position for marker
                    originOptions = {
                        position:$scope.origin,
                        draggable: false,
                        tipo:  'Origin',
                        title: 'origen'
                    };
                    $scope.wayPointsCluster.push(poiServiceCreator.createGenericPoi(originOptions,$scope.mapObj)); //calling the marker service to create a origin mark
                } else if ($scope.destination == null) {
                    // the second mark, destination
                    $scope.destination = event.latLng; // position for marker
                    destinationOptions = {
                        position:$scope.destination,
                        draggable: false,
                        tipo:  'Destination',
                        title: 'destino 1'
                    };
                    $scope.wayPointsCluster.push(poiServiceCreator.createGenericPoi(destinationOptions,$scope.mapObj)); //calling the marker service to create a destination mark
                } else {
                    //the limit of 9 is a google limit for the service
                    if ($scope.waypoints.length <= 9) {
                        $scope.waypoints.push({ location: $scope.destination, stopover: true });// the others marks to waypoints
                        $scope.destination = event.latLng; // position for marker
                        destinationOptions = {
                            position:$scope.destination,
                            draggable: false,
                            tipo:  'Destination',
                            title: 'destino'+ $scope.waypoints.length
                        };
                        $scope.wayPointsCluster.push(poiServiceCreator.createGenericPoi(destinationOptions,$scope.mapObj)); //calling the marker service to create a destination mark
                    } else {
                        alert("Maximum number of waypoints reached");
                    }
                }
            });

            //The direction layer is created , now we can create a waypoints, calculate, update , reset or undo
            $scope.directionLayer = true;

            //Hide the button !! prevent malicious or dumbs cliks
            $('#createRoute').hide();

        }else{
            alert ('push the Blue ')
        }
    };

    // Trigger the calculate process getting all the mandatory params needed for the request
    $scope.calcRoute = function() {
        if($scope.directionLayer){

            //Without origin or any destination is not possible calculate no route.
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

            //the request options, first 3 thru createRoute the rest with route planning form
            var request = {
                origin: $scope.origin,
                destination: $scope.destination,
                waypoints: $scope.waypoints,
                travelMode: mode,
                optimizeWaypoints: $scope.route_optimize,
                avoidHighways: $scope.route_highways,
                avoidTolls: $scope.route_tolls
            };

            //Calling directly to the method of the map object
            $scope.mapObj.calculateDirectionsLayer(request);

            //Unregistering the event for no more waypoints
            $scope.mapObj.unRegisterEvent('click');

            //Needed to remove the temporal markers created by the user in the route
            $scope.removeTemporalMarkers();

            //Hide the button !! prevent malicious or dumbs cliks
            $('#calcRoute').hide();
        }
    };

    $scope.removeTemporalMarkers = function(){
        for (var i = 0; i < $scope.wayPointsCluster.length; i++) {
            $scope.wayPointsCluster[i].setMap(null);
        }
    };

    //Recall the calcRoute routine
    $scope.updateRoute = function(){
        if($scope.directionLayer){
            $scope.calcRoute();
        }
    };

    //Call directly the method of the map object for remove all waypoints and indications
    $scope.resetRoute = function() {
        $scope.directionLayer = false;
        $scope.waypoints=[];
        $scope.origin = null;
        $scope.destination = null;

        $('#createRoute').show();
        $('#calcRoute').show();

        $scope.mapObj.clearDirectionsLayer();
    };

});