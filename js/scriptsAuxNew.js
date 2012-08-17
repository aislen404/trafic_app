//The Marks
markerObject = (function (){
    function markerObject (options) {

        var myOptions = {
            position: options.position,
            lat:options.lat,
            lng:options.lng,
            draggable: options.draggable,
            map: options.objMap.mapInstance,
            icon: icoResolutor(options.icon), //we use a method to resolve and abstract the icons by type
            title: options.title
        };

        this.markerInstance = new google.maps.Marker(myOptions);
    }

    //For register the events
    markerObject.prototype.registerMapEvent = function (ev,callBack){
        return google.maps.event.addListener(this.markerInstance, ev ,callBack);
    }

    return markerObject;

}).call(this);

//The Map
mapObject = (function() {
    var geoSuccessCallback, geolocationError;

    function mapObject(options) {

        var theLat = 40.418889;     // Madrid City Center Latitude
        var theLong = -3.691944;    // Madrid City Center Longitude
        this.theZoom = 9;            // First Zoom

        this.theMap = document.getElementById('map_canvas');                    //map div id
        this.theDirectionsPanel = document.getElementById('directionsPanel');   //directions div id

        this.positionTracking = false;

        var myOptions = {
           zoom: this.theZoom,
           center: new google.maps.LatLng(theLat, theLong),
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

        //the instance of the map
        this.mapInstance = new google.maps.Map(this.theMap,myOptions);

        //For traffic density service
        this.trafficLayer = false;
        this.trafficLayerInstance  = new google.maps.TrafficLayer();

        //For public transport service
        this.transitLayer = false;
        this.transitLayerInstance = new google.maps.TransitLayer();

        //For weather service
        this.weatherLayer = false;
        this.weatherLayerInstance = new google.maps.weather.WeatherLayer({
            temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS,
            windSpeedUnits: google.maps.weather.WindSpeedUnit.KILOMETERS_PER_HOUR
        });

        //For directions service
        var directionsLayerInstance;
        this.directionsServiceInstance = new google.maps.DirectionsService();
    }

    //For register the events
    mapObject.prototype.registerMapEvent = function (ev,callBack){
        return google.maps.event.addListener(this.mapInstance, ev,callBack);
    };

    // Geolocation and Tracking position
    mapObject.prototype.positionTrack = function() {
        if (!this.positionTracking.state) {
            this.positionTrackingOn();
            return this.positionTrackRefresh();
        } else if (this.positionTracking.state) {
            return this.positionTrackingOff();
        }
    };
    mapObject.prototype.positionTrackingOn = function() {
        var geoLoc, options, watchID;
        if (!this.nav) {
            this.nav = window.navigator;
        }
        if (this.nav) {
            geoLoc = this.nav.geolocation;
            window.map = this.mapInstance;
            if (geoLoc) {
                watchID = geoLoc.watchPosition(geoSuccessCallback, geolocationError, options = {
                    enableHighAccuracy: true
                });
            }
            try {
                geoLoc.getCurrentPosition(geoSuccessCallback, geolocationError, options = {
                    enableHighAccuracy: true
                });
            } catch (_error) {}
            return this.positionTracking.state = true;
        }
    };
    mapObject.prototype.positionTrackRefresh = function() {
        var pos;
        pos = window.pos;
        if (pos) {
            return this.mapInstance.panTo(new google.maps.LatLng(pos.lat(), pos.lng()));
        }
    };
    mapObject.prototype.positionTrackingOff = function(watchID) {
        window.navigator.geolocation.clearWatch(watchID);
        try {
            window.userPositionMarker.setMap(null);
        } catch (_error) {}
        return this.positionTracking.state = false;
    };

    // Traffic layer
    mapObject.prototype.trafficToogle = function () {
        if (this.trafficLayer==false) {
            this.trafficLayer = true;
            return this.trafficLayerOn();
        } else{
            this.trafficLayer = false;
            return this.trafficLayerOff();
        }
    };
    mapObject.prototype.trafficLayerOn = function (){
        return this.trafficLayerInstance.setMap(this.mapInstance);
    };
    mapObject.prototype.trafficLayerOff = function (){
        return this.trafficLayerInstance.setMap(null);
    };

    //Transit layer
    mapObject.prototype.transitToogle = function (){
        if (this.transitLayer==false) {
            this.transitLayer = true;
            return this.transitLayerOn();
        } else{
            this.transitLayer = false;
            return this.transitLayerOff();
        }
    };
    mapObject.prototype.transitLayerOn = function (){
        return  this.transitLayerInstance.setMap(this.mapInstance);
    };
    mapObject.prototype.transitLayerOff = function (){
        return  this.transitLayerInstance.setMap(null);
    };

    //Weather layer
    mapObject.prototype.weatherToogle = function () {
        if (this.weatherLayer==false) {
            this.weatherLayer = true;
            return this.weatherLayerOn();
        } else{
            this.weatherLayer = false;
            return this.weatherLayerOff();
        }

    };
    mapObject.prototype.weatherLayerOn = function (){
        this.weatherLayerInstance.setMap(this.mapInstance);

        //TODO: Cloud layer?¿
        //this.cloudLayerInstance = new google.maps.weather.CloudLayer();
        //this.cloudLayerInstance.setMap(this.mapInstance);
    };
    mapObject.prototype.weatherLayerOff = function (){
        this.weatherLayerInstance.setMap(null);

        //TODO: Cloud layer?¿
        //this.cloudLayerInstance.cloudLayer.setMap(null);
    };

    //Directions layer
    //TODO: Implement Undo feature.
    mapObject.prototype.addDirectionsLayer = function (){
        directionsLayerInstance = new google.maps.DirectionsRenderer({
            preserveViewport: true,
            draggable: true
        });
        directionsLayerInstance.setMap(this.mapInstance);
        directionsLayerInstance.setPanel(this.theDirectionsPanel);
    };
    mapObject.prototype.clearDirectionsLayer = function(){
        directionsLayerInstance.setMap(null);
        directionsLayerInstance.setPanel(null);

        directionsLayerInstance.setMap(this.mapInstance);
        directionsLayerInstance.setPanel(this.theDirectionsPanel);
    };
    mapObject.prototype.calculateDirectionsLayer = function(request){
        this.directionsServiceInstance.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsLayerInstance.setDirections(response);
            }
        });
    };

    // generic in geo - May be will be used in the DGT services to get the parameters needed in the query
    mapObject.prototype.getLatNS = function (){ return  this.mapInstance.getBounds().getNorthEast().lat(); };
    mapObject.prototype.getLongNS = function (){ return  this.mapInstance.getBounds().getNorthEast().lng(); };
    mapObject.prototype.getLatSW = function (){ return  this.mapInstance.getBounds().getSouthWest().lat(); };
    mapObject.prototype.getLongSW = function (){ return  this.mapInstance.getBounds().getSouthWest().lng(); };
    mapObject.prototype.getZoom = function (){ return  this.mapInstance.getZoom(); };

    //Callback controls for Geolocation
    geoSuccessCallback = function(position) {
        var icon;
        if (position.coords.latitude) {
            window.pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            try {
                window.userPositionMarker.setMap(null);
            } catch (_error) {}
            icon = icoResolutor('Me');
            return window.userPositionMarker = new google.maps.Marker({
                icon: icon,
                position: window.pos,
                map: window.map,
                title: 'You are here.'
            });
            window.map.panTo(window.pos);
        }
    };
    geolocationError = function(error) {
        var alert, msg;
        console.log('geoLoc error');
        msg = 'Unable to locate position. ';
        switch (error.code) {
            case error.TIMEOUT:
                msg += 'Timeout.';
                break;
            case error.POSITION_UNAVAILABLE:
                msg += 'Position unavailable.';
                break;
            case error.PERMISSION_DENIED:
                msg += 'Please turn on location services.';
                break;
            case error.UNKNOWN_ERROR:
                msg += error.code;
        }
        return msg;
    };

    return mapObject;

}).call(this);

