/*Services for map */
'use strict';

var module;
var markerCreator;
var clusterCreator;

var getMeTheDetails;
var infoWindowForAllPurpose;

module = angular.module('trafic_app.services',['ngResource']);

// --------- THE MAPS  --------- \\
//These service create the map and trigger the geolocalization on.
module.factory('mapServiceProvider', function (){
    var myOptions = {};
    var mapa = new mapObject (myOptions);   //mapObject is an interface for google map API
    mapa.positionTrack();                   //swicht on the geolocalization (if is available)
    return mapa;                            //returning the google map object
});

// --------- THE DATASETS  --------- \\
//These service only get data for the data sets, is AngularJS 100%
module.factory('dataServiceProvider', function ($resource){
    return $resource('dataModels/:file', {}, {
        query: {method:'GET', params:{file:''}, isArray:true}
    });
});

// --------- THE POIS  --------- \\
//These service generate all the POIS and clusters in especifics method for especifics elements
module.factory('poiServiceCreator',function (){
    var dato;

    return {
        //Camera cluster
        createCamerasCluster: function (data,objMap){
            var poisCamera = new Array(); //array for the markers
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
            }; //especific options for the cluster
            for (dato in data){
                poisCamera.push(markerCreator(data[dato],objMap)); //create and store a new mark every time is a new data available
            }

            return clusterCreator (objMap.mapInstance,poisCamera,myOptions); //create a cluster with all the markeres returned and stored
        },
        //Panel cluster
        createPanelsCluster: function (data,objMap){
            var poisPanels = new Array(); //array for the markers
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
            }; //especific options for the cluster

            for (dato in data){
                poisPanels.push(markerCreator(data[dato],objMap)); //create and store a new mark every time is a new data available
            }

            return clusterCreator (objMap.mapInstance,poisPanels,myOptions); //create a cluster with all the markeres returned and stored
        },
        //Meteo sensors cluster
        createMeteoCluster: function (data,objMap){
            var poisMeteo = new Array(); //array for the markers
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
            }; //especific options for the cluster

            for (dato in data){
                poisMeteo.push(markerCreator(data[dato],objMap)); //create and store a new mark every time is a new data available
            }
            return clusterCreator (objMap.mapInstance,poisMeteo,myOptions); //create a cluster with all the markeres returned and stored
        },
        //Traffic sensors cluster
        createSensoresCluster: function (data,objMap){
            var poisSensores = new Array(); //array for the markers
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
            }; //especific options for the cluster

            for (dato in data){
                poisSensores.push(markerCreator(data[dato],objMap)); //create and store a new mark every time is a new data available
            }
            return clusterCreator (objMap.mapInstance,poisSensores,myOptions); //create a cluster with all the markeres returned and stored
        },
        //Only ONE personalized POI per call
        createGenericPoi: function (data,objMap){
            return markerCreator (data,objMap);
        }
    };
});

// --------- THE AUX METHODS  --------- \\
//Marker creator
markerCreator = function (dato,objMap){
    var myOptions = {
        lat:dato.lat,
        lng:dato.lng,
        position:dato.position,
        draggable: false,
        objMap: objMap,
        icon: dato.tipo,
        title: dato.tipo+" : "+ dato.alias
    };// retriving and matching the especific options for this marker
    var markObject = new markerObject (myOptions);  //markerObject is an interface for google map API

    //TODO: this will be in the controller NOT in the SERVICE
    markObject.registerMapEvent ('click',function(){

        var codEle = dato.codEle;
        var tipo = dato.tipo;


        var uri= 'dataModels/dgtProxy.php?codEle='+codEle+'&tipo='+tipo;

        if(tipo=='Camara'){
           getMeTheDetails (uri);
        }

    });

    //TODO: Why .markerInstance?
    return markObject.markerInstance;
};

getMeTheDetails = function (param){
 var jqxhr = $.getJSON(param , function(data) {
        var img = 'http://www.dgt.es/camaras/'+data.imagen;
        var tmpstp = data.fecha.split(' ');
        var lstParams = {
            imagen: img,
            tiempo: tmpstp[1]
        };
        infoWindowForAllPurpose (lstParams);
        $('#response').html(JSON.stringify( data) );
    })
    .error(function() {})
    .complete(function() {});
    console.log('response ',jqxhr);
};

infoWindowForAllPurpose = function (params){
    $('#myModal').modal('toggle');
    $('#modal-body-img').attr('src',params.imagen);
    $('#modal-body-timestamp').html(params.tiempo);

};

//TODO: this will we abstracted to scriptAux, who really implement the google API.
//Cluster creator
clusterCreator = function (objMap,markers,myOptions){
    return new MarkerClusterer(objMap, markers, myOptions);
};