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
    $scope.fltr_est_meteorologica = false;  //no cambiar
    $scope.fltr_trafico = false;            //no cambiar
    $scope.fltr_latNS = 44.29240108529005;  //no cambiar
    $scope.fltr_latSW = 35.97800618085566;  //no cambiar
    $scope.fltr_longNS = 7.4267578125;      //no cambiar
    $scope.fltr_longSW= -16.80908203125;    //no cambiar
    $scope.fltr_niveles=true;               //no cambiar
    $scope.fltr_zoom=6;

    $scope.mapObj;

    /* contexto general de los datos de las peticiones de los servicios de la DGT */
    $scope.datos;

    /* peticiones al servicio de la DGT */
    $scope.method = 'GET';
    $scope.header='';
   /* $scope.url ='dataModels/dgtProxy.php?'+
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
    */

    $scope.url='dataModels/BuscarElementosServlet_0.json';

    $scope.BeganToBegin = function (){
        $scope.createMap();
    }

    $scope.getJson = function(){
        $http({method: $scope.method, url: $scope.url,header: $scope.header, cache: $templateCache}).
            success(function(data, status) {
                $scope.status = status;
                $scope.datos = data;
                $scope.generateMarks();
            }).
            error(function(data, status) {
                $scope.datos = data || "Request failed";
                $scope.status = status;
        });
    }

    $scope.updateJson = function (){
        alert('zoom'+$scope.fltr_zoom);
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
        $scope.mapObj = mapServiceProvider();
        if (navigator.geolocation){
            //TODO: quitar esto de aqui , es cohesionar totalmente el codigo !!!!
            getMyPosition();
        }
        //TODO: quitar esto de aqui , es cohesionar totalmente el codigo !!!!
        $scope.getJson();
    }

    $scope.generateMarks = function() {
        var i=0;
        var lat;
        var lng;
        var ico;
        var title;

        while(i<=$scope.datos.length-1){

            lat=$scope.datos[i].lat;
            lng=$scope.datos[i].lng;
            ico = icoResolutor($scope.datos[i].tipo,$scope.datos[i].tipoInci);
            title = $scope.datos[i].tipo+" : "+ $scope.datos[i].alias;

            addPoisDGT(lat, lng, ico, title);

            i++;
        }

    }


}