InfoWindow = (function() {

    function InfoWindow() {
        this.self = new google.maps.InfoWindow({
            content: "<div class=\"modal-header\">\n  <a href=\"#\" class=\"delete btn\">Delete</a>\n  <a href=\"#\" class=\"undelete btn\" style=\"display: none\">UnDelete</a>\n  <a href=\"#/place\" class=\"edit btn btn-primary\">Edit</a>\n  <a href=\"#/map\" id=\"place-item-move\" class=\"btn\" data-dismiss=\"modal\" >Move</a>\n  <a href=\"#/place/:id/directions\" id=\"place-item-directions\" class=\"btn\" data-dismiss=\"modal\" >Directions</a>\n  <a href=\"#/map\" class=\"btn\" data-dismiss=\"modal\" >Close</a>\n</div>\n<div class=\"modal-body\">\n  <form class=\"form-horizontal\">\n    <fieldset>\n      <div class=\"control-group\">    &nbsp;&nbsp;Marker#:&nbsp;    {{markerno}}</div>\n    </fieldset>\n  </form>\n</div>        "
        });
    }

    return InfoWindow;

}).call(this);

//AUXILIAR FUNCTION TO RESOLVE THE ICO FOR MARKS
//return the icon type
icoResolutor = function (type) {
    var ico;

    switch (type){
        case ('Me'):
            ico = 'img/me.png';
            break;
        case ('Marker'):
            ico ='img/default.png';
            break;
        case ('Origin'):
            ico ='img/origin.png';
            break;
        case ('Destination'):
            ico ='img/destination.png';
            break;
        case ('Camara'):
            ico = 'img/camaras.png';
            break;
        case ('SensorMeteorologico'):
            ico ='img/sensorMetorologico.png';
            break;
        case ('SensorTrafico'):
            ico='img/sensorTrafico.png';
            break;
        case ('Panel_CMS'):
            ico = 'img/panel.png';
            break;
        case ('Panel_PSG'):
            ico = 'img/panel.png';
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
    }

    return ico;
}