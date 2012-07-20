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
    $scope.fltr_est_meteorologica=true;
    $scope.fltr_trafico=true;
    $scope.fltr_latNS = 44.29240108529005;
    $scope.fltr_latSW = 35.97800618085566;
    $scope.fltr_longNS = 7.4267578125;
    $scope.fltr_longSW= -16.80908203125;
    $scope.fltr_niveles=true;
    $scope.fltr_zoom=6;

    $scope.mapObj;

    /* control de datos */
    $scope.datos;

    $scope.method = 'GET';
    $scope.header='';

    $scope.url ='dataModels/dgtProxy.php?'+
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

    $scope.BeganToBegin = function (){
        $scope.getJson();
        $scope.createMap();
    }

    $scope.getJson = function(){
        $http({method: $scope.method, url: $scope.url,header: $scope.header, cache: $templateCache}).
            success(function(data, status) {
                $scope.status = status;
                $scope.datos = data;

                //TODO: quitar esto de aqui , es cohesionar totalmente el codigo !!!!
                $scope.generateMarks();
            }).
            error(function(data, status) {
                $scope.datos = data || "Request failed";
                $scope.status = status;
        });
    }

    $scope.updateJson = function (){
        $scope.url ='dataModels/dgtProxy.php?'+
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
            '&latNS=' + getMapLatNS($scope.mapObj) +
            '&latSW=' + getMapLatSW($scope.mapObj) +
            '&longNS=' + getMapLongNS($scope.mapObj) +
            '&longSW=' + getMapLongSW($scope.mapObj) +
            '&niveles=' + $scope.fltr_niveles +
            '&zoom=' + getMapZoom($scope.mapObj);
        alert($scope.url);
        //$scope.getJson();
    }

    $scope.createMap = function() {
        $scope.mapObj = mapServiceProvider($scope.fltr_latNS,$scope.fltr_longNS,$scope.fltr_zoom);

        if (navigator.geolocation){
            getMyPosition();
        }
    }

    $scope.generateMarks = function() {
        var i=0;
        var lat;
        var lng;
        var ico;
        var title;

        //clearPoisDGT();

        while(i<=$scope.datos.length-1){
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
