<?php
	$codEle = $_GET['codEle'];
	$tipo = $_GET['tipo'];

	$url='http://benalman.com/code/projects/php-simple-proxy/ba-simple-proxy.php?url=http%3A%2F%2Finfocar.dgt.es%2Fetraffic%2FBuscarElementosServlet%3Faccion%3DgetDetalles%26codEle%3D'.$codEle.'%26tipo%3D'.$tipo.'%26indiceMapa%3D0';

	$result = file_get_contents($url);
	print $result;
?>