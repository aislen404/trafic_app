var directionDisplay=document.getElementById("directionsPanel");

var map;
var origin = null;
var destination = null;
var waypoints = [];
var markers = [];
var poisDGT =[];
var I = [];
var transitLayer ;
var trafficLayer;
var weatherLayer;
var cloudLayer;

var myLat ;
var myLong;
var zoom = 6;


var currentDirections;
var oldDirections=[];

var transitLayers = false;
var trafficLayers = false;
var weatherLayers = false;
var directionLayers = false;

var mapID ='map_canvas';

mapServiceProvider = function(lat,lng,z) {

    var myOptions = {
        zoom: z,
        center: new google.maps.LatLng(lat,lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_CENTER
        },
        panControl: true,
        panControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: true,
        scaleControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT
        },
        streetViewControl: false,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        }
    }

    map = new google.maps.Map(document.getElementById(mapID),myOptions);

}

getMyPosition = function (){
    navigator.geolocation.getCurrentPosition(
        function (position) {
            myLat = position.coords.latitude;
            myLong = position.coords.longitude;

            zoom = 12;

            mapServiceProvider(myLat,myLong,zoom);
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
}

addI = function (){
    I.push(new google.maps.Marker({
        position: new google.maps.LatLng(myLat,myLong),
        draggable: false,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: incidentIcoResolutor('Me'),
        title: 'Here Right Now!'
    }));
}

addPoisDGT = function (lat,lng,icon,title) {
    poisDGT.push(new google.maps.Marker({
        position: new google.maps.LatLng(lat,lng),
        draggable: false,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: icon,
        title: title
    }));
}
clearPoisDGT = function () {
    for (var i = 0; i < poisDGT.length; i++) {
        poisDGT[i].setMap(null);
    }
}

addMarker = function(latlng) {
     markers.push(new google.maps.Marker({
        position: latlng,
        draggable: true,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: 'http://maps.google.com/mapfiles/marker' + String.fromCharCode(markers.length + 65) + '.png'
    }));
}
clearMarkers = function() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

transitLayerToogle = function (){
    if(transitLayers){
        clearTransitLayer();
        transitLayers = false;
    }else{
        addTransitLayer();
        transitLayers = true;
    }
}

addTransitLayer = function(){
    transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);
}

clearTransitLayer = function(){ transitLayer.setMap(null);}

trafficLayerToogle = function (){
    if(trafficLayers){
        clearTrafficLayer();
        trafficLayers = false;
    }else{
        addTrafficLayer();
        trafficLayers = true;
    }
}

addTrafficLayer = function(){
    trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
}
clearTrafficLayer =function(){ trafficLayer.setMap(null); }

addDirectionsLayer = function (){
    directionsDisplay = new google.maps.DirectionsRenderer({
        map: map,
        preserveViewport: true,
        draggable: true
    });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(directionDisplay);

    google.maps.event.addListener(directionsDisplay, 'directions_changed',function() {
            if (currentDirections) {
                oldDirections.push(currentDirections);
                setUndoDisabled(false);
            }
            currentDirections = directionsDisplay.getDirections();
        });

    setUndoDisabled(true);

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
clearDirectionsLayer = function(){
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    document.getElementById("directionsPanel").innerHTML='';
}

weatherLayerToogle = function() {
   if(weatherLayers){
       clearWeatherLayer();
       weatherLayers = false;
   }else{
       addWeatherLayer();
       weatherLayers = true;
   }
}
addWeatherLayer = function (){
     weatherLayer = new google.maps.weather.WeatherLayer({
        temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS,
        windSpeedUnits: google.maps.weather.WindSpeedUnit.KILOMETERS_PER_HOUR
     });
     weatherLayer.setMap(map);

     cloudLayer = new google.maps.weather.CloudLayer();
     cloudLayer.setMap(map);
}
clearWeatherLayer = function (){
    weatherLayer.setMap(null);
    cloudLayer.setMap(null);
}

calcRoute = function() {

    if(directionLayers==false){
        addDirectionsLayer();
        var directionsService = new google.maps.DirectionsService();

        if (origin == null) {
            alert("Click on the map to add a start point");
            return;
        }

        if (destination == null) {
            alert("Click on the map to add an end point");
            return;
        }

        var mode;
        switch (document.getElementById("mode").value) {
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
            optimizeWaypoints: document.getElementById('map_optimize').checked,
            avoidHighways: document.getElementById('map_highways').checked,
            avoidTolls: document.getElementById('map_tolls').checked
        };

        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });

        directionLayers=true;
        clearMarkers();
    }else{
        resetRoute();
        clearDirectionsLayer();
        directionLayers=false;
    }
}

updateRoute = function(){
    if(directionLayers==true){
        calcRoute();
    }
}

resetRoute = function() {
    clearMarkers();
    clearWaypoints();
    directionsDisplay.setMap(null);
    directionsDisplay.setPanel(null);
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById("directionsPanel"));
}

clearWaypoints = function() {
    markers = [];
    origin = null;
    destination = null;
    waypoints = [];
}

undo = function () {
    currentDirections = null;
    directionsDisplay.setDirections(oldDirections.pop());
    if (!oldDirections.length) {
        setUndoDisabled(true);
    }
}

setUndoDisabled = function(value) {
    //document.getElementById("undo").disabled = value;
}

incidentIcoResolutor = function(typeInc) {
    var ico;

    switch (typeInc){
        case ('Me'):
            ico = 'img/me.png';
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



getMapLatNS =  function(objMap){ return objMap.getBounds().getNorthEast().lat(); }
getMapLongNS =  function(objMap){ return objMap.getBounds().getNorthEast().lng(); }
getMapLatSW =  function(objMap){ return objMap.getBounds().getSouthWest().lat(); }
getMapLongSW =  function(objMap){ return objMap.getBounds().getSouthWest().lng(); }
getMapZoom =  function(objMap){ return objMap.getZoom(); }