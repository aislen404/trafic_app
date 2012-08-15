/*Services for map */
'use strict';

var module;
var markerCreator;
var clusterCreator;
 //TODO: Esto no me mola aqui pero ni un cacho, no puede ser un objeto de mapa global

module = angular.module('trafic_app.services',['ngResource']);

//These service create the map and trigger on the geolocalization.
module.factory('mapServiceProvider', function (){
    var myOptions = {};
    var mapa = new mapObject (myOptions);
    mapa.positionTrack();
    return mapa;
});

//These service get data for the dgtServices and creates the POIS.
module.factory('dataServiceProvider', function ($resource){
    return $resource('dataModels/:file', {}, {
        query: {method:'GET', params:{file:''}, isArray:true}
    });
});


module.factory('poiServiceCreator',function (){
    var dato;

    return {
        createCamerasCluster: function (data,objMap){
            var poisCamera = new Array();
            var myOptions = {
                gridSize: 50,
                maxZoom: 12,
                styles: [{
                url: 'img/camaras_green.png',
                height: 32,
                width: 32,
                anchor: [8,0],
                textColor: '#000',
                textSize: 11
            }, {
                url: 'img/camaras_yellow.png',
                height: 42,
                width: 42,
                anchor: [14,0],
                textColor: '#000',
                textSize: 12
            }, {
                url: 'img/camaras_red.png',
                height: 52,
                width: 52,
                anchor: [20,0],
                textColor: '#000',
                textSize: 13
            }]
            };
            for (dato in data){
                poisCamera.push(markerCreator(data[dato],objMap));
            }

            return clusterCreator (objMap.mapInstance,poisCamera,myOptions);
        },
        createPanelsCluster: function (data,objMap){
            var poisPanels = new Array();
            var myOptions = {
                gridSize: 75,
                maxZoom: 13,
                styles: [{
                    url: 'img/panel_green.png',
                    height: 32,
                    width: 32,
                    anchor: [8,0],
                    textColor: '#000',
                    textSize: 11
                }, {
                    url: 'img/panel_yellow.png',
                    height: 42,
                    width: 42,
                    anchor: [12,0],
                    textColor: '#000',
                    textSize: 12
                }, {
                    url: 'img/panel_red.png',
                    height: 52,
                    width: 52,
                    anchor: [17,0],
                    textColor: '#000',
                    textSize: 13
                }]
            };

            for (dato in data){
                poisPanels.push(markerCreator(data[dato],objMap));
            }

            return clusterCreator (objMap.mapInstance,poisPanels,myOptions);
        },
        createMeteoCluster: function (data,objMap){
            var poisMeteo = new Array();
            var myOptions = {
                gridSize: 100,
                maxZoom: 14,
                styles: [{
                    url: 'img/sensorMetorologico_green.png',
                    height: 32,
                    width: 32,
                    anchor: [8,0],
                    textColor: '#000',
                    textSize: 11
                }, {
                    url: 'img/sensorMetorologico_yellow.png',
                    height: 42,
                    width: 42,
                    anchor: [14,0],
                    textColor: '#000',
                    textSize: 12
                }, {
                    url: 'img/sensorMetorologico_red.png',
                    height: 52,
                    width: 52,
                    anchor: [20,0],
                    textColor: '#000',
                    textSize: 13
                }]
            };

            for (dato in data){
                poisMeteo.push(markerCreator(data[dato],objMap));
            }
            return clusterCreator (objMap.mapInstance,poisMeteo,myOptions);
        },
        createSensoresCluster: function (data,objMap){
            var poisSensores = new Array();
            var myOptions = {
                gridSize: 100,
                maxZoom: 14,
                styles: [{
                    url: 'img/sensorTrafico_green.png',
                    height: 32,
                    width: 32,
                    anchor: [8,0],
                    textColor: '#000',
                    textSize: 11
                }, {
                    url: 'img/sensorTrafico_yellow.png',
                    height: 42,
                    width: 42,
                    anchor: [14,0],
                    textColor: '#000',
                    textSize: 12
                }, {
                    url: 'img/sensorTrafico_red.png',
                    height: 52,
                    width: 52,
                    anchor: [20,0],
                    textColor: '#000',
                    textSize: 13
                }]
            };

            for (dato in data){
                poisSensores.push(markerCreator(data[dato],objMap));
            }
            return clusterCreator (objMap.mapInstance,poisSensores,myOptions);
        }
    };
});


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
clusterCreator = function (objMap,markers,myOptions){
    return new MarkerClusterer(objMap, markers, myOptions);
};