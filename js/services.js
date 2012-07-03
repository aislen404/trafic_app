'use strict';

/* Services */

angular.module('trafficServices', ['ngResource']).
    factory('Traffic', function($resource){
  return $resource('phones/:phoneId.json', {}, {
    query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
  });
});
