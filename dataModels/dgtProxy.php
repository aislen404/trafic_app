<?php
	$url='http://infocar.dgt.es/etraffic/BuscarElementosServlet?';
	$result = file_get_contents($url.'latNS=43.89789239125797&longNS=10.5029296875&latSW=35.53222622770337&longSW=-17.20458984375&zoom=6&accion=getElementos&Camaras=true&SensoresTrafico=true&SensoresMeteorologico=true&Paneles=true&IncidenciasRETENCION=true&IncidenciasOBRAS=false&IncidenciasMETEOROLOGICA=true&IncidenciasPUERTOS=true&IncidenciasOTROS=true&IncidenciasEVENTOS=true&niveles=false');
	print $result;
?>
