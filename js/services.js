/*Services for map */
( function ($scope) {

    'use strict';

    var module;

    module = angular.module('trafic_app.mapRoutingDirections',[]);

    /* The mega script */
    var objMap;
    var theMap = document.getElementById('map_canvas');
    var theLat = 40.418889;     // Madrid City Center Latitude
    var theLong = -3.691944;    // Madrid City Center Longitude
    var theZoom = 6;
    var I = [];

    var transitLayer ;
    var trafficLayer;
    var weatherLayer;
    var cloudLayer;

    var directionsLayer;
    var directionsService

    var transitLayers = false;
    var trafficLayers = false;
    var weatherLayers = false;
    var directionLayers = false;

    var poisDGT =[];
    var route_mode = document.getElementById('route_mode').value;
    var route_optimize = document.getElementById('route_optimize').checked;
    var route_highways = document.getElementById('route_highways').checked;
    var route_tolls = document.getElementById('route_tolls').checked;

    var directionDisplay = document.getElementById('directionsPanel');
    var origin;
    var destination;
    var waypoints = [];
    var markers = [];
    var currentDirections;
    var oldDirections=[];

    /* Google Map object creator*/


    module.factory('mapServiceProvider', function (){
        var myOptions = {
            zoom: theZoom,
        }

        return new mapObject (myOptions);
    });

    /* For Geopos */
    module.factory('getMyPosition' , function (){
        navigator.geolocation.getCurrentPosition(
            function (position) {
                theLat = position.coords.latitude;
                theLong = position.coords.longitude;

                addI();
                return true;
            },
            function (error)
            {
                switch(error.code)
                {
                    case error.TIMEOUT:
                        return error.TIMEOUT;
                        break;
                    case error.POSITION_UNAVAILABLE:
                        return error.POSITION_UNAVAILABLE;
                        break;
                    case error.PERMISSION_DENIED:
                        return error.PERMISSION_DENIED;
                        break;
                    case error.UNKNOWN_ERROR:
                        return error.UNKNOWN_ERR;
                        break;
                }
            }
        );
    });

    /* For POIS retrived of DGT services */
    module.factory('addPoisDGT', function ($rootScope) {
         var i=0;
         var lat;
         var lng;
         var ico;
         var title;

/*         while(i<=$rootScope.datos.length-1){

             lat=$rootScope.datos[i].lat;
             lng=$rootScope.datos[i].lng;
             ico = icoResolutor($rootScope.datos[i].tipo,$rootScope.datos[i].tipoInci);
             title = $rootScope.datos[i].tipo+" : "+ $rootScope.datos[i].alias;

             poisDGT.push(new google.maps.Marker({
                 position: new google.maps.LatLng(lat,lng),
                 draggable: false,
                 map: objMap,
                 animation: google.maps.Animation.DROP,
                 icon: icon,
                 title: title
             }));

             i++;
         }*/
    });




    function addI (){
        var pos = new google.maps.LatLng(theLat,theLong);
        I.push(new google.maps.Marker({
            position: pos,
            draggable: false,
            map: objMap,
            animation: google.maps.Animation.DROP,
            icon: icoResolutor('Me'),
            title: 'Here Right Now!'
        }));
        theZoom = 12;
        objMap.panTo(pos);
        objMap.setZoom(theZoom);
    }

    function clearPoisDGT () {
        for (var i = 0; i < poisDGT.length; i++) {
            poisDGT[i].setMap(null);
        }
    }

    /* For public transportation layer */
    function transitLayerToogle (){
        if(transitLayers){
            clearTransitLayer();
            transitLayers = false;
        }else{
            addTransitLayer();
            transitLayers = true;
        }
    }

    function addTransitLayer (){
        transitLayer = new google.maps.TransitLayer();
        transitLayer.setMap(objMap);
    }

    function clearTransitLayer (){
        transitLayer.setMap(null);
    }

    /* For traffic density layer */
    function trafficLayerToogle (){
        if(trafficLayers){
            clearTrafficLayer();
            trafficLayers = false;
        }else{
            addTrafficLayer();
            trafficLayers = true;
        }
    }
    function addTrafficLayer (){
        trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(objMap);
    }
    function clearTrafficLayer (){
        trafficLayer.setMap(null);
    }

    /* For weather and clouds layer */
    function weatherLayerToogle () {
        if(weatherLayers){
            clearWeatherLayer();
            weatherLayers = false;
        }else{
            addWeatherLayer();
            weatherLayers = true;
        }
    }
    function addWeatherLayer (){
        weatherLayer = new google.maps.weather.WeatherLayer({
            temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS,
            windSpeedUnits: google.maps.weather.WindSpeedUnit.KILOMETERS_PER_HOUR
        });
        weatherLayer.setMap(objMap);

        cloudLayer = new google.maps.weather.CloudLayer();
        cloudLayer.setMap(objMap);
    }
    function clearWeatherLayer (){
        weatherLayer.setMap(null);
        cloudLayer.setMap(null);
    }

    /* For Route Planning layer */
    function addDirectionsLayer (){
        directionsLayer = new google.maps.DirectionsRenderer({
            map: objMap,
            preserveViewport: true,
            draggable: true
        });
        directionsLayer.setMap(objMap);
        directionsLayer.setPanel(directionDisplay);

        directionsService = new google.maps.DirectionsService();

        google.maps.event.addListener(map, 'click', function(event) {
            if (origin == null) {
                origin = event.latLng;
                addMarker(origin);
            } else if (destination == null) {
                destination = event.latLng;
                addMarker(destination);
            } else {
                if (waypoints.length < 9) {
                    waypoints.push({ location: destination, stopover: true });
                    destination = event.latLng;
                    addMarker(destination);
                } else {
                    alert("Maximum number of waypoints reached");
                }
            }
        });
    }
    function clearDirectionsLayer (){
        //directionsLayer = new google.maps.DirectionsRenderer();
        directionsLayer.setMap(objMap);
        directionDisplay.innerHTML='';
    }

    function createRoute (){
        addDirectionsLayer();
        directionLayers=true;
    }

    /* Route planning working functions */
    function calcRoute () {
        if(directionLayers==true){

            if (origin == null) {
                alert("Click on the map to add a start point");
                return;
            }

            if (destination == null) {
                alert("Click on the map to add an end point");
                return;
            }

            var mode;
            switch (route_mode) {
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
                origin: origin,
                destination: destination,
                waypoints: waypoints,
                travelMode: mode,
                optimizeWaypoints: route_optimize,
                avoidHighways: route_highways,
                avoidTolls: route_tolls
            };

            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsLayer.setDirections(response);
                }
            });

            google.maps.event.addListener(directionsLayer, 'directions_changed',function() {
                if (currentDirections) {
                    oldDirections.push(currentDirections);
                }
                currentDirections = directionsLayer.getDirections();
            });
            clearMarkers();
        }
    }

    function updateRoute (){
        if(directionLayers==true){
            calcRoute();
        }
    }

    function resetRoute () {
        clearMarkers();
        clearWaypoints();
        directionsLayer.setMap(null);
        directionsLayer.setPanel(null);
        //directionsLayer = new google.maps.DirectionsRenderer();
        directionsLayer.setMap(objMap);
        directionsLayer.setPanel(directionDisplay);
    }
    /* undo last movement of a mark in the Route planning */
    function undoRoute () {
        if (directionLayers==true){
            currentDirections = null;
            directionsLayer.setDirections(oldDirections.pop());
        }
    }

    /* For Route planning marks  */
    function addMarker (latlng) {
        markers.push(new google.maps.Marker({
            position: latlng,
            draggable: true,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: icoResolutor('Marker')
        }));
    }
    function clearMarkers () {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }

    function clearWaypoints () {
        markers = [];
        origin = null;
        destination = null;
        waypoints = [];
    }

    /* to select the type of ico for the marker */
