/*Services for map */
'use strict';

var module;
var httpRequester;
var markerCreator;
var poisDGT = [];


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
    var URL;

    var fltr_latNS = 40.69625781921317;// objMap.getLatNS();
    var fltr_latSW =  40.177824065238816;// objMap.getLatSW();
    var fltr_longNS = -2.900390625;// objMap.getLongNS();
    var fltr_longSW = -4.43572998046875;// objMap.getLongSW();
    var fltr_zoom = 9;


    var URL = 'dataModels/BuscarElementosServlet_y.json'; //URL of the service
    //var URL2 = 'dataModels/BuscarElementosServlet_2.json'; //URL of the service

    return {
        firstCall:function (objMap,fltr_camaras,fltr_eventos,fltr_meteorologia,fltr_obras,fltr_otros,fltr_puertos,fltr_retencion,fltr_paneles){

            fltr_zoom = objMap.getZoom();

            /*var URL ='dataModels/dgtProxy.php?'+ 'Camaras=' + fltr_camaras +'&IncidenciasEVENTOS=' + fltr_eventos +
                '&IncidenciasMETEOROLOGICA=' + fltr_meteorologia +'&IncidenciasOBRAS=' + fltr_obras +'&IncidenciasOTROS=' + fltr_otros +
                '&IncidenciasPUERTOS=' + fltr_puertos +'&IncidenciasRETENCION=' + fltr_retencion +'&Paneles=' + fltr_paneles +
                '&SensoresMeteorologico=false&SensoresTrafico=false&accion=' + "getElementos" +
                '&latNS=' + fltr_latNS + '&latSW=' + fltr_latSW + '&longNS=' + fltr_longNS +'&longSW=' + fltr_longSW +
                '&niveles=true&zoom=' + fltr_zoom;*/

            httpRequester ($http,method,URL,objMap);

            return true;
        },
        refreshCall:function (objMap,fltr_camaras,fltr_eventos,fltr_meteorologia,fltr_obras,fltr_otros,fltr_puertos,fltr_retencion,fltr_paneles){
            /*var URL ='dataModels/dgtProxy.php?'+ 'Camaras=' + fltr_camaras +'&IncidenciasEVENTOS=' + fltr_eventos +
                '&IncidenciasMETEOROLOGICA=' + fltr_meteorologia +'&IncidenciasOBRAS=' + fltr_obras +'&IncidenciasOTROS=' + fltr_otros +
                '&IncidenciasPUERTOS=' + fltr_puertos +'&IncidenciasRETENCION=' + fltr_retencion +'&Paneles=' + fltr_paneles +
                '&SensoresMeteorologico=false&SensoresTrafico=false&accion=' + "getElementos" +
                '&latNS=' + fltr_latNS + '&latSW=' + fltr_latSW + '&longNS=' + fltr_longNS +'&longSW=' + fltr_longSW +
                '&niveles=true&zoom=' + fltr_zoom;*/

            fltr_latNS = objMap.getLatNS();
            fltr_latSW = objMap.getLatSW();
            fltr_longNS = objMap.getLongNS();
            fltr_longSW = objMap.getLongSW();
            fltr_zoom = objMap.getZoom();

            //httpRequester ($http,method,URL,objMap);

            return true;
        }
    };
});

// TODO:ANOTHER MOTHER OF THE LAMB
httpRequester = function ($http,method, URL,objMap) {
    var dato;
    var dgtMarker;

    // First Sanitize the POIS array
    for (dgtMarker in poisDGT){ poisDGT[dgtMarker].clearMark();}

    $http({method: method, url: URL}).
        success(function(data, status) {
            //Second refill the array with the news POIS
            for (dato in data){ poisDGT.push(markerCreator(data[dato],objMap));}
            return true;
        }).
        error(function(data, status) {
            return false;
        });
}

markerCreator = function (dato,objMap){
    var myOptions = {
        lat:dato.lat,
        lng:dato.lng,
        draggable: false,
        objMap: objMap,
        icon_a: dato.tipo,
        icon_b: dato.tipoInci,
        title: dato.tipo+" : "+ dato.alias
    }
    var markObject = new markerObject (myOptions);
    markObject.registerMapEvent ('click',function(){
        alert(myOptions.title);
    })
    return markObject;
}



