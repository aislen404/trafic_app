/* Controllers */
(function () {
    'use strict';

    var module;

    module = angular.module ('trafic_app.controllers',[]);

    module.controller('traficCtrl', function ($scope, mapServiceProvider,dgtServiceProvider) {

        // initialization of model bindings
        $scope.fltr_camaras = true;
        $scope.fltr_eventos = true;
        $scope.fltr_meteorologia = false;
        $scope.fltr_obras = false;
        $scope.fltr_otros = false;
        $scope.fltr_puertos = false;
        $scope.fltr_retencion = false;
        $scope.fltr_paneles = false;
        $scope.zoom = null;

        $scope.mapObj = null;

        // Main function in ng-init
        $scope.BeganToBegin = function (){
            $scope.createMap();
            $scope.getDatos();

            $('.dropdown-toggle').dropdown();
        }

        // Control the Creation of Map
        $scope.createMap = function() {
            $scope.mapObj = mapServiceProvider;

            // Setting map event control for zoom changes
            $scope.mapObj.registerMapEvent('zoom_changed',function(){
                $scope.refreshDatos();
                console.log ('[EVENT] ON ZOOM CHANGE --> ',$scope.mapObj.getZoom());
            });

            //Setting map event control for bounds changes
            $scope.mapObj.registerMapEvent('bounds_changed',function(){
                $scope.refreshDatos();
                console.log ('[EVENT] ON BOUNDS CHANGE --> ',$scope.mapObj.getLatNS(),$scope.mapObj.getLongNS(),$scope.mapObj.getLatSW(),$scope.mapObj.getLongSW());            });

        }

        // Load DGT service response to the trafic controller model
        $scope.getDatos = function(){
            dgtServiceProvider.firstCall($scope.mapObj,$scope.fltr_camaras,$scope.fltr_eventos,$scope.fltr_meteorologia,$scope.fltr_obras,$scope.fltr_otros,$scope.fltr_puertos,$scope.fltr_retencion,$scope.fltr_paneles);
        }

        $scope.refreshDatos = function(){
            dgtServiceProvider.refreshCall($scope.mapObj,$scope.fltr_camaras,$scope.fltr_eventos,$scope.fltr_meteorologia,$scope.fltr_obras,$scope.fltr_otros,$scope.fltr_puertos,$scope.fltr_retencion,$scope.fltr_paneles);
        }
        // Control Checkbox for Weather Layer
        $scope.meteoToggle = function (){
            mapServiceProvider.weatherToogle();
        }

        // Control Checkbox for Traffic Density Layer
        $scope.trafficToogle = function (){
            mapServiceProvider.trafficToogle();
        }


    });

}).call(this);
