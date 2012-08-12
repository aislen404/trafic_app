/*Services for map */
'use strict';

var module;
var httpRequester;
var markerCreator;
var clusterCreator;

var allOK;

var objMarkerCluster; //TODO: Esto no me mola aqui pero ni un cacho, no puede ser un objeto de mapa global

module = angular.module('trafic_app.services',['ngResource']);

//These service create the map and trigger on the geolocalization.
module.factory('mapServiceProvider', function (){
    var myOptions = {
    };
    var mapa = new mapObject (myOptions);

    mapa.positionTrack();

    return mapa;
});

//These service get data for the dgtServices and creates the POIS.
module.factory('dgtServiceProvider', function ($http){
    var URL = 'dataModels/BuscarElementosServlet_y.json'; //URL of the service

    return {
        call:function (mapObj,filtros){

        console.log('haber que ostias hay', httpRequester ($http,URL,mapObj,filtros));

        }
    };
});

//Data getter
httpRequester = function ($http, URL,objMap,filtros) {

      $http.get(URL).
        success(function(data, status) {
              allOK(data,status,filtros,objMap);
             return data;

        }).
        error(function(data, status) {
            return data;
        });

};

allOK = function (data,status,filtros,objMap) {
    var dato,tipo,filter,i=0;
    var poisDGT = [];

    //Refill the array with the news POIS
    for (dato in data){
        tipo = data[dato].tipo;
        //filter the data under the Model-View binding
        for (filter in filtros){
            if(tipo==filtros[filter]){
                //Create markers
                poisDGT.push(markerCreator(data[dato],objMap));
                i+=1;
            }
        }
    }
    //Cluster of markers
    clusterCreator (objMap.mapInstance,poisDGT);
}

//Marker creator
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

//TODO: this will we abstracted to scriptAux, who really implement the google API.
//Cluster creator
clusterCreator = function (objMap,markers){
    //Is needed clear all the markers before repaint it.
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
};


