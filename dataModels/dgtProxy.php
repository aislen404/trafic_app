<?php
	$codEle = $_GET['codEle'];
	$tipo = $_GET['tipo'];
	$url = 'http://infocar.dgt.es/etraffic/BuscarElementosServlet?accion=getDetalles&codEle='.$codEle.'&tipo='.$tipo.'&indiceMapa=0';
	$c = curl_init($url);
	curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
	$page = curl_exec($c);
	curl_close($c);
	echo $page;
?>

http://geoportal.mityc.es/hidrocarburos/eess/queryPopUp.do?urlValor=http://geoportal.mityc.es/cgi-bin/mapserv?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=estaciones_servicio_brief&BBOX=-4.10784912109375,40.148590087890625,-3.341552734375,40.555084228515625&tipoCarburante=1&tipoBusqueda=0




