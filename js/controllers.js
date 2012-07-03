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

    var b='dataModels/BuscarElementosServlet_1.json';

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
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(

                function (position) {
                    mapServiceProvider(position.coords.latitude,position.coords.longitude);
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

    function mapServiceProvider(lat,lng,obj,id) {
        var myOptions = {
            zoom: $scope.fltr_zoom,
            center: new google.maps.LatLng(lat,lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        $scope.map = new google.maps.Map(document.getElementById($scope.IDmapa),myOptions);

        markServiceCreator(lat,lng,'me');
    }

    function markServiceCreator(lat,lng,ico){
        /* marcador de posición */
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat,lng),
            animation: google.maps.Animation.DROP,
            map: $scope.map,
            icon: 'img/'+ico+'.png'//,
            //title: $scope.datos[i].tipo+" : "+ $scope.datos[i].alias
        });
    }

    $scope.generateMarks = function() {
        var i=0;
        var lat;
        var lng;
        var myLatLng;
        var marker;

        while(i<=$scope.datos.length){

            lat=$scope.datos[i].lat;
            lng=$scope.datos[i].lng;

            markServiceCreator(lat, lng, $scope.datos[i].tipo);
            /*myLatLng = new google.maps.LatLng(lat,lng);

             marcador de posición
            var marker = new google.maps.Marker({
                position: myLatLng,
                animation: google.maps.Animation.DROP,
                map: $scope.map,
                icon: 'img/'+$scope.datos[i].tipo+'.png',
                title: $scope.datos[i].tipo+" : "+ $scope.datos[i].alias
            });*/

            i++;
        }
    }
}

/*
precision "1"

fecha "06/03/2012"

poblacion "CABEZON DE PISUERGA"

alias "OBRAS / A-62 (112.0 - 114.5 )"

sentido "CRECIENTE DE LA KILOMETRACIÓN"

descripcion "<strong>OBRA /\n ...>ARCÉN CERRADO</strong>"

tipoInci "OBRAS"

lng -4.6597533

pkFinal 114.5

provincia "VALLADOLID"

codEle "386218"

causa "OBRAS"

carretera "A-62"

hora "13:11"

estado 1

pkIni 112

icono "INC_RMT_RWL_LS4_CAC.png"

tipo "Incidencia"

lat 41.743443

nivel "VERDE"
*/