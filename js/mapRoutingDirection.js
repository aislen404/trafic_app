var directionDisplay;

var map;
var origin = null;
var destination = null;
var waypoints = [];
var markers = [];
var poisDGT =[];
var directionsVisible = false;

function mapServiceProvider(lat,lng,id,z) {
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
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        }
    }

    map = new google.maps.Map(document.getElementById(id),myOptions);

    transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);

    trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById("directionsPanel"));

  /*  var weatherLayer = new google.maps.weather.WeatherLayer({
        temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS,
        windSpeedUnits: google.maps.weather.WindSpeedUnit.KILOMETERS_PER_HOUR
    });
    weatherLayer.setMap(map);

    var cloudLayer = new google.maps.weather.CloudLayer();
    cloudLayer.setMap(map);
*/
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

    /*
    google.maps.event.addListener(map, 'zoom_changed', function() {
        var zoomLevel = map.getZoom();
        map.setCenter(myLatLng);
        infowindow.setContent('Zoom: ' + zoomLevel);
    });*/
}

function markServiceCreator(lat,lng,ico,title,objMap){

    addPoisDGT(new google.maps.LatLng(lat,lng),ico,title);

}

function addPoisDGT(latlng,icon,title) {
    poisDGT.push(new google.maps.Marker({
        position: latlng,
        draggable: false,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: icon,
        title: title
    }));
}

function addMarker(latlng) {
     markers.push(new google.maps.Marker({
        position: latlng,
        draggable: true,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: 'http://maps.google.com/mapfiles/marker' + String.fromCharCode(markers.length + 65) + '.png'
    }));
}

function calcRoute() {
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

    clearMarkers();
    directionsVisible = true;
}

function updateMode() {
    if (directionsVisible) {
        calcRoute();
    }
}
function clearPoisDGT() {
    for (var i = 0; i < poisDGT.length; i++) {
        poisDGT[i].setMap(null);
    }
}
function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function clearWaypoints() {
    markers = [];
    origin = null;
    destination = null;
    waypoints = [];
    directionsVisible = false;
}

function reset() {
    clearMarkers();
    clearWaypoints();
    directionsDisplay.setMap(null);
    directionsDisplay.setPanel(null);
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById("directionsPanel"));
}

function incidentIcoResolutor (typeInc) {
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

var getMapLatNS =  function(objMap){ return objMap.getBounds().getNorthEast().lat(); }
var getMapLongNS =  function(objMap){ return objMap.getBounds().getNorthEast().lng(); }
var getMapLatSW =  function(objMap){ return objMap.getBounds().getSouthWest().lat(); }
var getMapLongSW =  function(objMap){ return objMap.getBounds().getSouthWest().lng(); }
var getMapZoom =  function(objMap){ return objMap.getZoom(); }