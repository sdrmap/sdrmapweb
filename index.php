<!DOCTYPE html>
<html>
	<head>
		<title>sdrmap.org</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

		<!--adsb-->
		<link rel="stylesheet" href="css/mainstyle.css" />

		<!--leaflet-->
		<link rel="stylesheet" href="css/leaflet.css" />
		<script src="js/leaflet.js"></script>

		<!--leafletPlugins-->
		<script src="js/leaflet-realtime.js"></script>
		<!--brauchen wir den forwarder überhaupt???-->
		<script src="js/leaflet-event-forwarder.js"></script>
		<script src="js/leaflet-heat.js"></script>
		<script src="js/leaflet-activearea.js"></script>
		<script src="js/2DPathMarker.js"></script>

		<!--tabulator-->
		<script src="js/tabulator.js"></script>
		<link rel="stylesheet" href="css/tabulator.css" />

		<!--FontAwesome-->
		<link href="css/all.css" rel="stylesheet">

		<!--moment.js-->
		<script src="js/moment.min.js"></script>

		<!--chartjs-->
		<script src="js/chart.umd.js"></script>
		<script src="js/chartjs-adapter-moment.js"></script>

		<!--Helpers-->
		<script src="js/helpers.js"></script>
		<script src="js/vehicleInfo.js"></script>
		<script src="js/vehicleSelect.js"></script>
		<script src="js/layers.js"></script>
		<script src="js/notify.js"></script>
		<script src="js/stats.js"></script>
		<script src="js/stations.js"></script>
		<script src="js/launchsites.js"></script>
		<script src="js/heatmap.js"></script>
		<script src="js/filter.js"></script>
		<script src="js/magic.js"></script>
		<script src="js/sidebar.js"></script>
		<script src="js/mlatmesh.js"></script>

		<!--Markers-->
		<script src="js/markers-path2d.js"></script>
	</head>
	<body>

		<!--map-->
		<div id="map"></div>
		
		<!-- rc3 banner -->
		<div id="rc3">
			<div id="rc3inner">
				Welcome
				<img id="rc3logo" src="rc3/02a_RC3_Logo_Export_Export.svg"/>
			</div>
		</div>

		<?php include('navbar.php'); ?>

		<div class="leftbar" id="leftbarDesktop">
			<div class="button" onclick="map.zoomIn()">
				<i class="fa-solid fa-magnifying-glass-plus"></i>
			</div>
			<div class="button" onclick="map.zoomOut()">
				<i class="fa-solid fa-magnifying-glass-minus"></i>
			</div>
		</div>

		<?php
			$b=array(
				"sidebarToggle" => array(
					"icon" => "fas fa-angle-double-right",
					"descShort" => "",
					"descLong" => "Show/hide Sidebar",
					"mode" => "desktop",
					"action" => "sidebarToggle()"
				),
				"planeListShow" => array(
					"icon" => "fas fa-plane",
					"descShort" => "Planes",
					"descLong" => "Show list of active planes",
					"mode" => "all",
					"action" => "sidebarPanelShow('planeList')"
				),
				"shipListShow" => array(
					"icon" => "fas fa-ship",
					"descShort" => "Ships",
					"descLong" => "Show list of active ships",
					"mode" => "all",
					"action" => "sidebarPanelShow('shipList')"
				),
				"radiosondeListShow" => array(
					"icon" => "fa-solid fa-parachute-box",
					"descShort" => "Radiosondes",
					"descLong" => "Show list of active radiosondes",
					"mode" => "all",
					"action" => "sidebarPanelShow('radiosondeList')"
				),
				"launchsiteListShow" => array(
					"icon" => "fa-solid fa-asterisk",
					"descShort" => "Launchsites",
					"descLong" => "Show list of radiosonde launchsites",
					"mode" => "all",
					"action" => "sidebarPanelShow('launchsiteList', 'launchsiteListRefresh')"
				),
				/*"searchShow" => array(
					"icon" => "fas fa-magnifying-glass",
					"descShort" => "Search",
					"descLong" => "Search for Vehicles",
					"mode" => "all",
					"action" => "centeroverlayShow('search')"
				),*/
				"stationListShow" => array(
					"icon" => "fas fa-broadcast-tower",
					"descShort" => "Stations",
					"descLong" => "Show list of receiver stations",
					"mode" => "all",
					"action" => "sidebarPanelShow('stationList')"
				),
				"statsShow" => array(
					"icon" => "fas fa-chart-column",
					"descShort" => "Statistics",
					"descLong" => "Show statistics",
					"mode" => "all",
					"action" => "centeroverlayShow('overallGraphs'); overallGraphsRefresh()"
				),
				"filterShow" => array(
					"icon" => "fas fa-filter",
					"descShort" => "Filter",
					"descLong" => "Filter Planes",
					"mode" => "all",
					"action" => "sidebarPanelShow('filter')"
				),
				"settingsShow" => array(
					"icon" => "fas fa-cogs",
					"descShort" => "Settings",
					"descLong" => "Configure various things",
					"mode" => "all",
					"action" => "sidebarPanelShow('settings')"
				),
				"geolocationToggle" => array(
					"icon" => "fas fa-location-crosshairs",
					"descShort" => "Locate me",
					"descLong" => "Track your own location",
					"mode" => "all",
					"action" => "geolocationToggle()"
				),
				"aboutShow" => array(
					"icon" => "fas fa-question",
					"descShort" => "About",
					"descLong" => "About",
					"mode" => "mobile",
					"action" => "centeroverlayShow('about')"
				)
			);
		?>

		<!--menue-->
		<div class="mobile menue" id="menue">
			<div class="menueButton mobile"><a href="https://github.com/sdrmap/sdrmapfeeder/wiki"><i class="fas fa-tools"></i><br>Build your own</a></div>
			<div class="menueButton mobile"><i class="fas fa-map" onclick="menueHide(); sidebarHide(); document.getElementById('mobileClose').style = 'display:none';"></i><br>Map</div>
			<?php
				foreach($b as $id => $a){
					if($a['mode']=='all' or $a['mode']=='mobile'){
						echo '<div class="menueButton mobile"><i class="'.$a['icon'].'" onclick="'.$a['action'].'"></i><br>'.$a['descShort'].'</div>';
					}
				}
			?>
		</div>

		<!--tabbar-->
		<div class="tabbar desktop" id="tabbar">
			<?php
				$extra=$_GET['extra'];
				foreach($b as $id => $a){
					if($a['mode']=='desktop' or $a['mode']=='all'){
						echo '<div class="button" id="'.$id.'" onclick="'.$a['action'].'" title="'.$a['descLong'].'"><i class="'.$a['icon'].'"></i></div>';
					}
					if($extra==true and $a['mode']=='extra'){
						echo '<div class="button" id="'.$id.'" onclick="'.$a['action'].'" title="'.$a['descLong'].'"><i class="'.$a['icon'].'"></i></div>';
					}
				}
			?>
		</div>

		<!--sidebar-->
		<div class="sidebar" id="sidebar">

			<!--content-->
			<!--planelist-->
			<div class="content" id="planeListContent">

				<!--tabulator-->
				<div id="planelist"></div>
			</div>

			<!--content-->
			<!--shiplist-->
			<div class="content" id="shipListContent">

				<!--tabulator-->
				<div id="shiplist"></div>
			</div>

			<!--content-->
			<!--radiosondelist-->
			<div class="content" id="radiosondeListContent">
				<table id="radiosondeListTable">
					<thead>
						<tr>
							<td><i class="fa-solid fa-barcode"></i></td>
							<td><i class="fa-solid fa-tag"></i></td>
							<td><i class="fa-solid fa-ruler"></i></td>
							<td><i class="fa-solid fa-temperature-half"></i></td>
							<td><i class="fa-solid fa-clock"></i></td>
						</tr>
					</thead>
					<tbody id="radiosondeListTableBody">
					</tbody>
				</table>
			</div>


			<!--planeHistoryList-->
			<div class="content" id="planeHistoryListContent">

				<!--planeHistoryListTabulator-->
				<div id="planeHistoryList"></div>
			</div>

			<!--plane-->
			<div class="content" id="planeContent">

				<!--info-->
				<table class="iconTable" id="planeInfoTable">
					<thead>
						<tr><td colspan="3"><i id="planeInfoTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('planeInfoTable')"></i> Info (<a id="planeSeen">n/a</a>)<div class="desktop" onclick="vehicleDeSelect('plane')"><i class="fas fa-window-close"></i></div></td></tr>
					</thead>
					<tbody id="planeInfoTableBody">
						<tr><td><i class="fa-solid fa-barcode"></i></td><td id="planeId">n/a</td><td id="planeRegistration">n/a</td></tr>
						<tr><td><i class="fa-solid fa-tag"></i></td><td colspan="1" id="planeFlight">n/a</td><td colspan="2" id="planeAirline">n/a</td></tr>
						<tr><td><i class="fa-solid fa-globe"></i></td><td colspan="2" id="planeCountry">n/a</td></tr>
						<tr><td><i class="fa-solid fa-plane"></i></td><td id="planeModel">n/a</td><td colspan="2" id="planeModelLong">n/a</td></tr>
						<tr><td><i class="fa-solid fa-volume-high"></i></td><td id="planeSquawk">n/a</td><td colspan="2" id="planeSquawkLong">n/a</td></tr>
						<tr><td><i class="fa-solid fa-link"></i></td><td colspan="3" id="planeLink"></td></tr>
					</tbody>
				</table>

				<!--position-->
				<table class="iconTable" id="planePositionTable">
					<thead>
						<tr><td colspan="5"><i id="planePositionTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('planePositionTable')"></i> Position (<a id="planeSeenPos">n/a</a>)<div id="vehicleFocus" onclick="vehicleFocusToggle()" title="toggle follow aircraft"><i class="fas fa-location-crosshairs"></i></div></td></tr>
					</thead>
					<tbody id="planePositionTableBody">
						<tr><td><i class="fa-solid fa-location-dot"></i></td><td colspan="2" id="planeLatLon">n/a</td><td id="planeTrack">n/a</td><td id="planeNavHeading">n/a</td></tr>
						<tr><td><i class="fa-solid fa-ruler"></i></td><td id="planeAltitudeNowMetric">n/a</td><td id="planeAltitudeNow">n/a</td><td title="altitude mcp" id="planeNavAltitudeMcp">n/a</td><td title="altitude fms" id="planeNavAltitudeFms">n/a</td></tr>
						<tr><td><i class="fa-solid fa-arrows-up-down"></i></td><td colspan="2" id="planeVertrateNowMetric">n/a</td><td colspan="2" id="planeVertrateNow">n/a</td></tr>
						<tr><td><i class="fa-solid fa-gauge"></i></td><td colspan="2" id="planeSpeedNowMetric">n/a</td><td colspan="2" id="planeSpeedNow">n/a</td></tr>
						<tr><td><i class="fa-solid fa-compass"></i></td><td colspan="4" id="planeNavModes">n/a</td></tr>
					</tbody>
				</table>

				<!--picture-->
				<table>
					<thead>
						<tr><td><i id="planePictureTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('planePictureTable')"></i> Picture</td></tr>
					</thead>
					<tbody id="planePictureTableBody">
						<tr><td id="planePicture"></td></tr>
					</tbody>
				</table>

				<!--History-->
				<table id="planeHistoryTable">
					<thead>
						<tr><td colspan="2" ><i id="planeHistoryTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('planeHistoryTable')"></i> History</td></tr>
					</thead>
					<tbody id="planeHistoryTableBody">
						<tr><td>Export Track as geojson</td><td><a id="exportTrackGeojson" href="" target="_blank" title="export track"><i class="fas fa-save"></i></a></td></tr>
					</tbody>
				</table>

				<!--stations-->
				<table id="planeStationsTable">
					<thead>
						<tr><td colspan="5" ><i id="planeStationsTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('planeStationsTable')"></i> Stations (<a id="planeStationsCount">0</a>)</td></tr>
					</thead>
					<tbody id="planeStationsTableBody">
					</tbody>
				</table>
			</div>

			<!--ship-->
			<div class="content" id="shipContent">

				<!--info-->
				<table class="iconTable" id="shipInfoTable">
					<thead>
						<tr><td colspan="4"><i id="shipInfoTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('shipInfoTable')"></i> Info (<a id="shipSeen">n/a</a>)<div class="desktop" onclick="vehicleDeSelect('ship')"><i class="fas fa-window-close"></i></div></td></tr>
					</thead>
					<tbody id="shipInfoTableBody">
						<tr><td><i class="fa-solid fa-barcode"></i></td><td colspan="3" id="shipId">n/a</td></tr>
						<tr><td><i class="fa-solid fa-tag"></i></td><td colspan="2" id="shipName">n/a</td><td id="shipCallsign">n/a</td></tr>
						<tr><td><i class="fa-solid fa-globe"></i></td><td colspan="3" id="shipCountry">n/a</td></tr>
						<tr><td><i class="fa-solid fa-ship"></i></td><td id="shipType">n/a</td><td colspan="2" id="shipTypeText">n/a</td></tr>
						<tr><td><i class="fa-solid fa-ruler-combined"></i></td><td id="shipLength">n/a</td><td id="shipWidth">n/a</td><td id="shipDraught">n/a</td></tr>
						<tr><td><i class="fa-solid fa-anchor"></i></td><td id="shipStatus">n/a</td><td colspan="2" id="shipStatusText">n/a</td></tr>
						<tr><td><i class="fa-solid fa-arrows-turn-to-dots"></i></td><td colspan="3" id="shipDestination">n/a</td></tr>
						<tr><td><i class="fa-solid fa-clock"></i></td><td colspan="3" id="shipEta">n/a</td></tr>
						<tr><td><i class="fa-solid fa-link"></i></td><td colspan="3" id="shipLink"></td></tr>
					</tbody>
				</table>

				<!--position-->
				<table class="iconTable" id="shipPositionTable">
					<thead>
						<tr><td colspan="4"><i id="shipPositionTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('shipPositionTable')"></i> Position<div id="vehicleFocus2" onclick="vehicleFocusToggle()" title="toggle follow aircraft"><i class="fas fa-location-crosshairs"></i></div></td></tr>
					</thead>
					<tbody id="shipPositionTableBody">
						<tr><td><i class="fa-solid fa-location-dot"></i></td><td id="shipLatLon">n/a</td><td id="shipCourse">n/a</td><td id="shipHeading">n/a</td></tr>
						<tr><td><i class="fa-solid fa-gauge"></i></td><td id="shipSpeedNowMetric">n/a</td><td colspan="2" id="shipSpeedNow">n/a</td></tr>
					</tbody>
				</table>

				<!--picture-->
				<table>
					<thead>
						<tr><td><i id="shipPictureTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('shipPictureTable')"></i> Picture</td></tr>
					</thead>
					<tbody id="shipPictureTableBody">
						<tr><td id="shipPicture"></td></tr>
					</tbody>
				</table>

				<!--History-->
				<table id="shipHistoryTable">
					<thead>
						<tr><td colspan="2" ><i id="shipHistoryTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('shipHistoryTable')"></i> History</td></tr>
					</thead>
					<tbody id="shipHistoryTableBody">
						<tr><td>Export Track as geojson</td><td><a id="exportShipTrackGeojson" href="" target="_blank" title="export track"><i class="fas fa-save"></i></a></td></tr>
					</tbody>
				</table>

				<!--stations-->
				<table class="vehicleStationsTable" id="shipStationsTable">
					<thead>
						<tr><td colspan="5" ><i id="shipStationsTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('shipStationsTable')"></i> Stations (<a id="shipStationsCount">0</a>)</td></tr>
					</thead>
					<tbody id="shipStationsTableBody">
					</tbody>
				</table>
			</div>

			<!--radiosonde-->
			<div class="content" id="radiosondeContent">

				<!--info-->
				<table class="iconTable" id="radiosondeInfoTable">
					<thead>
						<tr><td colspan="3"><i id="radiosondeInfoTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('radiosondeInfoTable')"></i> Info (#<a id="radiosondeFrame">n/a</a> <a id="radiosondeSeen">n/a</a>)<div class="desktop" onclick="vehicleDeSelect('radiosonde')"><i class="fas fa-window-close"></i></div></td></tr>
					</thead>
					<tbody id="radiosondeInfoTableBody">
						<tr><td><i class="fa-solid fa-barcode"></i></td><td id="radiosondeId">n/a</td><td id="radiosondeFrequency">n/a</td></tr>
						<tr><td><i class="fa-solid fa-clock"></i></td><td id="radiosondeUptime">n/a</td><td id="radiosondeKilltimer">n/a</td></tr>
						<tr><td><i class="fa-solid fa-tag"></i></td><td id="radiosondeVendor">n/a</td><td id="radiosondeModel">n/a</td></tr>
						<tr><td><i class="fa-solid fa-user-tie"></i></td><td colspan="2" id="radiosondeLaunchsiteOperator">n/a</td></tr>
						<tr>
							<td>
								<i class="fa-solid fa-temperature-half"></i>
							</td>
							<td colspan="2" id="radiosondeTemperature">n/a</td>
						</tr>
						<tr>
							<td>
								<i class="fa-solid fa-droplet"></i>
							</td>
							<td colspan="2" id="radiosondeHumidity">n/a</td>
						</tr>
						<tr>
							<td>
								<i class="fa-solid fa-wind"></i>
							</td>
							<td colspan="2" id="radiosondePressure">n/a</td>
						</tr>
						<tr>
							<td>
								<i class="fa-solid fa-battery-three-quarters"></i>
							</td>
							<td colspan="2" id="radiosondeVoltage">n/a</td>
						</tr>
						<tr><td><i class="fa-solid fa-link"></i></td><td colspan="2" id="radiosondeLink"></td></tr>
					</tbody>
				</table>

				<!--position-->
				<table class="iconTable" id="radiosondePositionTable">
					<thead>
						<tr><td colspan="5"><i id="radiosondePositionTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('radiosondePositionTable')"></i> Position<div id="vehicleFocusRadiosonde" onclick="vehicleFocusToggle()" title="toggle follow aircraft"><i class="fas fa-location-crosshairs"></i></div></td></tr>
					</thead>
					<tbody id="radiosondePositionTableBody">
						<tr>
							<td>
								<i class="fa-solid fa-location-dot"></i>
							</td>
							<td colspan="2" id="radiosondeLatLon">n/a</td>
							<td colspan="2" id="radiosondeHeading">n/a</td>
						</tr>
						<tr>
							<td><i class="fa-solid fa-ruler"></i></td>
							<td colspan="4" id="radiosondeAltitudeNowMetric">n/a</td>
						</tr>
						<tr>
							<td><i class="fa-solid fa-arrows-up-down"></i></td>
							<td colspan="1" id="radiosondeVertrateNowMetric">n/a</td>
							<td colspan="1" id="radiosondeVertrateMinMetric">n/a</td>
							<td colspan="1" id="radiosondeVertrateAvgMetric">n/a</td>
							<td colspan="1" id="radiosondeVertrateMaxMetric">n/a</td>
						</tr>
						<tr>
							<td><i class="fa-solid fa-gauge"></i></td>
							<td colspan="1" id="radiosondeSpeedNowMetric">n/a</td>
							<td colspan="1" id="radiosondeSpeedMinMetric">n/a</td>
							<td colspan="1" id="radiosondeSpeedAvgMetric">n/a</td>
							<td colspan="1" id="radiosondeSpeedMaxMetric">n/a</td>
							
						</tr>
						<tr>
							<td><i class="fa-solid fa-satellite"></i></td>
							<td colspan="4" id="radiosondeSats">n/a</td>
						</tr>
					</tbody>
				</table>

				<!--History-->
				<table id="radiosondeHistoryTable">
					<thead>
						<tr><td colspan="5" ><i id="radiosondeHistoryTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('radiosondeHistoryTable')"></i> History <i class="fa-solid fa-chart-column" onclick="centeroverlayShow('radiosondeGraphs'); radiosondeGraphsRefresh()"></i></td></tr>
					</thead>
					<tbody id="radiosondeHistoryTableBody">
						<tr>
							<td><i class="fa-solid fa-star-of-life"></i></td>
							<td colspan="3" id="radiosondeLaunchsiteName">n/a</td>
							<td colspan="1" id="radiosondeLaunchsiteDistance">n/a</td>
						</tr>
						<tr>
							<td><i class="fa-solid fa-1"></i></td>
							<td id="radiosondeFirstcontactFrame">n/a</td>
							<td id="radiosondeFirstcontactTimestamp">n/a</td>
							<td id="radiosondeFirstcontactStation">n/a</td>
							<td id="radiosondeFirstcontactAltitude">n/a</td>
						</tr>
						<tr>
							<td><i class="fa-solid fa-burst"></i></td>
							<td id="radiosondeBurstFrame">n/a</td>
							<td id="radiosondeBurstTimestamp">n/a</td>
							<td colspan="2" id="radiosondeBurstAltitude">n/a</td>
							
						</tr>
						<tr>
							<td><i class="fas fa-save"></i></td>
							<td colspan="4"><a id="exportRadiosondeTrackGeojson" href="" target="_blank" title="export track">Export Track as geojson</a></td>
						</tr>
					</tbody>
				</table>
				
				<!--Prediction-->
				<table id="radiosondePredictionTable">
					<thead>
						<tr><td colspan="5" ><i id="radiosondePredictionTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('radiosondePredictionTable')"></i> Prediction (<a id="radiosondePredictionSeen">n/a</a>)</td></tr>
					</thead>
					<tbody id="radiosondePredictionTableBody">
						<tr>
							<td><i class="fa-solid fa-arrows-to-circle"></i></td>
							<td colspan="2" id="radiosondePredictionLatLon">n/a</td>
							<td colspan="1" id="radiosondePredictionAltitude">n/a</td>
						</tr>
						<tr>
							<td><i class="fa-solid fa-hourglass-half"></i></td>
							<td colspan="1" id="radiosondePredictionTimestamp">n/a</td>
							<td colspan="1" id="radiosondePredictionTime">n/a</td>
							<td colspan="1" id="radiosondePredictionDistance">n/a</td>
						</tr>
						<tr>
							<td><i class="fa-solid fa-burst"></i></td>
							<td colspan="1" id="radiosondeBurstPredictionTimestamp">n/a</td>
							<td colspan="1" id="radiosondeBurstPredictionTime">n/a</td>
							<td colspan="1" id="radiosondeBurstPredictionAltitude">n/a</td>
						</tr>
					</tbody>
				</table>

				<!--stations-->
				<table id="radiosondeStationsTable">
					<thead>
						<tr><td colspan="5" ><i id="radiosondeStationsTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('radiosondeStationsTable')"></i> Stations (<a id="radiosondeStationsCount">0</a>)</td></tr>
					</thead>
					<tbody id="radiosondeStationsTableBody">
					</tbody>
				</table>
			</div>


			<!--stationlist-->
			<div class="content" id="stationListContent">

				<!--tabulator-->
				<div id="stationlist"></div>
			</div>

			<!--station-->
			<div class="content" id="stationContent">

				<!--info-->
				<table>
					<thead>
						<tr>
							<td colspan="7">
								<i id="stationInfoTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('stationInfoTable')"></i> Info <i id="stationInfoRefreshIndicator" class="fa-solid fa-rotate fa-spin"></i>
								<div>
									<i id="stationInfoTableLocate" class="fa-solid fa-location-crosshairs" onclick=""></i>
									<i id="stationInfoTableFilter" class="fa-solid fa-filter" onclick="filterStationToggle()"></i>
									<i id="stationInfoTableHeatmap" class="fas fa-bullseye" onclick="heatmapStationToggle()"></i>
									<i class="fa-solid fa-chart-column" onclick="centeroverlayShow('stationGraphsBig'); stationGraphsBigRefresh()"></i>
									<i onclick="stationDeSelect()" class="fas fa-window-close"></i>
								</div>
							</td>
						</tr>
					</thead>
					<tbody id="stationInfoTableBody">
						<tr>
							<td class="stationInfoIconColumn"><i class="fa-solid fa-tower-broadcast"></i></td>
							<td colspan="6" id="stationName">n/a</td>
						</tr>
						<tr>
							<td rowspan="3" class="stationInfoIconColumn"><i class="fa-solid fa-clock"></i></td>
							<td colspan="3" id="stationTimestampFeeder">n/a</td>
							<td colspan="3" id="stationUptime">n/a</td>
						</tr>
						<tr>
							<td colspan="3" id="stationTimestampAdsb">n/a</td>
							<td colspan="3" id="stationTimestampMlat">n/a</td>
						</tr>
						<tr>
							<td colspan="3" id="stationTimestampAis">n/a</td>
							<td colspan="3" id="stationTimestampRadiosonde">n/a</td>
						</tr>
						<tr>
							<td rowspan="2" class="stationInfoIconColumn"><i class="fa-solid fa-plane"></i></td>
							<td colspan="2" id="stationPlanes">n/a</td>
							<td id="stationPositions">n/a</td>
							<td id="stationMlats">n/a</td>
							<td id="stationPositionsFalse">n/a</td>
							<td title="unique aircrafts not received by any other station" id="stationPlanesPositionsUnique">n/a</td>
						</tr>
						<tr>
							<td title="min/avg/max ADS-B range of station" colspan="3" id="stationRangePlane">n/a</td>
							<td colspan="3" title="min/avg/max ADS-B rssi of station" id="stationPlanesRssi">n/a</td>
						</tr>
						<tr>
							<td rowspan="2" class="stationInfoIconColumn"><i class="fa-solid fa-ship"></i></td>
							<td colspan="2" id="stationShips">n/a</td>
							<td colspan="2" id="stationShipsPositions">n/a</td>
							<td id="stationShipsPositionsFalse">n/a</td>
							<td title="unique ships not received by any other station" id="stationShipsPositionsUnique">n/a</td>
						</tr>
						<tr>
							<td title="min/avg/max AIS range of station" colspan="3" id="stationRangeShip">n/a</td>
							<td colspan="3" title="min/avg/max AIS rssi of station" id="stationShipsRssi">n/a</td>
						</tr>
						<tr>
							<td rowspan="2" class="stationInfoIconColumn"><i class="fa-solid fa-parachute-box"></i></td>
							<td colspan="5" id="stationRadiosondes">n/a</td>
							<td title="unique Radiosondes not received by any other station" id="stationRadiosondesPositionsUnique">n/a</td>
						</tr>
						<tr>
							<td title="min/avg/max Radiosonde range of station" colspan="3" id="stationRangeRadiosonde">n/a</td>
							<td colspan="3" title="min/avg/max Radiosonde snr of station" id="stationRadiosondeSnr">n/a</td>
						</tr>
						<tr>
							<td class="stationInfoIconColumn"><i class="fa-solid fa-microchip"></i></td>
							<td colspan="6" id="stationCpuLoad">n/a</td>
						</tr>
						<tr>
							<td class="stationInfoIconColumn"><i class="fa-solid fa-memory"></i></td>
							<td colspan="6" id="stationMemoryLoad">n/a</td>
						</tr>
						<tr>
							<td class="stationInfoIconColumn"><i class="fa-solid fa-temperature-half"></i></td>
							<td colspan="6" id="stationCpuTemperature">n/a</td>
						</tr>
						<tr>
							<td class="stationInfoIconColumn"><i class="fa-solid fa-link"></i></td>
							<td colspan="6" id="stationLink">n/a</td>
						</tr>
					</tbody>
				</table>

				<!--please notice-->
				<table>
					<thead>
						<tr><td colspan="1" ><i id="stationNoticeTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('stationNoticeTable')"></i> Please note</td></tr>
					</thead>
					<tbody id="stationNoticeTableBody">
					</tbody>
				</table>

				<!--top10-->
				<table id="stationPlanesTable">
					<thead>
						<tr><td colspan="6" ><i id="stationPlanesTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('stationPlanesTable')"></i> Planes (10 strongest signals)</td></tr>
					</thead>
					<tbody id="stationPlanesTableBody">
					</tbody>
				</table>
				<table id="stationShipsTable">
					<thead>
						<tr><td colspan="6" ><i id="stationShipsTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('stationShipsTable')"></i> Ships (10 strongest signals)</td></tr>
					</thead>
					<tbody id="stationShipsTableBody">
					</tbody>
				</table>
				<table id="stationRadiosondesTable">
					<thead>
						<tr><td colspan="6" ><i id="stationRadiosondesTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('stationRadiosondesTable')"></i> Radiosondes (10 strongest signals)</td></tr>
					</thead>
					<tbody id="stationRadiosondesTableBody">
					</tbody>
				</table>
				<table>
					<thead>
						<tr><td colspan="3" ><i id="stationSystemTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('stationSystemTable')"></i> System</td></tr>
					</thead>
					<tbody id="stationSystemTableBody">
						<tr>
							<td class="stationInfoIconColumn"><i class="fa-solid fa-microchip"></i></td>
							<td colspan="2" id="stationCpu">n/a</td>
						</tr>
						<tr>
							<td class="stationInfoIconColumn"><i class="fa-solid fa-memory"></i></td>
							<td colspan="2" id="stationMemory">n/a</td>
						</tr>
						<tr>
							<td class="stationInfoIconColumn"><i class="fa-solid fa-laptop-code"></i></td>
							<td>Kernel</td>
							<td id="kernel">n/a</td>
						</tr>
						<tr>
							<td class="stationInfoIconColumn"><i class="fa-solid fa-download"></i></td>
							<td>repo.chaos-consulting.de</td>
							<td id="c2isrepo">n/a</td>
						</tr>
						<tr>
							<td class="stationInfoIconColumn"><i class="fa-solid fa-plane"></i></td>
							<td id="dump1090Fork">n/a</td>
							<td id="dump1090Version">n/a</td>
						</tr>
						<tr>
							<td class="stationInfoIconColumn"><i class="fa-solid fa-ship"></i></td>
							<td>ais-catcher</td>
							<td id="ais-catcher">n/a</td>
						</tr>
						<tr>
							<td class="stationInfoIconColumn"><i class="fa-solid fa-compass"></i></td>
							<td>mlat-client-c2is</td>
							<td id="mlat-client-c2is">n/a</td>
						</tr>
						<tr>
							<td class="stationInfoIconColumn"><i class="fa-solid fa-shield"></i></td>
							<td>stunnel4</td>
							<td id="stunnel4">n/a</td>
						</tr>
					</tbody>
				</table>
				<table id="stationMlatPeersTable">
					<thead>
						<tr><td colspan="5" ><i id="stationMlatPeersTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('stationMlatPeersTable')"></i> MLAT sync peers (<a id="stationMlatPeersCount" title="total/good/usable/bad/unusable mlat sync peers">0</a>)</td></tr>
					</thead>
					<tbody id="stationMlatPeersTableBody">
					</tbody>
				</table>
			</div>

			<!--launchsiteList-->
			<div class="content" id="launchsiteListContent">
				<table id="launchsiteListTable">
					<thead>
							<tr>
								<td>
									Launchsite <i id="launchsiteListRefreshIndicator" class="fa-solid fa-rotate fa-spin"></i>
								</td>
								<td>
									<i class="fa-solid fa-clock"></i>
								</td>
								<td>
									<i class="fas fa-parachute-box"></i>
								</td>
							</tr>
						</thead>
						<tbody id="launchsiteListTableBody">
						</tbody>
					</table>
			</div>
			<!--launchsite-->
			<div class="content" id="launchsiteContent">

				<!--info-->
				<table id="launchsiteInfoTable">
					<thead>
						<tr>
							<td colspan="7">
								<i id="launchsiteInfoTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('launchsiteInfoTable')"></i> Info <i id="launchsiteInfoRefreshIndicator" class="fa-solid fa-rotate fa-spin"></i>
								<div>
									<i onclick="launchsiteDeSelect()" class="fas fa-window-close"></i>
								</div>
							</td>
						</tr>
					</thead>
					<tbody id="launchsiteInfoTableBody">
						<tr>
							<td class="launchsiteInfoIconColumn"><i class="fa-solid fa-location-dot"></i></td>
							<td colspan="6" id="launchsiteName">n/a</td>
						</tr>
						<tr>
							<td class="launchsiteInfoIconColumn"><i class="fa-solid fa-user-tie"></i></td>
							<td colspan="6" id="launchsiteOperator">n/a</td>
						</tr>
						<tr>
							<td class="launchsiteInfoIconColumn"><i class="fa-solid fa-tower-broadcast"></i></td>
							<td colspan="6" id="launchsiteFrequencies">n/a</td>
						</tr>
						<tr>
							<td class="launchsiteInfoIconColumn"><i class="fa-solid fa-link"></i></td>
							<td colspan="6" id="launchsiteLink">n/a</td>
						</tr>
					</tbody>
				</table>
			
				<!--active sondes-->
				<table id="launchsiteActiveSondesTable">
					<thead>
						<tr>
							<td colspan="7">
								<i id="launchsiteActiveSondesTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('launchsiteActiveSondesTable')"></i> Active Sondes (<a id="launchsiteActiveSondesCount">n/a</a>)
							</td>
						</tr>
					</thead>
					<tbody id="launchsiteActiveSondesTableBody">
					</tbody>
				</table>
				
				<!--recent Sondes-->
				<table id="launchsiteRecentSondesTable">
					<thead>
						<tr>
							<td colspan="7">
								<i id="launchsiteRecentSondesTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('launchsiteRecentSondesTable')"></i> Recent Sondes (<a id="launchsiteRecentSondesCount">n/a</a>) <i class="fa-solid fa-route" onclick="recent()"></i>
							</td>
						</tr>
					</thead>
					<tbody id="launchsiteRecentSondesTableBody">
					</tbody>
				</table>

				<!--upcoming Sondes-->
				<table id="launchsiteUpcomingSondesTable">
					<thead>
						<tr>
							<td colspan="7">
								<i id="launchsiteUpcomingSondesTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('launchsiteUpcomingSondesTable')"></i> Upcoming Sondes (<a id="launchsiteUpcomingSondesCount">n/a</a>) (<a id="launchsiteUpcomingSondesDatasetTimestamp">n/a</a>) <i class="fa-solid fa-route" onclick="prediction()"></i>
							</td>
						</tr>
					</thead>
					<tbody id="launchsiteUpcomingSondesTableBody">
					</tbody>
				</table>

				<!--schedule-->
				<table id="launchsiteScheduleTable">
					<thead>
						<tr>
							<td colspan="7">
								<i id="launchsiteScheduleTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('launchsiteScheduleTable')"></i> Schedule
							</td>
						</tr>
					</thead>
					<tbody id="launchsiteScheduleTableBody">
					</tbody>
				</table>
			</div>
				
			<!--stats-->
			<div class="content" id="statsContent">
				<h1>Statistics <i class='fas fa-sync-alt' title='Refresh' onclick='statsCalc()'></i></h1>
				<i class="fa-solid fa-chart-column" onclick="centeroverlayShow('overallGraphs'); overallGraphsRefresh()"></i>
				<!--tabulator-->
				<div id="statsPositionsTable"></div>
				</br>

				<!--tabulator-->
				<div id="statsTypesTable"></div>
				</br>

				<!--tabulator-->
				<div id="statsStationsTable"></div>
				</br>

				<!--tabulator-->
				<div id="statsModelsTable"></div>
				</br>

				<!--tabulator-->
				<div id="statsAirlinesTable"></div>
				</br>
				<div class="infobox">
					<h1>Please note</h1>
					These statistics are not influenced by any filters you may have set.</br>
					We are using every aircraft from every station at every given point of time to calculate these stats.
				</div>
			</div>

			<!--filter-->
			<div class="content" id="filterContent">
				<table>
					<thead>
						<tr><td colspan="5"><i id="filterTypeTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('filterTypeTable')"></i> Filter by type<div class="desktop" onclick="filterTypeSet('all')"><i class="fas fa-window-close"></i></div></td></tr>
					</thead>
					<tbody id="filterTypeTableBody">
						<tr>
							<td id="filterTypeAll" class="filterActive" onclick="filterTypeSet('all')">All</td>
							<td id="filterTypeBim" class="filter" onclick="filterTypeSet('bim')">BIM</td>
							<td id="filterTypeBos" class="filter" onclick="filterTypeSet('bos')">BOS</td>
							<td id="filterTypeInt" class="filter" onclick="filterTypeSet('int')">Interesting</td>
							<td id="filterTypeMil" class="filter" onclick="filterTypeSet('mil')">Military</td>
						</tr>
					</tbody>
				</table>

				<table>
					<thead>
						<tr><td colspan="5"><i id="filterFixTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('filterFixTable')"></i> Filter by fix<div class="desktop" onclick="filterFixSet('all')"><i class="fas fa-window-close"></i></div></td></tr>
					</thead>
					<tbody id="filterFixTableBody">
						<tr>
							<td id="filterFixAll" class="filterActive" onclick="filterFixSet('all')">All</td>
							<td id="filterFixTrue" class="filter" onclick="filterFixSet('true')"><script>document.write(fixToIcon('true'))</script></td>
							<td id="filterFixMlat" class="filter" onclick="filterFixSet('mlat')"><script>document.write(fixToIcon('mlat'))</script></td>
							<td id="filterFixFalse" class="filter" onclick="filterFixSet('false')"><script>document.write(fixToIcon('false'))</script></td>
						</tr>
					</tbody>
				</table>

				<table>
					<thead>
						<tr><td colspan="12"><i id="filterAltitudeTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('filterAltitudeTable')"></i> Filter by altitude<div class="desktop" onclick="filterAltitudeApply(0, 120000)"><i class="fas fa-window-close"></i></div></td></tr>
						<!--<tr id="filterAltitudeList"></tr>-->
					</thead>
					<tbody id="filterAltitudeTableBody">
						<!--<tr id="filterAltitudeList"></tr>-->
						<tr>
							<td onclick="filterAltitudeApply(0, 1000)"><300m</td>
							<td onclick="filterAltitudeApply(0, 3283)"><1.000m</td>
							<td onclick="filterAltitudeApply(0, 16413)"><5.000m</td>
							<td onclick="filterAltitudeApply(16413, 120000)">>5.000m</td>
						</tr>
						<tr>
							<td colspan="4">
									<div class="container">
										<div id="filterAltitudeTrack" class="filterSliderDualTrack" style="background:linear-gradient(to right, #a52a2a 0%, #a52a2a 0.87%, #d97012 0.87%, #d97012 1.74%, #ffa500 1.74%, #ffa500 2.61%, #ffcc00 2.61%, #ffcc00 3.92%, #ff0 3.92%, #ff0 5.22%, #afda21 5.22%, #afda21 6.53%, #45a94d 6.53%, #45a94d 7.83%, #51b67b 7.83%, #51b67b 9.14%, #61c7b8 9.14%, #61c7b8 10.44%, #4dacd6 10.44%, #4dacd6 11.75%, #3388ff 11.75%, #3388ff 42.86%, #5364ff 42.86%, #5364ff 57.14%, #6a48ff 57.14%, #6a48ff 71.43%, #8b24ff 71.43%, #8b24ff 85.71%, #aa00ff 85.71%, #aa00ff 100%)"></div>
										<input type="range" min="0" max="120000" value="0" id="filterAltitudeSliderMin" oninput="filterAltitudeSliderMinInput()">
										<input type="range" min="0" max="120000" value="120000" id="filterAltitudeSliderMax" oninput="filterAltitudeSliderMaxInput()">
									</div>
							</td>
						</tr>
						<tr>
							<td id="filterAltitudeGauge" colspan="4">0 - 36555m / 0 - 120000ft</td>
						</tr>
					</tbody>
				</table>

				<table>
					<thead>
						<tr><td colspan="4"><i id="filterSpeedTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('filterSpeedTable')"></i> Filter by speed (Km/h)<div class="desktop" onclick="filterSpeedSet('all')"><i class="fas fa-window-close"></i></div></td></tr>
					</thead>
					<tbody id="filterSpeedTableBody">
						<tr>
							<td onclick="filterSpeedApply(0, 0)">only static</td>
							<td onclick="filterSpeedApply(1, 2000)">only moving</td>
							<td onclick="filterSpeedApply(1, 25)">taxi (<25km/h)</td>
							<td onclick="filterSpeedApply(1080, 2000)">Mach 1+ (>1080km/h)</td>
						</tr>
						<tr>
							<td colspan="4">
									<div class="container">
										<div id="filterSpeedTrack" class="filterSliderDualTrack"></div>
										<input type="range" min="0" max="2000" value="0" id="filterSpeedSliderMin" oninput="filterSpeedSliderMinInput()">
										<input type="range" min="0" max="2000" value="2000" id="filterSpeedSliderMax" oninput="filterSpeedSliderMaxInput()">
									</div>
							</td>
						</tr>
						<tr>
							<td id="filterSpeedGauge" colspan="4">0km/h</td>
						</tr>
					</tbody>
				</table>

				<table>
					<thead>
						<tr><td colspan="7"><i id="filterNavTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('filterNavTable')"></i> Filter by nav mode<div class="desktop" onclick="filterNavSet('all')"><i class="fas fa-window-close"></i></div></td></tr>
					</thead>
					<tbody id="filterNavTableBody">
						<tr>
							<td id="filterNavAll" class="filterActive" onclick="filterNavSet('all')">All</td>
							<td id="filterNavAlthold" class="filter" onclick="filterNavSet('althold')">althold</td>
							<td id="filterNavApproach" class="filter" onclick="filterNavSet('approach')">approach</td>
							<td id="filterNavAutopilot" class="filter" onclick="filterNavSet('autopilot')">autopilot</td>
							<td id="filterNavLnav" class="filter" onclick="filterNavSet('lnav')">lnav</td>
							<td id="filterNavTcas" class="filter" onclick="filterNavSet('tcas')">tcas</td>
							<td id="filterNavVnav" class="filter" onclick="filterNavSet('vnav')">vnav</td>
						</tr>
					</tbody>
				</table>

				<table>
					<thead>
						<tr><td colspan="5"><i id="filterSourceTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('filterSourceTable')"></i> Filter by source<div class="desktop" onclick="filterSourceSet('all')"><i class="fas fa-window-close"></i></div></td></tr>
					</thead>
					<tbody id="filterSourceTableBody">
						<tr>
							<td id="filterSourceAll" class="filterActive" onclick="filterSourceSet('all')">All</td>
							<td id="filterSourceAdsb" class="filter" onclick="filterSourceSet('adsb')">ADS-B</td>
							<td id="filterSourceAis" class="filter" onclick="filterSourceSet('ais')">AIS</td>
							<td id="filterSourceRadiosonde" class="filter" onclick="filterSourceSet('radiosonde')">Radiosonde</td>
						</tr>
					</tbody>
				</table>

				<table>
					<thead>
						<tr><td colspan="5"><i id="filterSelectedTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('filterSelectedTable')"></i> Only show selected vehicle<div class="desktop" onclick="filterSelectedSet('all')"><i class="fas fa-window-close"></i></div></td></tr>
					</thead>
					<tbody id="filterSelectedTableBody">
						<tr>
							<td id="filterSelectedAll" class="filterActive" onclick="filterSelectedSet('all')">All</td>
							<td id="filterSelectedSingle" class="filter" onclick="filterSelectedSet('single')">Single</td>
						</tr>
					</tbody>
				</table>

				<table>
					<thead>
						<tr><td><i id="filterStationTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('filterStationTable')"></i> Filter by station<div class="desktop" onclick="filterStationSet('all')"><i class="fas fa-window-close"></i></div></td></tr>
					</thead>
					<tbody id="filterStationTableBody">
						<tr id="filterStationList" style="background:none !important"></tr>
					</tbody>
				</table>
			</div>

			<!--settings-->
			<div class="content" id="settingsContent">

				<!--Map options-->
				<table>
					<thead>
						<tr><td colspan="3"><i class="fas fa-globe-europe"></i> Map options</td></tr>
					</thead>
					<tbody>
						<tr><td>Receiver Stations</td><td id="stationLayerToggle" class="buttonActive" onclick="layerToggle(stationLayer, 'stationLayerToggle')"><i class="fas fa-wifi"></i></td></tr>
						<tr><td>MLAT Mesh</td><td id="meshLayerToggle" class="button" onclick="layerToggle(meshLayer, 'meshLayerToggle')"><i class="fas fa-dice-d20"></i></td></tr>
						<tr><td>Heatmap</td><td id="heatmapLayerToggle" class="button" onclick="heatmapLayerToggle()"><i class="fas fa-bullseye"></i></td></tr>
						<tr><td>OpenSeaMap</td><td id="openSeaMapToggle" class="button" onclick="layerToggle(openSeaMapLayer, 'openSeaMapToggle')"><i class="fas fa-ship"></i></td></tr>
						<tr><td>Precipitation radar (Germany only)</td><td id="precipitationRadarToggle" class="button" onclick="layerToggle(precipitationLayer, 'precipitationRadarToggle')"><i class="fas fa-cloud-showers-heavy"></i></td></tr>
						<tr><td>Weather warnings (Germany only)</td><td id="weatherWarningToggle" class="button" onclick="layerToggle(weatherWarningLayer, 'weatherWarningToggle')"><i class="fas fa-exclamation-triangle"></i></td></tr>
						<tr><td>Water levels (Germany only)</td><td id="pegelOnlineToggle" class="button" onclick="layerToggle(pegelOnlineLayer, 'pegelOnlineToggle')"><i class="fas fa-water"></i></td></tr>
						<tr><td>Ovals</td><td id="ovalsToggle" class="button" onclick="layerToggle(ovalsLayer, 'ovalsToggle')"><i class="fas fa-circle-notch"></i></td></tr>
						<tr><td>Dark mode</td><td id="darkmodeToggle" class="button" onclick="darkmodeToggle()"><i class="fas fa-moon"></i></td></tr>
					</tbody>
				</table>
				<br>

				<!--notifications-->
				<table>
					<thead>
						<tr><td colspan="3"><i class="far fa-comment-alt"></i> Desktop notifications</td></tr>
					</thead>
					<tbody>
						<tr><td>Notification</td><td id="notifyIndicator" onclick="notifyToggle()"><i class="fas fa-comment-slash"></i></td></tr>
						<tr><td>Notification Sound</td><td id="notifySoundIndicator" onclick="notifySoundToggle()"><i class="fas fa-volume-mute"></i></td></tr>
						<tr><td>Send a test notification</td><td colspan="2" onclick="notify('This is a test')"><i class="fas fa-paper-plane"></i></td></tr>
						<tr><td colspan="3">Will send a notification to your desktop if there is an interesting aircraft to see</td></tr>
					</tbody>
				</table>
				<br>
				<div class="infobox">
					<h1>Please note</h1>
					To use desktop notifications your browser must support it and be configured allow it for this site.</br>
					Acoustic notifications are an addon to desktop notifications, they will not work standalone.
				</div>
			</div>
		</div>

		<!--Sanduhr-->
		<i id="activityIndicator" class="far fa-hourglass"></i>

		<!--Overlays-->
		<!--About-->
		<div class="centeroverlay" id="about">
			<div class="centeroverlayClose" onclick="centeroverlayClose(); sidebarShow()">
				<i class="fas fa-window-close"></i>
			</div>
			<div class="centeroverlayContent">
				<h1>About</h1>
				<div class="aboutSectionGrid">
					<div class="aboutSection">
						<h2>About us</h2>
						<ul>
							<li>We are a bunch of hobbyists containing of aviation enthusiasts, ham radio operators, ...</li>
							<li>We are interested in everything moving no matter if it is planes, ships, trains or satellites</li>
							<li>We build our own aircraft, ship and radiosonde tracking network</li>
						</ul>
					</div>
					<div class="aboutSection">
						<h2>About our network</h2>
						<ul>
							<li>We are noncommercial</li>
							<li>We develop our own application and continue to modify it to our liking</li>
							<li>We are very focused on the feeder stations and we do have a lot of features geared towards them</li>
						</ul>
					</div>
					<div class="aboutSection">
						<h2>Getting started</h2>
						<ul>
							<li>Check out our <a href="https://github.com/sdrmap/sdrmapfeeder/wiki" target="_blank">wiki</a> to learn more about building an ADS-B, AIS and radiosonde receiver station</li>
							<li>If you already have a station you can <a href="https://github.com/sdrmap/sdrmapfeeder/wiki" target="_blank">start feeding today</a></li>
						</ul>
					</div>
					<div class="aboutSection">
						<h2>Get in touch</h2>
						<ul>
							<li>send us an email <a href="mailto:feed@sdrmap.org">feed@sdrmap.org</a></li>
							<li>visit our mumble server <a href="mumble://mumble.chaos-consulting.de">mumble.chaos-consulting.de</a></li>
						</ul>
					</div>
				</div>
				<h1>Explanation</h1>
				<div class="aboutSectionGrid">
					<div class="aboutSection">
						<h2>Altitude colors</h2>
						The flying altitude of an Aircraft is indicated by its color. Ships are normally blue or grey if moored.</br></br>
						<table>
							<thead>
								<tr><td>Color</td><td>m</td><td>ft</td></tr>
							</thead>
							<tbody>
								<tr><td style="background-color:#aaa"></td><td>0</td><td>0</td></tr>
								<tr><td style="background-color:#a52a2a"></td><td>1+</td><td>1+</td></tr>
								<tr><td style="background-color:#d97012"></td><td>305+</td><td>1.000+</td></tr>
								<tr><td style="background-color:#ffa500"></td><td>610+</td><td>2.000+</td></tr>
								<tr><td style="background-color:#ffcc00"></td><td>915+</td><td>3.000+</td></tr>
								<tr><td style="background-color:#ff0"></td><td>1373+</td><td>4.500+</td></tr>
								<tr><td style="background-color:#afda21"></td><td>1.830+</td><td>6.000+</td></tr>
								<tr><td style="background-color:#45a94d"></td><td>2.288+</td><td>7.500+</td></tr>
								<tr><td style="background-color:#51b67b"></td><td>2.745+</td><td>9.000+</td></tr>
								<tr><td style="background-color:#61c7b8"></td><td>3.202+</td><td>10.500+</td></tr>
								<tr><td style="background-color:#4dacd6"></td><td>3.360+</td><td>12.000+</td></tr>
								<tr><td style="background-color:#3388ff"></td><td>4.117+</td><td>13.500+</td></tr>
								<tr><td style="background-color:#5364ff"></td><td>15.000+</td><td>49.240+</td></tr>
								<tr><td style="background-color:#6a48ff"></td><td>25.000+</td><td>82.067+</td></tr>
								<tr><td style="background-color:#8b24ff"></td><td>30.000+</td><td>98.481+</td></tr>
								<tr><td style="background-color:#aa00ff"></td><td>50.000+</td><td>164.135+</td></tr>		
							</tbody>
						</table>
					</div>
					<div class="aboutSection">
						<h2>Type colors</h2>
						Special vehicles like rescue ships or aircrafts or military vehicles are color coded. Other special vehicles like pilot boats are marked as interesting.<br>
						These colors are used on the vehicles on the map as well as in the lists in the sidebar. The altitude of this vehicle is not indicated in the vehicles color but in the color of the vehicles track.</br></br>
						<table>
							<thead>
								<tr><td>Color</td><td>Type</td></tr>
							</thead>
							<tbody>
								<tr><td style="background-color:#f00"></td><td>Rescue and Police</td></tr>
								<tr><td style="background-color:#0f0"></td><td>Military</td></tr>
								<tr><td style="background-color:#ff00c3"></td><td>Interesting</td></tr>
							</tbody>
						</table>
					</div>
					<div class="aboutSection">
						<h2>Positions</h2>
						<table>
							<tbody>
								<tr><td><i class="fas fa-check-circle"></i></td><td>This position is transmitted by the vehicle</td></tr>
								<tr><td><i class="fas fa-compass mlat-compass"></i></td><td>This position is calculated via MLAT as the aircraft does not transmit its position</td></tr>
								<tr><td><i class="fas fa-times-circle"></i></td><td>This vehicle has no position</td></tr>
							</tbody>
						</table>
						<h2>Multilateration (MLAT)</h2>
						 If an aircraft does not transmit its position via ADS-B but does send its ICAO code there is the option to calculate the aircrafts position via MLAT. To be able to do this there are at least 3 receiver stations needed which are MLAT enabled, do receive the planes messages at a decent signal level and are in sync with each other. The more stations are involved in the calculation the more accurate it gets.
						If you do have a station make sure to enable MLAT.
					</div>
					<div class="aboutSection">
						<h2>Buttons</h2>
						<i class="fas fa-angle-double-left"></i> Show sidebar</br></br>
						<i class="fas fa-angle-double-right"></i> Hide sidebar</br></br>
						<i class="fas fa-plane"></i> Show list of active aircrafts</br></br>
						<i class="fas fa-ship"></i> Show list of active ships</br></br>
						<i class="fas fa-parachute-box"></i> Show list of active radiosondes</br></br>
						<i class="fas fa-broadcast-tower"></i> Show list of receiver stations</br></br>
						<i class="fas fa-chart-column"></i> Show statistics</br></br>
						<i class="fas fa-filter"></i> Configure different filters</br></br>
						<i class="fas fa-cogs"></i> Configure different settings</br></br>
						<i class="fas fa-location-crosshairs"></i> Center map on your position (uses your browsers geolocation api)</br></br>
						<i class="fas fa-plus-square"></i> Expand section</br></br>
						<i class="fas fa-minus-square"></i> Collapse section</br></br>
						There are so much more buttons and functions, just try them. If you misconfigured something and do not now the way back you can always reload the webpage to reset all settings.
					</div>
					<div class="aboutSection">
						<h2>More</h2>
						<ul>
							<li>
								<a href="https://en.wikipedia.org/wiki/Lists_of_airlines">https://en.wikipedia.org/wiki/Lists_of_airlines</a>
							</li>
						</ul>
					</div>
				</div>
				<h1 id="Changelog">Changelog</h1>
				<div class="aboutSectionGrid">
					<div class="aboutSection">
						<h2>Version 4 (19.12.2024)</h2>
						Over the last 8 years we became more than an ADS-B site by adding AIS in 2021 and radiosondes in 2023. This is why <b>adsb.chaos-consulting.de</b> is now <b>sdrmap.org</b>.
						<h3>ADS-B</h3>
						<ul>
							<li>New: Now showing how long ago each station received the last packet from the selected aircraft</li>
							<li>Improvement: More than 200 new pictures of aircrafts</li>
							<li>Improvement: Livetrack now with on hover infos like history track (timestamp, altitude, vertrate )</li>
							<li>Improvement: Now showing true heading of planes on ground</li>
						</ul>
						<h3>MLAT</h3>
						<ul>
							<li>New: Differentiating between stations without MLAT capability (red) and those that do support mlat but are not used for position calculation of this aircraft at the moment (grey)</li>
							<li>Improvement: Fixed MLAT mesh links</li>
						</ul>
						<h3>AIS</h3>
						<ul>
							<li>New: Now showing how long ago each station received the last packet from the selected ship</li>
							<li>Improvement: Better handling of invalid positions transmitted by atons</li>
						</ul>
						<h3>Radiosondes</h3>
						<ul>
							<li>New: Radiosonde uptime and killtimer for some types</li>
							<li>New: Radiosonde battery voltage gauge now scaled accordingly to different sonde types</li>
							<li>New: Introducing radiosondes minumum, average and maximum hoizontal and vertical speed</li>
							<li>New: Now showing how long ago each station received the last packet from the selected radiosonde</li>
							<li>New: Realtime Inflight predicition of flightpath and landingpoint for flying radiosondes based on flight, weather and elevation data</li>
							<li>New: Preflight prediction of flightpath and landingpoint for scheduled launches based on weather and statistical data</li>
							<li>New: GeoJSON archive of all revious flights (can be recalled and visualized on map)</li>
							<li>New: Launchsites are now shown on the map</li>
							<li>New: List of launchsites in the sidebar (Including number of active sondes and time until the next scheduled launch)</li>
							<li>New: Launchsite infocard in the Sidebar (Including info on operator, frequencies, active sondes, recent launches and predictions)</li>
							<li>Improvement: Correct colors according to type in radiosonde list</li>
							<li>Improvement: Correct matching of Radiosondes to Launchsite</li>
						</ul>
						<h3>Stations</h3>
						<ul>
							<li>New: Minimum, average and maximum range and SNR for radiosondes</li>
							<li>New: Hiding empty tables (top10 and MLAT sync peers)</li>
							<li>New: Graphing for minimum, average and maximum range and signal strenght for ADS-B, AIS and Radiosondes</li>
							<li>New: Now showing distance of MLAT sync peers</li>
							<li>New: Color coded sync peers according to sync quality/usability</li>
							<li>Improvement: Fixed inconsistent fields in station list</li>
							<li>Improvement: Chart rendering</li>
							<li>Improvement: Fixed rendering of system performance gauges for offline stations</li>
						</ul>
						<h3>Filters</h3>
						<ul>
							<li>Improvement: Fixed broken "Nav Modes" filter</li>
							<li>Improvement: Altitude filter is a slider now with lower and upper limit and increased range to accomodate radiosondes</li>
						</ul>
						<h3>Repo</h3>
						<ul>
							<li>New: Packages for Ubuntu 24.04 Noble Numbat</li>
							<li>New: sdrmapfeeder package replaces adsbfeederc2is and radiosondefeederc2is</li>
							<li>Improvement: Updated MLAT package mlat-client-sdrmap</li>
							<li>Improvement: Updated AIS-catcher package version 0.60</li>
						</ul>
						<h3>Wiki</h3>
						<ul>
							<li>Improvement: Updatedt the wiki to support the newer packages and os versions and included some feedback from our community</li>
						</ul>
						<h3>General</h3>
						<ul>
							<li>New: Starting point of the map can now be bookmarked or shared via url parameters</li>
							<li>New: Extended colorscheme for very high vehicles up to 35.000m (Radiosondes)</li>
							<li>New: Overall statistics for ADS-B, MLAT, AIS, Radiosondes and Stations</li>
							<li>Improvement: Better handling of "last seen timestamp" resulting in a more accurate value which will keep working even if the vehicle disappears from the map (affecting ADS-B, AIS and Radiosondes)</li>
							<li>Improvement: Fixed multiple units and NaN problems</li>
						</ul>
					</div>
					<div class="aboutSection">
						<h2>Version 3.1 (31.01.2024)</h2>
						<h3>ADS-B</h3>
						<ul>
							<li>Improvement: Receiving stations of an airplane now showing colored numbers for fix, malt and nofix</li>
							<li>Improvement: Mlat coordinates highlighted in plane Info</li>
						</ul>
						<h3>AIS</h3>
						<ul>
							<li>Improvement: Ships orientation now using heading if available instead of course over ground</li>
						</ul>
						<h3>Radiosondes</h3>
						<ul>
							<li>New: Rising radiosondes with ballon icon, falling sondes with parachute</li>
							<li>New: Selected radiosonde now drawing a colorful track according to altitude similar to planes</li>
							<li>New: Launchsite and distance from launchsite</li>
							<li>New: First seen with frame number, date/time, station and altitude</li>
							<li>New: Burstinfo with frame number, date/time, altitude and burst location on map</li>
							<li>New: Military sondes are green and can be filtered</li>
							<li>New: Share link to radiosonde</li>
							<li>Improvement: Track of a selected radiosonde is now updated in realtime</li>
							<li>Improvement: Last seen timer negative numbers fixed (GPS - UTC time offset fixed)</li>
						</ul>
						<h3>Stations</h3>
						<ul>
							<li>New: Status per service like ADS-B, AIS, ... with last seen resulting in correct status for stations feeding AIS and/or radiosondes but no ADS-B</li>
							<li>New: Additional yellow status for stations with some services online and some offline</li>
							<li>New: Offline stations vanish from list after 2 weeks</li>
							<li>New: Graphs now feature a 1 hour option</li>
							<li>Improvement: fixed handling of insufficient power supply for stations switching from Raspberry Pi to other type of PC</li>
						</ul>
						<h3>Filters</h3>
						<ul>
							<li>New: Filtering now working for radiosondes</li>
						</ul>
						<h3>Repo</h3>
						<ul>
							<li>New: Support for Debian 12  / Raspberry Pi OS 12 / Ubuntu 22.04 LTS</li>
							<li>New: Support for 64bit Raspberry Pi OS</li>
							<li>New: Packages for radiosonde reception (radiosondeautorx)</li>
						</ul>
						<h3>Wiki</h3>
						<ul>
							<li>New: Service overview</li>
							<li>New: Antennas for AIS and radiosondes</li>
							<li>New: Signal Splitter guide</li>
							<li>New: Radio sonde installation guide</li>
							<li>Improvement: Completely reworked hardware selection guide</li>
							<li>Improvement: Completely reworked powering section</li>
							<li>Improvement: Updated installation instructions</li>
						</ul>
						<h3>General</h3>
						<ul>
							<li>New: Reimplemented rendering engine in canvas resulting in much better performance and compatibility with a wide range of browsers and devices</li>
							<li>Improvement: Multiple optimizations in the frontend and backend resulting in a better performance and a more stability</li>
							<li>Improvement: Muliple UI fixes</li>
							<li>Removed: Removed layer of german airports</li>
							<li>Update: Updated leaflet version</li>
						</ul>
					</div>
					<div class="aboutSection">
						<h2>Version 3.0 (22.06.2023)</h2>
						<h3>ADS-B</h3>
						<ul>
							<li>New: NAV-Modes and other FMS data</li>
							<li>Improvement: General overhaul</li>
						</ul>
						<h3>AIS</h3>
						<ul>
							<li>New: Ship pictures</li>
							<li>New: ATONs are recognized and shown on map</li>
							<li>New: SAR helicopters are recognized and shown on map</li>
							<li>Improvement: General overhaul</li>
						</ul>
						<h3>Radiosondes</h3>
						<ul>
							<li>Completely new type of vehicles on the map</li>
							<li>Feeding script available in the repo</li>
						</ul>
						<h3>Stations</h3>
						<ul>
							<li>New: System information and performance values</li>
							<li>New: Graphs showing station performance</li>
							<li>New: Coverage rings on heatmap</li>
							<li>Improvement: General overhaul</li>
						</ul>
						<h3>Filters</h3>
						<ul>
							<li>New: NAV-Modes</li>
							<li>New: Speed</li>
							<li>New: Radiosondes</li>
						</ul>
						<h3>Repo</h3>
						<ul>
							<li>New: Feeding scripts for Radiosonde & ADS-B packaged</li>
							<li>Update: AIS-catcher v0.48</li>
							<li>Update: dump1090-fa v8.2</li>
						</ul>
						<h3>General</h3>
						<ul>
							<li>New: Warning, when connection is lost</li>
							<li>New: Selected vehicle is highlighted</li>
							<li>Improvement: Major overhaul of incoming AIS data processing</li>
							<li>Improvement: General UI overhaul</li>
							<li>Improvement: Rendering on multiple mobile devices</li>
							<li>Improvement: About section overhaul</li>
							<li>Improvement: Wiki instructions</li>
						</ul>
					</div>
					<div class="aboutSection">
						<h2> Version 2.4</h2>
						<h3>Plane/Ship info card</h3>
						<ul>
							<li>major overhaul and adjustments</li>
							<li>AIS is now multistation capable</li>
						</ul>

						<h3>Station info card</h3>
						<ul>
							<li>Action buttons<ul>
								<li>Filtering</li>
								<li>Heatmap</li>
								<li>Locate</li>
							</ul></li>
							<li>more statistics</li>
						</ul>

						<h3>Map</h3>
						<ul>
							<li>Tanker oval layer</li>
							<li>Geolocation</li>
							<li>Zoom buttons</li>
							<li>Darkmode</li>
							<li>Auto dark mode (browser setting)</li>
							<li>AIS Buoys Support</li>
						</ul>

						<h3>Station List</h3>
						<ul>
							<li>AIS-only stations appear in list</li>
							<li>Design overhaul</li>
						</ul>

						<h3>Filtering</h3>
						<ul>
							<li>AIS-only stations can be selected</li>
							<li>Reset button</li>
						</ul>

						<h3>Bugfixes</h3>
						<ul>
							<li>Fix heatmap</li>
							<li>Sidebar isn't cut anymore at the bottom</li>
							<li>Mobile mode fixes</li>
						</ul>

						<h3>Software</h3>
						<ul>
							<li>Repository<ul>
								<li>dump1090-fa</li>
								<li>mlat-client</li>
								<li>ais-catcher</li>
								<li>New ais-catcher releases<ul>
									<li>no gpsd needed</li>
									<li>integrated feeding for Chaos Consulting</li>
								</ul></li>
							</ul></li>
						</ul>
					</div>
				</div>
				<h1>Attributions</h1>
				<div class="aboutSectionGrid">
					<div class="aboutSection">
						<h2>Librarys</h2>
						This webapp is open source and is made with open source components. Without the great tools below this would not be possible.
						<br>
						</br></br>
						<h3>Leafletjs</h3>
						This is the libary we are using to build the interactive map <a href="https://leafletjs.com">https://leafletjs.com</a>
						</br></br>
						<h3>Leaflet-realtime</h3>
						Making those planes move <a href="https://github.com/perliedman/leaflet-realtime">https://github.com/perliedman/leaflet-realtime</a>
						</br></br>
						<h3>Leaflet-active-area</h3>
						Doin good stuff <a href="https://github.com/Mappy/Leaflet-active-area">https://github.com/Mappy/Leaflet-active-area</a>
						</br></br>
						<h3>Leaflet.heat</h3>
						For all the heatmaps <a href="https://github.com/Leaflet/Leaflet.heat">https://github.com/Leaflet/Leaflet.heat</a>
						</br></br>
						<h3>FontAwesome</h3>
						For all the pretty clicky icons <a href="https://fontawesome.com/">https://fontawesome.com</a>
						</br></br>
						<h3>Tabulator</h3>
						Dynamic sortable tables in the sidebar <a href="http://tabulator.info">http://tabulator.info</a>
					</div>
					<div class="aboutSection">
						<h2>Open Data</h2>
						No matter if map tiles and weather data or gerneral aviation knowledge we would not be able to do what we are doing without the following services.
						<h3>OpenStreetMap</h3>
						All map data <a href="https://www.openstreetmap.org/copyright">https://www.openstreetmap.org/copyright</a>
						</br></br>
						<h3>OpenSeaMap</h3>
						Sea map data <a href="https://openseamap.org">https://openseamap.org</a>
						</br></br>
						<h3>Deutscher Wetterdienst / PegelOnline</h3>
						The precipitation data, weather warnings and water levels of German rivers and coasts are taken from the great Open Data Services by <a href="https://www.dwd.de/">Deutscher Wetterdienst</a> and <a href="https://www.wsv.de/">Wasserstraßen- und Schifffahrtsverwaltung des Bundes</a>
						</br></br>
						<h3>Wikipedia</h3>
						All the knowledge about airlines and planes <a href="https://de.wikipedia.org">https://de.wikipedia.org</a>
						</br></br>
						<h3>junzis Aircraft Database</h3>
						Aircraft registrations and model information are based on the last release of <a href="https://junzis.com/adb/">junzis Aircraft DB (MIT License)</a>, regulary updated by us with own observations and research.
					</div>
					<div class="aboutSection">
						<h2>Source code</h2>
						As this website is open source you can have a look at the source code. You will find it right here: <a href="https://github.com/sdrmap/sdrmapclient">https://github.com/sdrmap/sdrmapclient</a>
						If you experience a bug let us now. If you have an idea for improvement just talk to us, we will look at it but can not make any promises as development takes place in our spare time.
					</div>
				</div>
				<h1>Markers</h1>
				<div class="aboutSectionGrid">
					<div class="aboutSection">
						</br>
						All the marker icons used on the map are listed here with their license and origin.
						</br></br>
						<div id="attributionMarkers"></div>
					</div>
				</div>
			</div>
		</div>

		<!--StationsGraphs-->
		<div class="centeroverlay" id="stationGraphsBig">
			<div class="centeroverlayClose" onclick="centeroverlayClose(); sidebarShow()">
				<i class="fas fa-window-close"></i>
			</div>
			<div class="centeroverlayContent">
				<h1 id="stationGraphBigStationname"></h1>
				<div class="stationGraphsTimespanButtonContainer">
					<div class="stationGraphsTimespanButton" id="stationGraphsTimespanButton1h" onclick="stationGraphsTimespanSet('1h')">1 hour</div>
					<div class="stationGraphsTimespanButtonActive" id="stationGraphsTimespanButton1d" onclick="stationGraphsTimespanSet('1d')">1 day</div>
					<div class="stationGraphsTimespanButton" id="stationGraphsTimespanButton7d" onclick="stationGraphsTimespanSet('7d')">7 days</div>
					<div class="stationGraphsTimespanButton" id="stationGraphsTimespanButton30d" onclick="stationGraphsTimespanSet('30d')">30 days</div>
					<div class="stationGraphsTimespanButton" id="stationGraphsTimespanButton1y" onclick="stationGraphsTimespanSet('1y')">1 year</div>
					<div class="stationGraphsTimespanButton" id="stationGraphsTimespanButton3y" onclick="stationGraphsTimespanSet('3y')">3 year</div>
				</div>
				<div class="graphSectionGrid">
					<div class="graphSection"><canvas id="stationGraphBigAdsbDoughnut" ></canvas></div>
					<div class="graphSection"><canvas id="stationGraphBigAdsb" ></canvas></div>
					<div class="graphSection"><canvas id="stationGraphBigAdsbDistance" ></canvas></div>
					<div class="graphSection"><canvas id="stationGraphBigAdsbRssi" ></canvas></div>
					<div class="graphSection"><canvas id="stationGraphBigMlatPeers" ></canvas></div>
					<div class="graphSection"><canvas id="stationGraphBigAis" ></canvas></div>
					<div class="graphSection"><canvas id="stationGraphBigAisDistance" ></canvas></div>
					<div class="graphSection"><canvas id="stationGraphBigAisRssi" ></canvas></div>
					<div class="graphSection"><canvas id="stationGraphBigRadiosondes" ></canvas></div>
					<div class="graphSection"><canvas id="stationGraphBigRadiosondesDistance" ></canvas></div>
					<div class="graphSection"><canvas id="stationGraphBigRadiosondesSnr" ></canvas></div>
					<div class="graphSection"><canvas id="stationGraphBigSysperformance" ></canvas></div>
					<div class="graphSection"><canvas id="stationGraphBigUptime" ></canvas></div>
				</div>
			</div>
		</div>

		<!--radiosondeGraphs-->
		<div class="centeroverlay" id="radiosondeGraphs">
			<div class="centeroverlayClose" onclick="centeroverlayClose(); sidebarShow()">
				<i class="fas fa-window-close"></i>
			</div>
			<div class="centeroverlayContent">
				<h1 id="radiosondeGraphRid"></h1>
				<div class="graphSectionGrid">
						<div class="graphSection"><canvas id="radiosondeGraphAltitude" ></canvas></div>
						<div class="graphSection"><canvas id="radiosondeGraphTemperature" ></canvas></div>
						<div class="graphSection"><canvas id="radiosondeGraphVelocity" ></canvas></div>
						<div class="graphSection"><canvas id="radiosondeGraphSysinfo" ></canvas></div>
				</div>
			</div>
		</div>

		<!--overallGraphs-->
		<div class="centeroverlay" id="overallGraphs">
			<div class="centeroverlayClose" onclick="centeroverlayClose(); sidebarShow()">
				<i class="fas fa-window-close"></i>
			</div>
			<div class="centeroverlayContent">
				<h1>Overall Statistics</h1>
				<div class="overallGraphsTimespanButtonContainer">
					<div class="overallGraphsTimespanButton" id="overallGraphsTimespanButton1h" onclick="overallGraphsRefresh('1h')">1 hour</div>
					<div class="overallGraphsTimespanButtonActive" id="overallGraphsTimespanButton1d" onclick="overallGraphsRefresh('1d')">1 day</div>
					<div class="overallGraphsTimespanButton" id="overallGraphsTimespanButton7d" onclick="overallGraphsRefresh('7d')">7 days</div>
					<div class="overallGraphsTimespanButton" id="overallGraphsTimespanButton30d" onclick="overallGraphsRefresh('30d')">30 days</div>
					<div class="overallGraphsTimespanButton" id="overallGraphsTimespanButton1y" onclick="overallGraphsRefresh('1y')">1 year</div>
					<div class="overallGraphsTimespanButton" id="overallGraphsTimespanButton3y" onclick="overallGraphsRefresh('3y')">3 year</div>
				</div>
				<div class="graphSectionGrid">
						<div class="graphSection"><canvas id="overallGraphAdsbDoughnut" ></canvas></div>
						<div class="graphSection"><canvas id="overallGraphAdsbTypeDoughnut" ></canvas></div>
						<div class="graphSection"><canvas id="overallGraphAdsb" ></canvas></div>
						<div class="graphSection"><canvas id="overallGraphAdsbType" ></canvas></div>
						<div class="graphSection"><canvas id="overallGraphAisDoughnut" ></canvas></div>
						<div class="graphSection"><canvas id="overallGraphAisTypeDoughnut" ></canvas></div>
						<div class="graphSection"><canvas id="overallGraphAis" ></canvas></div>
						<div class="graphSection"><canvas id="overallGraphAisType" ></canvas></div>
						<div class="graphSection"><canvas id="overallGraphRadiosondesDoughnut" ></canvas></div>
						<div class="graphSection"><canvas id="overallGraphRadiosondesTypeDoughnut" ></canvas></div>
						<div class="graphSection"><canvas id="overallGraphRadiosondes" ></canvas></div>
						<div class="graphSection"><canvas id="overallGraphRadiosondesType" ></canvas></div>
						<div class="graphSection"><canvas id="overallGraphStationsDoughnut" ></canvas></div>
						<div class="graphSection"><canvas id="overallGraphStationsTypeBar" ></canvas></div>
						<div class="graphSection"><canvas id="overallGraphStations" ></canvas></div>
						<div class="graphSection"><canvas id="overallGraphStationsType" ></canvas></div>
				</div>
				</div>
			</div>
		</div>

		<!--search-->
		<div class="centeroverlay" id="search">
			<div class="centeroverlayClose" onclick="centeroverlayClose(); sidebarShow()">
				<i class="fas fa-window-close"></i>
			</div>
			<div class="centeroverlayContent">
				<h1 onclick="radiosondeSearchTableInit()">Search</h1>
				<table id="radiosondeSearchIputTable">
					<thead>
						<tr>
							<td><i class="fa-solid fa-barcode"></i></td>
							<td><i class="fa-solid fa-wave-square"></i></td>
							<td><i class="fa-solid fa-tag"></i></td>
							<td><i class="fa-solid fa-asterisk"></i></td>
							<td><i class="fa-solid fa-clock"></i></td>
						</tr>
					</thead>
					<tbody id="radiosondeSearchInputTableBody">
						<tr>
							<td><input type="text" id="radiosondeSearchId"></td>
							<td><i class="fa-solid fa-wave-square"></i></td>
							<td><i class="fa-solid fa-tag"></i></td>
							<td><input type="text" id="radiosondeSearchLaunchsite"></td>
							<td><i class="fa-solid fa-clock"></i></td>
						</tr>
					</tbody>
				</table>
				<div onclick="radiosondeSearchTableRefresh()" class="button">
					<i class="fa-solid fa-magnifying-glass"></i>
				</div>

				<!--radiosondeSearchTable-->
				<div class="content" id="radiosondeSearchContent">
					<table id="radiosondeSearchTable">
						<thead>
							<tr>
								<td><i class="fa-solid fa-barcode"></i></td>
								<td><i class="fa-solid fa-wave-square"></i></td>
								<td><i class="fa-solid fa-tag"></i></td>
								<td><i class="fa-solid fa-asterisk"></i></td>
								<td><i class="fa-solid fa-clock"></i></td>
							</tr>
						</thead>
						<tbody id="radiosondeSearchTableBody">
						</tbody>
					</table>
				</div>
			</div>
		</div>
		
		<!--cornerbox-->
		<div id="corneroverlay">
			<div id="corneroverlayHeadline">
				<i class="fa-solid fa-circle-info"></i>
				Info
				<i class="fas fa-window-close" onclick="corneroverlayClose()"></i>
			</div>
			<div id="corneroverlayContent">
				n/a
			</div>
		</div>
	</body>

	<!--tables-->
	<script src="js/tables.js"></script>

	<!--script-->
	<script src="js/script.js"></script>

	<script src="js/ovals.js"></script>
	<script src="js/geolocation.js"></script>
</html>
