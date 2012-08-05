/*Services for map */
'use strict';

var module;
var httpRequester;

module = angular.module('trafic_app.services',['ngResource']);

module.factory('mapServiceProvider', function (){
    var myOptions = {
    }

    var mapa = new mapObject (myOptions);

    mapa.positionTrack();

    return mapa;
});

module.factory('dgtServiceProvider', function ($http){

    var i=0;                //counter
    var lat,lng,ico,title;  //data details  for marks
    var datos;              //data of http load
    var method ='GET';      //method for http load

    var fltr_latNS = 40.69625781921317;// objMap.getLatNS();
    var fltr_latSW =  40.177824065238816;// objMap.getLatSW();
    var fltr_longNS = -2.900390625;// objMap.getLongNS();
    var fltr_longSW = -4.43572998046875;// objMap.getLongSW();
    var fltr_zoom = 9;


    //var URL = 'dataModels/BuscarElementosServlet_0.json'; //URL of the service

    //WHY I DO TWO FUNCTIONS SO SIMILARS !!: is the easy way to scape from the problem of undefined in getBounds.
    //First you need a params by default, after the map is totally rendered the object is "full" and not is undefinded.

    return {
        firstCall:function (objMap,fltr_camaras,fltr_eventos,fltr_meteorologia,fltr_obras,fltr_otros,fltr_puertos,fltr_retencion,fltr_paneles){

            fltr_zoom = objMap.getZoom();

            var URL ='dataModels/dgtProxy.php?'+ 'Camaras=' + fltr_camaras +'&IncidenciasEVENTOS=' + fltr_eventos +
                '&IncidenciasMETEOROLOGICA=' + fltr_meteorologia +'&IncidenciasOBRAS=' + fltr_obras +'&IncidenciasOTROS=' + fltr_otros +
                '&IncidenciasPUERTOS=' + fltr_puertos +'&IncidenciasRETENCION=' + fltr_retencion +'&Paneles=' + fltr_paneles +
                '&SensoresMeteorologico=false&SensoresTrafico=false&accion=' + "getElementos" +
                '&latNS=' + fltr_latNS + '&latSW=' + fltr_latSW + '&longNS=' + fltr_longNS +'&longSW=' + fltr_longSW +
                '&niveles=true&zoom=' + fltr_zoom;

            console.log('firstCall:function',URL);
            httpRequester ($http,method,URL);

            return true;
        },
        refreshCall:function (objMap,fltr_camaras,fltr_eventos,fltr_meteorologia,fltr_obras,fltr_otros,fltr_puertos,fltr_retencion,fltr_paneles){

            fltr_latNS = objMap.getLatNS();
            fltr_latSW = objMap.getLatSW();
            fltr_longNS = objMap.getLongNS();
            fltr_longSW = objMap.getLongSW();
            fltr_zoom = objMap.getZoom();

            var URL ='dataModels/dgtProxy.php?'+ 'Camaras=' + fltr_camaras +'&IncidenciasEVENTOS=' + fltr_eventos +
                '&IncidenciasMETEOROLOGICA=' + fltr_meteorologia +'&IncidenciasOBRAS=' + fltr_obras +'&IncidenciasOTROS=' + fltr_otros +
                '&IncidenciasPUERTOS=' + fltr_puertos +'&IncidenciasRETENCION=' + fltr_retencion +'&Paneles=' + fltr_paneles +
                '&SensoresMeteorologico=false&SensoresTrafico=false&accion=' + "getElementos" +
                '&latNS=' + fltr_latNS + '&latSW=' + fltr_latSW + '&longNS=' + fltr_longNS +'&longSW=' + fltr_longSW +
                '&niveles=true&zoom=' + fltr_zoom;

            console.log('refreshCall:function',URL);
            httpRequester ($http,method,URL);

            return true;
        }
    };
});
// TODO:ANOTHER MOTHER OF THE LAMB

httpRequester = function ($http,method, URL) {
    var datos,lat,lng,ico,title,i=0;

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
}



