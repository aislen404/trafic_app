<?php

	
	$fltr_camaras = $_GET['Camaras'];
	$fltr_eventos = $_GET['IncidenciasEVENTOS'];
	$fltr_meteorologia = $_GET['IncidenciasMETEOROLOGICA'];
	$fltr_obras = $_GET['IncidenciasOBRAS'];
	$fltr_otros = $_GET['IncidenciasOTROS'];
	$fltr_puertos = $_GET['IncidenciasPUERTOS'];
	$fltr_retencion = $_GET['IncidenciasRETENCION'];
	$fltr_paneles = $_GET['Paneles'];
	$fltr_est_meteorologica = $_GET['SensoresMeteorologico'];
	$fltr_trafico = $_GET['SensoresTrafico'];
	$fltr_latNS = $_GET['latNS'];
	$fltr_latSW = $_GET['latSW'];
	$fltr_longNS = $_GET['longNS'];
	$fltr_longSW = $_GET['longSW'];
	$fltr_niveles = $_GET['niveles'];
	$fltr_zoom = $_GET['zoom'];

	$url='http://infocar.dgt.es/etraffic/BuscarElementosServlet?latNS='.$fltr_latNS.'&longNS='.$fltr_longNS.'&latSW='.$fltr_latSW.'&longSW='.$fltr_longSW.'&zoom='.$fltr_zoom.'&accion=getElementos&Camaras='.$fltr_camaras.'&SensoresTrafico='.$fltr_trafico.'&SensoresMeteorologico='.$fltr_est_meteorologica.'&Paneles='.$fltr_paneles.'&IncidenciasRETENCION='.$fltr_retencion.'&IncidenciasOBRAS='.$fltr_obras.'&IncidenciasMETEOROLOGICA='.$fltr_meteorologia.'&IncidenciasPUERTOS='.$fltr_puertos.'&IncidenciasOTROS='.$fltr_otros.'&IncidenciasEVENTOS='.$fltr_eventos.'&niveles='.$fltr_niveles;

	
	$result = file_get_contents($url);
	print $result;
?>
