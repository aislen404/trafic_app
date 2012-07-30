/**
 * Created with JetBrains WebStorm.
 * User: aislen404
 * Date: 30/07/12
 * Time: 11:57
 * To change this template use File | Settings | File Templates.
 */


/* The mega script */
var objMap;


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

function clearPoisDGT () {
    for (var i = 0; i < poisDGT.length; i++) {
        poisDGT[i].setMap(null);
    }
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




/* generic in geo - May be will be used in the DGT services to get the parameters needed in the query*/
function getMapLatNS (x){ return x.getBounds().getNorthEast().lat(); }
function getMapLongNS (x){ return x.getBounds().getNorthEast().lng(); }
function getMapLatSW (x){ return x.getBounds().getSouthWest().lat(); }
function getMapLongSW (x){ return x.getBounds().getSouthWest().lng(); }
function getMapZoom (x){ return x.getZoom(); }