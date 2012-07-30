/*Services for map */

    'use strict';

    var module;

    module = angular.module('trafic_app.services',[]);

    module.factory('mapServiceProvider', function (){
        var myOptions = {
        }

        var mapa = new mapObject (myOptions);

        mapa.positionTrack();

        return mapa;
    });


    module.factory('queryDgt',['$http', function ($http){

        /* $scope.url ='dataModels/dgtProxy.php?'+'Camaras=' + $scope.fltr_camaras +'&IncidenciasEVENTOS=' + $scope.fltr_eventos +
         '&IncidenciasMETEOROLOGICA=' + $scope.fltr_meteorologia +'&IncidenciasOBRAS=' + $scope.fltr_obras +'&IncidenciasOTROS=' + $scope.fltr_otros +
         '&IncidenciasPUERTOS=' + $scope.fltr_puertos +'&IncidenciasRETENCION=' + $scope.fltr_retencion +'&Paneles=' + $scope.fltr_paneles +
         '&SensoresMeteorologico=' + $scope.fltr_est_meteorologica +'&SensoresTrafico=' + $scope.fltr_trafico +'&accion=' + "getElementos" +
         '&latNS=' + $scope.fltr_latNS + '&latSW=' + $scope.fltr_latSW + '&longNS=' + $scope.fltr_longNS +'&longSW=' + $scope.fltr_longSW +
         '&niveles=' + $scope.fltr_niveles +'&zoom=' + $scope.fltr_zoom;
         */

        var queryDgt = {
            get: function (){
                var URL = 'dataModels/BuscarElementosServlet_0.json';

                return $http({method: 'GET', url: URL}).
                    success(function(data, status) {
                        alert (status);
                        alert (data);
                        console.log('Entries loaded from server:', data);
                    }).
                    error(function(data, status) {
                        alert ( data || "Request failed");
                        alert ( status);
                        console.log('FAILED: NOT DATA loaded from server:', status);
                    });
            }
        };

        return queryDgt;

    }]);


    /* For POIS retrived of DGT services */
    module.factory('addPoisDGT', function ($rootScope) {
         var i=0;
         var lat;
         var lng;
         var ico;
         var title;

/*         while(i<=$rootScope.datos.length-1){

             lat=$rootScope.datos[i].lat;
             lng=$rootScope.datos[i].lng;
             ico = icoResolutor($rootScope.datos[i].tipo,$rootScope.datos[i].tipoInci);
             title = $rootScope.datos[i].tipo+" : "+ $rootScope.datos[i].alias;

             poisDGT.push(new google.maps.Marker({
                 position: new google.maps.LatLng(lat,lng),
                 draggable: false,
                 map: objMap,
                 animation: google.maps.Animation.DROP,
                 icon: icon,
                 title: title
             }));

             i++;
         }*/
    });



