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