//TODO: esta funcion con segundo parametro opcional no me termina de convencer
    function icoResolutor (typeInc, typeInc2) {
        var icoType = (typeInc=='Incidencia')? typeInc2:typeInc;
        var ico;

        switch (icoType){
            case ('Me'):
                ico = 'img/me.png';
                break;
            case ('Marker'):
                ico ='http://maps.google.com/mapfiles/marker' + String.fromCharCode(markers.length + 65) + '.png';
                break;
            case ('Camara'):
                ico = 'img/Camara.png';
                break;
            case ('SensorMeteorologico'):
                ico ='img/sensorMetorologico.png';
                break;
            case ('SensorTrafico'):
                ico='img/sensorTrafico.png';
                break;
            case('OBRAS'):
                ico = 'img/Obras.png';
                break;
            case ('OTROS'):
                ico = 'img/Otros.png';
                break;
            case ('METEOROL�GICO'):
                ico = 'img/Meteorologico.png';
                break;
            case ('RETENCI�N / CONGESTI�N'):
                ico = 'img/Retencion.png';
                break;
            case ('Panel_CMS'):
                ico = 'img/panel.png';
                break;
        }

        return ico;
    }



    /* generic in geo - May be will be used in the DGT services to get the parameters needed in the query*/
    function getMapLatNS (x){ return x.getBounds().getNorthEast().lat(); }
    function getMapLongNS (x){ return x.getBounds().getNorthEast().lng(); }
    function getMapLatSW (x){ return x.getBounds().getSouthWest().lat(); }
    function getMapLongSW (x){ return x.getBounds().getSouthWest().lng(); }
    function getMapZoom (x){ return x.getZoom(); }
}).call(this);

