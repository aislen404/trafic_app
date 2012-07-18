'use strict';

/* Controllers */

function trafficFilterCtrl ($scope, $http, $templateCache) {

    /* scopes for filters */
    $scope.fltr_camaras=true;
    $scope.fltr_eventos=true;
    $scope.fltr_meteorologia=true;
    $scope.fltr_obras=true;
    $scope.fltr_otros=true;
    $scope.fltr_puertos=true;
    $scope.fltr_retencion=true;
    $scope.fltr_paneles=true;
    $scope.fltr_est_meteorologica=false;
    $scope.fltr_trafico=false;
    $scope.fltr_latNS=43.89789239125797;
    $scope.fltr_latSW=35.53222622770337;
    $scope.fltr_longNS=8.76708984375;
    $scope.fltr_longSW=-15.468750000000002;
    $scope.fltr_niveles=true;
    $scope.fltr_zoom=6;

    /* control de datos */
    $scope.datos;

    /* scopes for map */
    $scope.IDmapa="map_canvas";

    $scope.method = 'GET';
    $scope.url = '';
    $scope.header='';

    $scope.myLatitude = $scope.fltr_latNS;
    $scope.myLongitude = $scope.fltr_longNS;

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

    var c='dataModels/dgtProxy.php?'+
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

    var d='dataModels/BuscarElementosServlet_x.json';

    $scope.url=b;

    $scope.BeganToBegin = function (){
        $scope.getJson();
        $scope.createMap();
    }

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
                    $scope.myLatitude=position.coords.latitude;
                    $scope.myLongitude=position.coords.longitude;
                    mapServiceProvider($scope.myLatitude,$scope.myLongitude,$scope.IDmapa,$scope.fltr_zoom);
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
            $scope.myLatitude = $scope.fltr_latNS;
            $scope.myLongitude = $scope.fltr_longNS;
            mapServiceProvider($scope.myLatitude,$scope.myLongitude,$scope.IDmapa,$scope.fltr_zoom);
        }

    }

    $scope.generateMarks = function() {
        var i=0;
        var lat=$scope.myLatitude;
        var lng=$scope.myLongitude;
        var ico;
        var title;

        title = 'latitud:'+$scope.myLatitude+' longitud:'+$scope.myLongitude;
        addPoisDGT($scope.myLatitude,$scope.myLongitude,incidentIcoResolutor('Me'), title);

        while(i<=$scope.datos.length){

            lat=$scope.datos[i].lat;
            lng=$scope.datos[i].lng;

            if($scope.datos[i].tipo == 'Incidencia'){
                ico = incidentIcoResolutor($scope.datos[i].tipoInci);
            }else{
                ico = incidentIcoResolutor($scope.datos[i].tipo);
            }

            title = $scope.datos[i].tipo+" : "+ $scope.datos[i].alias;
            addPoisDGT(lat, lng, ico, title);
            i++;
        }

    }
}
