/*Services for map */
'use strict';

var module;
var mapa;

module = angular.module('trafic_app.services',['ngResource']);

module.factory('mapServiceProvider', function (){
    var myOptions = {
    }

    mapa = new mapObject (myOptions);

    mapa.positionTrack();

    return mapa;
});

module.factory('dgtServiceProvider', function ($http){

    var i=0;                //counter
    var lat,lng,ico,title;  //data details  for marks
    var datos;              //data of http load
    var method ='GET';      //method for http load

    //var URL = 'dataModels/BuscarElementosServlet_0.json'; //URL of the service

    return {
        call:function (fltr_camaras,fltr_eventos,fltr_meteorologia,fltr_obras,fltr_otros,fltr_puertos,fltr_retencion,fltr_paneles){

            //TODO: PROBLEMAS CON EL GETBOUND DEL OBJMAP

            var fltr_latNS;// = mapa.getLatNS();
            var fltr_latSW;// = mapa.getLatSW();
            var fltr_longNS;// = mapa.getLongNS();
            var fltr_longSW;// = mapa.getLongSW();
            var fltr_zoom;// = mapa.getZoom();

            var URL ='dataModels/dgtProxy.php?'+ 'Camaras=' + fltr_camaras +'&IncidenciasEVENTOS=' + fltr_eventos +
                '&IncidenciasMETEOROLOGICA=' + fltr_meteorologia +'&IncidenciasOBRAS=' + fltr_obras +'&IncidenciasOTROS=' + fltr_otros +
                '&IncidenciasPUERTOS=' + fltr_puertos +'&IncidenciasRETENCION=' + fltr_retencion +'&Paneles=' + fltr_paneles +
                '&SensoresMeteorologico=false&SensoresTrafico=false&accion=' + "getElementos" +
                '&latNS=' + fltr_latNS + '&latSW=' + fltr_latSW + '&longNS=' + fltr_longNS +'&longSW=' + fltr_longSW +
                '&niveles=true&zoom=' + fltr_zoom;

            /*
            $http({method: method, url: URL}).
                success(function(data, status) {
                    datos = data;
                    while(i<=datos.length-1){
                        lat=datos[i].lat;
                        lng=datos[i].lng;
                        ico = icoResolutor(datos[i].tipo,datos[i].tipoInci);
                        title = datos[i].tipo+" : "+ datos[i].alias;

                        // THE MOTHER OF THE LAMB
                        console.log ('poisDGT.push',lat,lng,ico,title,objMap);

                        i++;
                    }
                    return status;
                }).
                error(function(data, status) {
                    return status;
                });
            */
            // TODO:ANOTHER MOTHER OF THE LAMB
            console.log('refreshCall:function',URL);

            return true;
        }
    };
});




