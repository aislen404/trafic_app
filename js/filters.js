/* Filters */
(function () {

    'use strict';

    var module;

    module = angular.module('trafic_app.filters',[]);

    module.filter('itemTraficFilter', function (input, yepNope , cadena){
        var out = '';
        var aux = '';
        // conditional based on optional argument
        if (input.tipo == 'Incidencia'){
            aux = input.tipoInci;
        }else{
            aux = input.tipo;
        }
        if (aux==cadena){
            if (yepNope) {
                out = "-"+input.alias;
            }
        }
        return out;
    });


}).call(this);


