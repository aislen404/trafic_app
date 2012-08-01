/*Services for map */
    'use strict';

    var module;

    module = angular.module('trafic_app.services',['ngResource']);

    module.factory('mapServiceProvider', function (){
        var myOptions = {
        }

        var mapa = new mapObject (myOptions);

        mapa.positionTrack();

        return mapa;
    });

    module.factory('dgtServiceProvider', function ($resource){

        var respuesta;
        /* var URL ='dataModels/dgtProxy.php?'+'Camaras=' + $scope.fltr_camaras +'&IncidenciasEVENTOS=' + $scope.fltr_eventos +
         '&IncidenciasMETEOROLOGICA=' + $scope.fltr_meteorologia +'&IncidenciasOBRAS=' + $scope.fltr_obras +'&IncidenciasOTROS=' + $scope.fltr_otros +
         '&IncidenciasPUERTOS=' + $scope.fltr_puertos +'&IncidenciasRETENCION=' + $scope.fltr_retencion +'&Paneles=' + $scope.fltr_paneles +
         '&SensoresMeteorologico=' + $scope.fltr_est_meteorologica +'&SensoresTrafico=' + $scope.fltr_trafico +'&accion=' + "getElementos" +
         '&latNS=' + $scope.fltr_latNS + '&latSW=' + $scope.fltr_latSW + '&longNS=' + $scope.fltr_longNS +'&longSW=' + $scope.fltr_longSW +
         '&niveles=' + $scope.fltr_niveles +'&zoom=' + $scope.fltr_zoom;*/

        var URL = 'dataModels/BuscarElementosServlet_0.json';

        respuesta = $resource(URL, {}, {
            query: {method:'GET', params:{}, isArray:true}
        });

        console.log('response de module.factory("dgtServiceProvider") -->', respuesta);

        return respuesta;
    });

    // For POIS retrived of DGT services
    module.factory('markServiceProvider', function () {
       /* var myOptions = {
        }

        var mark = new markObject (myOptions);



        return mark;*/
        return true
    });



