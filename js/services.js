/*Services for map */
'use strict';

var module;
var httpRequester;
var markerCreator;
var clusterCreator;

var objMarkerCluster; //TODO: Esto no me mola aqui pero ni un cacho, no puede ser un objeto de mapa global

module = angular.module('trafic_app.services',['ngResource']);

module.factory('mapServiceProvider', function (){
    var myOptions = {
    };
    var mapa = new mapObject (myOptions);

    mapa.positionTrack();

    return mapa;
});

module.factory('dgtServiceProvider', function ($http){

    var method ='GET';      //method for http load
    var URL = 'dataModels/BuscarElementosServlet_y.json'; //URL of the service

    return {
        call:function (mapObj,filtros){

            httpRequester ($http,method,URL,mapObj,filtros);

            return true;
        }
    };
});

httpRequester = function ($http,method, URL,objMap,filtros) {
    var dato,tipo,filter,i=0;
    var poisDGT = [];

    $http({method: method, url: URL}).
        success(function(data, status) {
            //Refill the array with the news POIS
            for (dato in data){
                tipo = data[dato].tipo;
                for (filter in filtros){
                    if(tipo==filtros[filter]){
                        //Markers
                        poisDGT.push(markerCreator(data[dato],objMap));
                        i+=1;
                    }
                }
            }
            //Cluster of Markers
            clusterCreator (objMap.mapInstance,poisDGT);

            return true;
        }).
        error(function(data, status) {
            return false;
        });
};

markerCreator = function (dato,objMap){
    var myOptions = {
        lat:dato.lat,
        lng:dato.lng,
        draggable: false,
        objMap: objMap,
        icon: dato.tipo,
        title: dato.tipo+" : "+ dato.alias
    };
    var markObject = new markerObject (myOptions);
    markObject.registerMapEvent ('click',function(){
        alert(myOptions.title);
    });
    return markObject.markerInstance;
};

clusterCreator = function (objMap,markers){

    try{
        objMarkerCluster.clearMarkers();
    }catch(err){
        console.log('Error en la inicializacion del cluster de markers',err.number);
    }

    var myOptions = {
        gridSize: 50,
        maxZoom: 12
    };

    objMarkerCluster = new MarkerClusterer(objMap, markers, myOptions);
    return objMarkerCluster;
};


