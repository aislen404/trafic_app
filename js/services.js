/*Services for map */
'use strict';

var module;
var markerCreator;
var clusterCreator;

var getMeTheDetailsDGT;
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
        //Gaz Stations cluster
        createGazCluster: function (arrayOfMarkers,objMap){
            var myOptions = {
                gridSize: 100,
                maxZoom: 14,
                styles: [{
                    url: 'img/m1.png',
                    height: 53,
                    width: 52,
                    anchor: [0,0],
                    textColor: '#000',
                    textSize: 11
                }, {
                    url: 'img/m2.png',
                    height: 56,
                    width: 55,
                    anchor: [0,0],
                    textColor: '#000',
                    textSize: 12
                }, {
                    url: 'img/m3.png',
                    height: 66,
                    width: 65,
                    anchor: [0,0],
                    textColor: '#000',
                    textSize: 13
                }]
            }; //especific options for the cluster

            return clusterCreator (objMap.mapInstance,arrayOfMarkers,myOptions); //create a cluster with all the markeres returned and stored
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

    console.log (myOptions);
    var markObject = new markerObject (myOptions);  //markerObject is an interface for google map API

    //TODO: this will be in the controller NOT in the SERVICE
    markObject.registerMapEvent ('click',function(){

        var codEle = dato.codEle;
        var tipo = dato.tipo;
        var uri= 'dataModels/dgtProxy.php?codEle='+codEle+'&tipo='+tipo;

        if(tipo!='Gasolinera'){
            getMeTheDetailsDGT (uri,tipo);
        }else{
            alert(dato.alias);
        }

    });

    //TODO: Why .markerInstance?
    return markObject.markerInstance;
};

getMeTheDetailsDGT = function (param,type){
 var jqxhr = $.getJSON(param, type, function(data) {

     var img,tmpstp,lstParams;

     switch (type) {
         case 'Camara':
                img = 'http://www.dgt.es/camaras/'+data.imagen;
                tmpstp= data.fecha.split(' ');
                lstParams = {
                    imagen: img,
                    fecha: tmpstp[1],
                    tipo: data.tipo
                };
                infoWindowForAllPurpose (lstParams);
                $('#response').html(JSON.stringify( data) );
             break;
         case 'Panel_CMS':
                lstParams = {
                    mensaje1 : data.mensaje1 ,
                    mensaje2 : data.mensaje2,
                    tipo: data.tipo
                };
                infoWindowForAllPurpose (lstParams);
             $('#response').html(JSON.stringify( data) );
             break;
         case ('Panel_PSG'):
                lstParams = {
                    mensaje1 : data.mensaje1,
                    mensaje2 : data.mensaje2,
                    tipo: data.tipo
                };
                infoWindowForAllPurpose (lstParams);
             $('#response').html(JSON.stringify( data) );
             break;
         case ('SensorMeteorologico'):
             tmpstp= data.fecha.split(' ');
             lstParams = {
                    temp_rocio: data.temp_rocio,
                    fecha: tmpstp[1],
                    radiacion_global: data.radiacion_global,
                    vel_viento: data.vel_viento,
                    tipo_viento: data.tipo_viento,
                    alt_agua: data.alt_agua,
                    temperatura: data.temperatura,
                    visibilidad: data.visibilidad,
                    indiceMapa: data.indiceMapa,
                    humedad:  data.humedad,
                    i_Precipitaciones: data.i_Precipitaciones,
                    n_Precipitacion: data.n_Precipitacion,
                    salinidad: data.salinidad,
                    t_congel: data.t_congel,
                    tip_viento: data.tip_viento,
                    tipo: data.tipo,
                    tiempo_Presente: data.tiempo_Presente,
                    c_Precipitaciones: data.c_Precipitaciones,
                    dir_viento: data.dir_viento,
                    t_subsuelo: data.t_subsuelo,
                    presion_A: data.presion_A
                };
                infoWindowForAllPurpose (lstParams);
             $('#response').html(JSON.stringify( data) );
             break;
         case ('SensorTrafico'):
             tmpstp= data.fecha.split(' ');
             lstParams = {
                    ocupacion: data.ocupacion,
                    fecha: tmpstp[1],
                    composicion: data.composicion,
                    tipo: data.tipo,
                    intensidad: data.intensidad,
                    velocidad: data.velocidad
                };
                infoWindowForAllPurpose (lstParams);
             $('#response').html(JSON.stringify( data) );
             break
         default:
             //$('#response').html(JSON.stringify( data) );
     }
    })
    .error(function() {})
    .complete(function() {});
    console.log('response ',jqxhr);
};

infoWindowForAllPurpose = function (params){
    var param,bodyContent='';

    $('#myModal').modal('toggle');

    $('#modal-head-title').html('');
    $('#modal-body-img').attr('src','');
    $('#modal-body-content').html(bodyContent);

    $('#modal-head-title').html(params.tipo);
    if (params.imagen){$('#modal-body-img').attr('src',params.imagen);};
    for (param in params){
        console.log(param);
        bodyContent += param+' : '+params[param]+'<br>';
    }
    $('#modal-body-content').html(bodyContent);
};

//TODO: this will we abstracted to scriptAux, who really implement the google API.
//Cluster creator
clusterCreator = function (objMap,markers,myOptions){
    return new MarkerClusterer(objMap, markers, myOptions);
};