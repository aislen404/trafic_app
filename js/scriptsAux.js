function mapServiceProvider(lat,lng,id,z) {
    var myOptions = {
        zoom: z,
        center: new google.maps.LatLng(lat,lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    return new google.maps.Map(document.getElementById(id),myOptions);
}


function markServiceCreator(lat,lng,ico,title,objMap){

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat,lng),
        animation: google.maps.Animation.DROP,
        map: objMap,
        icon: ico,
        title: title
    });
}


function incidentIcoResolutor (typeInc) {
    var ico;

    switch (typeInc){
        case ('Me'):
            ico = 'img/me.png';
            break;
        case ('Camara'):
            ico = 'img/Camara.png';
            break;
        case ('SensorMeteorologico'):
            ico ='img/sensorMetorologico.png';
            break;
        case ('SensorTrafico'):
            ico='img/sensorTrafico.png';
            break;
        case('OBRAS'):
            ico = 'img/Obras.png';
            break;
        case ('OTROS'):
            ico = 'img/Otros.png';
            break;
        case ('METEOROL�GICO'):
            ico = 'img/Meteorologico.png';
            break;
        case ('RETENCI�N / CONGESTI�N'):
            ico = 'img/Retencion.png';
            break
    }
    return ico;

}