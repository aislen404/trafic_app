/* Controllers */
(function () {

    'use strict';

    var module;

    module = angular.module ('trafic_app.controllers',[]);


    module.controller('traficCtrl', function ($scope, mapServiceProvider,queryDgt,addPoisDGT) {


        $scope.mapObj;

        /* contexto general de los datos de las peticiones de los servicios de la DGT */
        $scope.datos;


        $scope.BeganToBegin = function (){
            $scope.createMap();

            //TODO: estas sentencias de JQuery FUERA DE AQUI
            //$('.accordion').collapse();
            $('.dropdown-toggle').dropdown();
        }

        $scope.getDatos = function(){
            $scope.datos = queryDgt.get();
        }

        $scope.updateJson = function (){

        }

        $scope.createMap = function() {
            $scope.mapObj = mapServiceProvider;
            $scope.getDatos();
        }

        $scope.generateMarks = function() {

                //addPoisDGT;

        }
    });

}).call(this);
