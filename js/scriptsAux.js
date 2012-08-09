markerObject = (function (){
    function markerObject (options) {

        var myOptions = {
            position: new google.maps.LatLng(options.lat,options.lng),
            draggable: options.draggable,
            map: options.objMap.mapInstance,
            icon: icoResolutor(options.icon_a,options.icon_b),
            title: options.title
        }

        this.markerInstance = new google.maps.Marker(myOptions);
    }

    //For register the events
    markerObject.prototype.registerMapEvent = function (ev,callBack){
        return google.maps.event.addListener(this.markerInstance, ev ,callBack);
    }

    //Delete this mark
    markerObject.prototype.clearMark = function (){
        console.log('markerObject.prototype.clearMark',this.markerInstance);
        this.markerInstance.setMap(null);
    }

    return markerObject;

}).call(this);

mapObject = (function() {
    var geoSuccessCallback, geolocationError;

    function mapObject(options) {

        var theLat = 40.418889;     // Madrid City Center Latitude
        var theLong = -3.691944;    // Madrid City Center Longitude
        this.theZoom = 9;            // First Zoom

        this.theMap = document.getElementById('map_canvas');

        this.positionTracking = false;
        this.trafficLayer = false;
        this.transitLayer = false;
        this.weatherLayer = false;
        this.mapInstance = null;

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

        this.mapInstance = new google.maps.Map(this.theMap,myOptions);

    }

    //For register the events
    mapObject.prototype.registerMapEvent = function (ev,callBack){
        return google.maps.event.addListener(this.mapInstance, ev,callBack);
    }

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
    }
    mapObject.prototype.trafficLayerOn = function (){
        this.trafficLayerInstance = new google.maps.TrafficLayer();
        return this.trafficLayerInstance.setMap(this.mapInstance);

    }
    mapObject.prototype.trafficLayerOff = function (){
        return this.trafficLayerInstance.setMap(null);
    }

    //Transit layer
    mapObject.prototype.transitToogle = function (){
        if (this.transitLayer==false) {
            this.transitLayer = true;
            return this.transitLayerOn();
        } else{
            this.transitLayer = false;
            return this.transitLayerOff();
        }
    }
    mapObject.prototype.transitLayerOn = function (){
        this.transitLayerInstance = new google.maps.TransitLayer();
        return  this.transitLayerInstance.setMap(this.mapInstance);
    }
    mapObject.prototype.transitLayerOff = function (){
        return  this.transitLayerInstance.setMap(null);
    }

    //Weather layer
    mapObject.prototype.weatherToogle = function () {
        if (this.weatherLayer==false) {
            this.weatherLayer = true;
            return this.weatherLayerOn();
        } else{
            this.weatherLayer = false;
            return this.weatherLayerOff();
        }

    }
    mapObject.prototype.weatherLayerOn = function (){
        this.weatherLayerInstance = new google.maps.weather.WeatherLayer({
            temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS,
            windSpeedUnits: google.maps.weather.WindSpeedUnit.KILOMETERS_PER_HOUR
        });
        this.weatherLayerInstance.setMap(this.mapInstance);
        this.cloudLayerInstance = new google.maps.weather.CloudLayer();
        this.cloudLayerInstance.setMap(this.mapInstance);
    }
    mapObject.prototype.weatherLayerOff = function (){
        this.weatherLayerInstance.setMap(null);
        this.cloudLayerInstance.cloudLayer.setMap(null);
    }

    /* generic in geo - May be will be used in the DGT services to get the parameters needed in the query*/
    mapObject.prototype.getLatNS = function (){ return  this.mapInstance.getBounds().getNorthEast().lat(); }
    mapObject.prototype.getLongNS = function (){ return  this.mapInstance.getBounds().getNorthEast().lng(); }
    mapObject.prototype.getLatSW = function (){ return  this.mapInstance.getBounds().getSouthWest().lat(); }
    mapObject.prototype.getLongSW = function (){ return  this.mapInstance.getBounds().getSouthWest().lng(); }
    mapObject.prototype.getZoom = function (){ return  this.mapInstance.getZoom(); }

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
icoResolutor = function (typeInc, typeInc2) {
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