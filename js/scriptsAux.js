geolocation = function (){
    return !!navigator.geolocation;
}

handleNoGeolocation = function(errorFlag){
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }
}