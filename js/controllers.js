'use strict';

/* Controllers */

function trafficFilterCtrl ($scope, $http, $templateCache) {

    /* scopes for filters */
    $scope.fltr_camaras=true;
    $scope.fltr_eventos=false;
    $scope.fltr_meteorologia=false;
    $scope.fltr_obras=false;
    $scope.fltr_otros=false;
    $scope.fltr_puertos=false;
    $scope.fltr_retencion=false;
    $scope.fltr_paneles=false;
    $scope.fltr_est_meteorologica=false;
    $scope.fltr_trafico=false;
    $scope.fltr_latNS=40.50857873259441;
    $scope.fltr_latSW=40.37898227049007;
    $scope.fltr_longNS=-3.4771728515625;
    $scope.fltr_longSW=-3.8610076904296875;
    $scope.fltr_niveles=true;
    $scope.fltr_zoom=6;

    /* control de datos */
    $scope.datos;

    /* scopes for map */
    $scope.map;
    $scope.IDmapa="map_canvas";

    $scope.method = 'GET';
    $scope.url = '';
    $scope.header='';

    var a= 'http://infocar.dgt.es/etraffic/BuscarElementosServlet?' +
        'Camaras=' + $scope.fltr_camaras +
        '&IncidenciasEVENTOS=' + $scope.fltr_eventos +
        '&IncidenciasMETEOROLOGICA=' + $scope.fltr_meteorologia +
        '&IncidenciasOBRAS=' + $scope.fltr_obras +
        '&IncidenciasOTROS=' + $scope.fltr_otros +
        '&IncidenciasPUERTOS=' + $scope.fltr_puertos +
        '&IncidenciasRETENCION=' + $scope.fltr_retencion +
        '&Paneles=' + $scope.fltr_paneles +
        '&SensoresMeteorologico=' + $scope.fltr_est_meteorologica +
        '&SensoresTrafico=' + $scope.fltr_trafico +
        '&accion=' + "getElementos" +
        '&latNS=' + $scope.fltr_latNS +
        '&latSW=' + $scope.fltr_latSW +
        '&longNS=' + $scope.fltr_longNS +
        '&longSW=' + $scope.fltr_longSW +
        '&niveles=' + $scope.fltr_niveles +
        '&zoom=' + $scope.fltr_zoom;

    var b='dataModels/BuscarElementosServlet_0.json';

    $scope.url=b;

    $scope.getJson = function(){
        $http({method: $scope.method, url: $scope.url,header: $scope.header, cache: $templateCache}).
            success(function(data, status) {
                $scope.status = status;
                $scope.datos = data;
            }).
            error(function(data, status) {
                $scope.datos = data || "Request failed";
                $scope.status = status;
        });
    }

    $scope.createMap = function() {
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(

                function (position) {
                    $scope.fltr_latNS = position.coords.latitude;
                    $scope.fltr_longNS = position.coords.longitude;
                    mapServiceProvider($scope.fltr_latNS,$scope.fltr_longNS);
                },
                function (error)
                {
                    switch(error.code)
                    {
                        case error.TIMEOUT:
                            alert ('Timeout');
                            break;
                        case error.POSITION_UNAVAILABLE:
                            alert ('Position unavailable');
                            break;
                        case error.PERMISSION_DENIED:
                            alert ('Permission denied');
                            break;
                        case error.UNKNOWN_ERROR:
                            alert ('Unknown error');
                            break;
                    }
                }
            );
        }else{
            mapServiceProvider($scope.fltr_latSW,$scope.fltr_longSW);
        }
    }

    $scope.generateMarks = function() {
        var i=0;
        var lat;
        var lng;
        var ico;
        var title;

        while(i<=$scope.datos.length){

            lat=$scope.datos[i].lat;
            lng=$scope.datos[i].lng;

            if($scope.datos[i].tipo == 'Incidencia'){
                ico = incidentIcoResolutor($scope.datos[i].tipoInci);
            }else{
                ico = incidentIcoResolutor($scope.datos[i].tipo);
            }

            title = $scope.datos[i].tipo+" : "+ $scope.datos[i].alias;

            markServiceCreator(lat, lng, ico, title);

            i++;
        }
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
                break
        }
        return ico;

    }


    function mapServiceProvider(lat,lng) {
        var myOptions = {
            zoom: $scope.fltr_zoom,
            center: new google.maps.LatLng(lat,lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        $scope.map = new google.maps.Map(document.getElementById($scope.IDmapa),myOptions);
        markServiceCreator(lat,lng,incidentIcoResolutor('Me'),'latitud:'+lat+' longitud:'+lng);
    }


    function markServiceCreator(lat,lng,ico,title){
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat,lng),
            animation: google.maps.Animation.DROP,
            map: $scope.map,
            icon: ico,
            title: title
        });
    }

}
