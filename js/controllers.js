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
                    $scope.map = mapServiceProvider($scope.fltr_latNS,$scope.fltr_longNS,$scope.IDmapa,$scope.fltr_zoom);
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
            $scope.map = mapServiceProvider($scope.fltr_latNS,$scope.fltr_longNS,$scope.IDmapa,$scope.fltr_zoom);
        }
    }

    $scope.generateMarks = function() {
        var i=0;
        var lat=$scope.fltr_latNS;
        var lng=$scope.fltr_longNS;
        var ico;
        var title;
        var objMap = $scope.map;

        title = 'latitud:'+lat+' longitud:'+lng;
        markServiceCreator(lat,lng,incidentIcoResolutor('Me'), title, objMap);

        while(i<=$scope.datos.length){

            lat=$scope.datos[i].lat;
            lng=$scope.datos[i].lng;

            if($scope.datos[i].tipo == 'Incidencia'){
                ico = incidentIcoResolutor($scope.datos[i].tipoInci);
            }else{
                ico = incidentIcoResolutor($scope.datos[i].tipo);
            }

            title = $scope.datos[i].tipo+" : "+ $scope.datos[i].alias;
            markServiceCreator(lat, lng, ico, title , objMap);

            i++;
        }

    }
}
