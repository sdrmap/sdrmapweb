/****************************************/
/************Initial stuff***************/
/****************************************/

/****************************************/
/***************Variables****************/
/****************************************/

//Basedir
var urlBase = 'https://sdrmap.org';
var urlHistory = 'https://adsb.api.sdrmap.org/planesHistory.json';

//Map
const canvasRenderer = L.canvas();
//const vehicleRenderer = new canvasPath2D();
const vehicleRenderer = new canvasPath2D({pane: 'planes'});
const map = L.map('map',{
	zoomControl: false,
	renderer: vehicleRenderer
	}).setActiveArea({
		position: 'absolute',
		top: '0px',
		left: '0px',
		right: '400px',
		bottom: '0px'
});

/*const eventForwarder = new L.eventForwarder({
	map: map,
	events: {mousemove: true}
});
eventForwarder.enable();*/

const markersCanvas = new L.LayerGroup();
markersCanvas.addTo(map);

map.createPane('radiosondes');
map.getPane('radiosondes').style.zIndex = 645;
map.createPane('planes');
map.getPane('planes').style.zIndex = 640;
map.createPane('ships');
map.getPane('ships').style.zIndex = 635;
map.createPane('stations');
map.getPane('stations').style.zIndex = 630;

var osmLayer = osmLayer.addTo(map);

//aircrafts
var aircrafts;
var aircraftsFiltered;
var aircraftsGeojson = {
	type: 'FeatureCollection',
	features: []
}

//ships
var shipsGeojson = {
	type: 'FeatureCollection',
	features: []
}

//radiosondes
var radiosondes;
var radiosondeSelectedData;
var radiosondeInterval;
var radiosondesFiltered;
var radiosondesGeojson = {
	type: 'FeatureCollection',
	features: []
}
var radiosondeSelectedAltMax=0;
var burstmarker;
var predictionBurstmarkerGroup = L.layerGroup().addTo(map);
var predictionLandingpointmarkerGroup = L.layerGroup().addTo(map);
var recentBurstmarkerGroup = L.layerGroup().addTo(map);
var recentLandingpointmarkerGroup = L.layerGroup().addTo(map);
var radiosondeSearchTableData=[];
var radiosondeSearchTableDataFiltered=[];

//launchsites
var launchsiteLayer;
var launchsiteListInterval;
var launchsiteSelected;
var launchsiteUpcomingSondes;

//Stations
var stationLayer;
var stationLayerActivated = true;
var stationSelected;
var stationSelectedLat;
var stationSelectedLon;
var stationRangerings = L.layerGroup();
var stationMlatPeersTableData =[];
var stationsGeojson = {
	type: 'FeatureCollection',
	features: []
}

//Airports
var airportLayer;
var airportLayerActivated = false;

//Heatmap
var heatmapLayer;
var heatmapLayerActive = false;

//Vehicle
//Speed&Altitude
//var planeSpeedOld;
var vehicleSpeedOld;
var planeAltitudeOld;
var planeDirectionOld;
var vehicleDirectionOld;
var vehiclePositionOld;
var vehicleType;

//Track
var track;
var predictionTrack;
var fetchController;

//History ghostmarker
var planeGhostMarker;

//Crosshairs tracking
var vehicleInFocus = false;

//Tables
var planesHistoryTableData =[];
var stationPlanesTableData =[];
var radiosondeListTableData=[];

//Sidebar
var sidebar = true;
var sidebarLock = false;

//Filters
var filterType = 'all';
var filterStation = 'all';
var filterAltitude = 999999;//alt muss weg
var filterAltitudeMin = 0;
//var filterAltitudeMax = 50000;
var filterAltitudeMax = 120000;
var filterSpeedMin = 0;
var filterSpeedMax = 2000;
var filterModel = 'all';
var filterFix = 'all';
var filterSource = 'all';
var filterSelected = 'all';
var filterNav = 'all';

//magic
var magic = false;
var magicTime = 0;

//Notifications
var notifyState = false;
var notifyCache = [];
var notifySound = false;

//mobile
var mobile = false;
var extra = false;

var geolocation = false;

//
var mesh = false;
var meshLayer;

var alertNetworkOnce = 0;

//
var centeroverlays = ['about', 'stationGraphsBig', 'radiosondeGraphs', 'overallGraphs', 'search'];

//Layergroup
var trackGroup = L.layerGroup().addTo(map);
var predictionTrackGroup = L.layerGroup().addTo(map);
var recentTrackGroup = L.layerGroup().addTo(map);

var id = getUrlVars()["plane"];
var urlship = getUrlVars()["ship"];
var urlradiosonde = getUrlVars()["radiosonde"];
var station = getUrlVars()["station"];
var launchsite = getUrlVars()["launchsite"];
var lat = getUrlVars()["lat"];
var lon = getUrlVars()["lon"];
var zoom = getUrlVars()["zoom"];

//Leaflet map
map.attributionControl.setPosition('bottomleft');

map.on('click', vehicleDeSelect);

//
var darkmode = false;

//graphs
var stationGraphsTimespan = '1d';
var overallGraphsTimespan = '1d';

map.on('moveend', function() {
	if(!vehicleInFocus) {
		worker({ aircrafts: true, ships: true, stations: true, radiosondes: true });
	}

	setUrlVars();
});

map.on('zoomend', function() {
	if(map.getZoom() < 8) {
		planeLayer.options.interval=5000;
		shipLayer.options.interval=30000;
		radiosondeLayer.options.interval=5000;
	} else {
		planeLayer.options.interval=1000;
		shipLayer.options.interval=5000;
		radiosondeLayer.options.interval=1000;
	}

	
	//planeLayer.stop();
	//planeLayer.start();
	//layersRefresh();
	//worker({ aircrafts: true, ships: true, stations: true, radiosondes: true });

	/*if(map.getZoom() < 8) {
		shipLayer.options.interval=30000;
	} else {
		shipLayer.options.interval=5000;
	}
	shipLayer.stop();
	shipLayer.start();*/
});

//worker
function worker (refreshRealtimeLayers = { aircrafts: false, ships: false, stations: false, radiosondes: false, stop: false }){
	//ADS-B
	var aircraftsFilteredTmp = [];
	var tableData = [];

	fetch('https://adsb.api.sdrmap.org/aircraft.json')
	.catch((error) => {
		if(alertNetworkOnce == 0){
			corneroverlayShow('crit', 'No connection to Server, this application does not work offine!');
			alertNetworkOnce = 1;
		}
	})
	.then(function(response) { return response.json(); })
	.then(function(dataIn) {
		aircrafts=dataIn.aircraft;
		if(alertNetworkOnce != 0){
			alertNetworkOnce = 0;
			corneroverlayClose();
		}

		aircraftsGeojson = {
			type: 'FeatureCollection',
			features: []
		}

		//Tasks per plane
		Object.values(dataIn.aircraft).forEach(
			function plane(f) {
				//Hier wird gefiltert
				var include = true;

				//bounds
				//if(typeof f.lon === 'undefined' || typeof f.lat === 'undefined' || !map.getBounds().contains(L.latLng(f.lat, f.lon))) {
/*				if(typeof f.lon === 'undefined' || typeof f.lat === 'undefined') {
					include = false;
				}
*/
				if(typeof f.lon !== 'undefined' && typeof f.lat !== 'undefined' && !map.getBounds().contains(L.latLng(f.lat, f.lon))) {
						include = false;
				}

				//filterType
				if(filterType != 'all'){
					if(filterType != f.type){
						if(filterType=='bim'){
							if(f.type != 'bos' && f.type != 'int' && f.type != 'mil'){
								include = false;
							}
						}
						else{
							include = false;
						}
					}
				}
				
				//filterNav
				if(filterNav != 'all'){
					console.log(filterNav);
					if(typeof f.nav === 'undefined' || typeof f.nav.modes === 'undefined' || !(filterNav in f.nav.modes)){
						include=false;
					}
				}

				//filterStation
				if(filterStation != 'all'){
					if(!(filterStation in f.station)){
						include = false;
					}
				}

				//filterAltitude
				if(filterAltitudeMin != 999999){
					if(filterAltitudeMin > f.altitude){
						include = false;
					}
				}

				//filterAltitude
				if(filterAltitudeMax != 999999){
					if(filterAltitudeMax < f.altitude){
						include = false;
					}
				}
				
				//filterAltitude
				if(filterAltitudeMin > 0){
					if(f.altitude == 'ground'){
						include = false;
					}
				}

				//filterSpeed
				if(filterSpeedMin != 999999){
					if(filterSpeedMin > ktToKmh(f.speed)){
						include = false;
					}
				}

				//filterSpeed
				if(filterSpeedMax != 999999){
					if(filterSpeedMax < ktToKmh(f.speed)){
						include = false;
					}
				}

				//filterFix
				if(filterFix != 'all'){
					if(filterFix != f.fix){
						include = false;
					}
				}

				//filterSource
				if(filterSource != 'all'){
					if(filterSource != 'adsb'){
						include = false;
					}
				}

				//filterSelected
				if(filterSelected != 'all'){
					if(id != undefined){
						if(f.hex != id){
							include = false;
						}
					}
				}

				if(include == true){
					// only include ships currently visible on the map in the table data
					//hie mus noch nen or lat / lon undefined rein
					//if(map.getBounds().contains(L.latLng(f.lat, f.lon)) || typeof f.lat === "undefined" || typeof f.lon === "undefined") {
						tableData.push({
							'hex': f.hex,
							'registration': f.registration,
							'flight': f.flight,
							'altitude': ftToM(f.altitude),
							'speed': ktToKmh(f.speed),
							'track': f.track,
							'type': f.type,
							'fix': fixToIcon(f.fix)
						});
					//}

					//Mlat -> Opacity
					if(f.fix == 'mlat'){
						var opacity = 0.6
					}
					else{
						var opacity = 1
					}

					//console.log(f.lon + " " + f.lat);
					if(typeof f.lat !== 'undefined' && typeof f.lon !== 'undefined') {
						aircraftsGeojson.features.push({
							"geometry": {
								"type": "Point",
								"coordinates": [f.lon, f.lat]
							},
							"type": "Feature",
							"properties": {
								"id":f.hex,
								"track":f.track,
								"altitude":f.altitude,
								"opacity":opacity,
								"category":f.category,
								"model":f.model,
								"type":f.type
							}
						});
					}
					aircraftsFilteredTmp.push(f);

					//Notifications
					if(notifyState){
						if(!notifyCache.includes(f.hex)){
							if(f.type == 'mil' || f.type == 'bos' || f.type == 'int'){
								notifyCache.push(f.hex);
								notify(f.hex + ' is in the Air as ' + f.flight, f.hex);
							}
						}
					}

					//Selected plane stuff
					if(id === f.hex){

						planeInfoRefresh(f);

						//focus
						if(vehicleInFocus){
							if(typeof f.lat !== 'undefined' && typeof f.lon !== 'undefined'){
								map.panTo([f.lat, f.lon]);
								//map.setView([f.lat, f.lon]);
							}
						}

						//Stations
/*						f.station.sort(function(a,b) {
							return a.fix.localeCompare(b.fix);
						});*/
						document.getElementById("planeStationsTableBody").innerHTML='';
						var tmp = f["station"];//weg?
						var stcount = 0;
						var stcountF = 0;
						var stcountM = 0;
						var stcountNM = 0;
						var stcountN = 0;
						Object.values(f.station).sort((a,b) => {
							var mapping = {
								"true": 0,
								"mlat": 1,
								"nomlat": 2,
								"false": 3
							}
							return mapping[a.fix]-mapping[b.fix];
							})
							.forEach(
							function planeStation(i) {
								//var dist = mToKm(i.dist) + 'Km / ' + i.dist + "m";
								var dist = "";
								//console.log(i.dist);
								if(typeof i.dist !== 'undefined'){
									dist = mToKm(i.dist) + 'Km';
								}
								//planeStations.push({"name": i.name, "fix": fixToIcon(i.fix), "rssi": i.rssix, "dist": dist});
								
								document.getElementById("planeStationsTableBody").innerHTML+='<tr><td onclick="stationSelect(\''+ i.name +'\')">' + i.name + '</td><td>' + secondsToReadable(timeFromNow(i.timestamp)) + '</td><td>' + dist + '</td><td>' + i.rssix + '</td><td>' + fixToIcon(i.fix) + '</td></tr>';
								//<tr><td>Station</td><td>dist</td><td>rssi</td><td>fix</td></tr>
								stcount++;
								if(i.fix === 'true'){
									stcountF++;
								}
								else if(i.fix === 'mlat'){
									stcountM++;
								}
								else if(i.fix === 'nomlat'){
									stcountNM++;
								}
								else{
									stcountN++;
								}
							}
						);
						document.getElementById("planeStationsCount").innerHTML=stcount + '/<span style="color:#0f0">' + stcountF + '</span>/<span style="color:orange">' + stcountM + '</span>/<span style="color:#b7b7b7">' + stcountNM + '</span>/<span style="color:#f00">' + stcountN +'</span>';
						document.getElementById("planeStationsCount").title=stcount + ' total / ' + stcountF + ' fix / ' + stcountM + ' mlat / ' + stcountNM + ' nomlat / ' + stcountN + ' no fix';
						//planeStationsTable.replaceData(planeStations);
					}
				}
		})

		//Refresh planesTableData
		table.replaceData(tableData);
	aircraftsFiltered = aircraftsFilteredTmp;
	});


	//AIS

	fetch('https://ais.api.sdrmap.org/ships.json')
	.then(function(response) { return response.json(); })
	.then(function(dataIn) {
		//
		ships=dataIn.ships;

		//Variables
		var shipsTableData=[];
		var shipStations = [];
		shipsGeojson = {
			type: 'FeatureCollection',
			features: []
		}

		//Tasks per ship
		Object.values(dataIn.ships).forEach(

			function(f){

				//Hier wird gefiltert
				var include = true;

				//bounds
				//if(typeof f.lon === 'undefined' || typeof f.lat === 'undefined' || !map.getBounds().contains(L.latLng(f.lat, f.lon))) {
				if(typeof f.lon === 'undefined' || typeof f.lat === 'undefined') {
					include = false;
				}

				//filterType
				if(filterType != 'all'){
					if(filterType != f.type){
						if(filterType=='bim'){
							if(f.type != 'bos' && f.type != 'int' && f.type != 'mil'){
								include = false;
							}
						}
						else{
							include = false;
						}
					}
				}

				//filterStation
				if(filterStation != 'all'){
					if(!(filterStation in f.station)){
						include = false;
					}
				}

				//filterSource
				if(filterSource != 'all'){
					if(filterSource != 'ais'){
						include = false;
					}
				}

				//filterFix
				if(filterFix != 'all'){
					if(filterFix != f.fix){
						include = false;
					}
				}

				//filterAltitude
				if(filterAltitudeMin != 999999){
					if(filterAltitudeMin > f.altitude){
						include = false;
					}
				}

				//filterAltitude
				if(filterAltitudeMax != 999999){
					if(filterAltitudeMax < f.altitude){
						include = false;
					}
				}
				
				//filterAltitude
				if(filterAltitudeMin > 0){
					include = false;
				}

				//filterSpeed
				if(filterSpeedMin != 999999){
					if(filterSpeedMin > ktToKmh(f.speed)){
						include = false;
					}
				}

				//filterSpeed
				if(filterSpeedMax != 999999){
					if(filterSpeedMax < ktToKmh(f.speed)){
						include = false;
					}
				}

				//filterSelected
				if(filterSelected != 'all'){
					if(id != undefined){
						if(f.mmsi != id){
							include = false;
						}
					}
				}

				if(include){
					// only include ships currently visible on the map in the table data
					if(map.getBounds().contains(L.latLng(f.lat, f.lon))) {
						shipsTableData.push({
							'mmsi': f.mmsi,
							'name': f.shipname,
							'callsign': f.callsign,
							'speed': ktToKmh(f.speed),
							'type': f.type,
							'fix': fixToIcon(f.fix)
						});
					}

					if(typeof f.lon !== 'undefined' && typeof f.lat !== 'undefined'){
						//Push the plane to GeoJson
						var ttrack = f.heading;
						if((typeof f.heading === 'undefined' || f.heading == 511) && f.course != 360 && f.speed > 2){
							ttrack=f.course;
						}
						shipsGeojson.features.push({
							"geometry": {
								"type": "Point",
								"coordinates": [f.lon, f.lat]
							},
							"type": "Feature",
							"properties": {
								"id":f.mmsi,
								"track": ttrack,
								"course": ttrack != f.course ? f.course : false,
								"speed": f.speed,
								"altitude":-10,
								"opacity":Math.abs(1-0.0004*timeFromNow(f.timestamp)),
								"type":f.type,
								"statusLong":f.status_text,
								"to_bow":f.to_bow,
								"to_stern":f.to_stern,
								"to_port":f.to_port,
								"to_starboard":f.to_starboard,
								"model": f.model
							}
						})
					}
				}

				//Selected ship stuff
				if(id === f.mmsi){
					shipInfoRefresh(f);

				Object.values(f.station).forEach(
					function shipStation(i) {
						var dist = "";
						if(typeof i.dist !== 'undefined'){
							dist = i.dist + 'Km';
						}
						shipStations.push({"name": i.name, "fix": fixToIcon(i.fix), "dist": dist});
					}
				);

				//Stations
				document.getElementById("shipStationsTableBody").innerHTML='';
				var tmp = f["station"];//weg?
				var stcount = 0;
				var stcountF = 0;
				var stcountM = 0;
				var stcountN = 0;
				Object.values(f.station).forEach(
					function shipStation(i) {
						var dist = "";
						if(typeof i.dist !== 'undefined'){
							dist = i.dist + 'Km';
						}
						var rssi = "n/a";
						if(i.rssi != null){
							rssi = i.rssi;
						}
						document.getElementById("shipStationsTableBody").innerHTML+='<tr><td onclick="stationSelect(\''+ i.name +'\')">' + i.name + '</td><td>' + secondsToReadable(timeFromNow(i.timestamp)) + '</td><td>' + dist + '</td><td>' + Math.round(rssi * 100)/100 + '</td><td>' + fixToIcon(i.fix) + '</td></tr>';

						stcount++;
						if(i.fix === 'true'){
							stcountF++;
						}
						else if(i.fix === 'mlat'){
							stcountM++;
						}
						else{
							stcountN++;
						}
					}
				);
				document.getElementById("shipStationsCount").innerHTML=stcount + '/' + stcountF + '/' + stcountM + '/' + stcountN;
				document.getElementById("shipStationsCount").title=stcount + ' total / ' + stcountF + ' fix / ' + stcountM + ' mlat / ' + stcountN + ' no fix';

					//focus
					if(vehicleInFocus){
						if(typeof f.lat !== 'undefined' && typeof f.lon !== 'undefined'){
							map.panTo([f.lat, f.lon]);
						}
					}
				}
			}
		)

		//Refresh planesTableData
		shipsTable.replaceData(shipsTableData);

	});

	//Radiosonde
	var radiosondesFilteredTmp = [];

	fetch('https://radiosonde.api.sdrmap.org/radiosondes.json')
	.catch((error) => {
		if(alertNetworkOnce == 0){
			corneroverlayShow('crit', 'No connection to Server, this application does not work offine!');
			alertNetworkOnce = 1;
		}
	})
	.then(function(response) { return response.json(); })
	.then(function(dataIn) {
		radiosondes=dataIn.radiosondes;
		if(alertNetworkOnce != 0){
			alertNetworkOnce = 0;
			corneroverlayClose();
		}

		radiosondesGeojson = {
			type: 'FeatureCollection',
			features: []
		}

		radiosondeListTableData=[];

		//Tasks per radiosonde
		Object.keys(dataIn.radiosondes).forEach(
			function radiosonde(rid){
				var r = dataIn.radiosondes[rid];

				//Hier wird gefiltert
				var include = true;

				//bounds
				//if(typeof r.lon === 'undefined' || typeof r.lat === 'undefined' || !map.getBounds().contains(L.latLng(r.lat, r.lon))) {
				if(typeof r.lon === 'undefined' || typeof r.lat === 'undefined') {
					include = false;
				}

				//filterType
				if(filterType != 'all'){
					if(filterType != r.launchsite.type){
						if(filterType=='bim'){
							if(r.launchsite.type != 'bos' && r.launchsite.type != 'int' && r.launchsite.type != 'mil'){
								include = false;
							}
						}
						else{
							include = false;
						}
					}
				}

				//filterStation
				if(filterStation != 'all'){
					if(!(filterStation in r.stations)){
						include = false;
					}
				}

				//filterAltitude
				if(filterAltitudeMin != 999999){
					if(filterAltitudeMin > mToFt(r.alt)){
						include = false;
					}
				}

				//filterAltitude
				if(filterAltitudeMax != 999999){
					if(filterAltitudeMax < mToFt(r.alt)){
						include = false;
					}
				}

				//filterSpeed
				if(filterSpeedMin != 999999){
					if(filterSpeedMin > r.vel_h){
						include = false;
					}
				}

				//filterFix
				if(filterFix != 'all' && filterFix != "true"){
					include = false;
				}

				//filterSource
				if(filterSource != 'all'){
					if(filterSource != 'radiosonde'){
						include = false;
					}
				}

				//filterSelected
				if(filterSelected != 'all'){
					if(id != undefined){
						if(rid != id){
							include = false;
						}
					}
				}

				if(include == true){
					// only include ships currently visible on the map in the table data
					if(map.getBounds().contains(L.latLng(r.lat, r.lon))) {
						radiosondeListTableData.push({
							"id": rid,
							"frame": r.frame,
							"altitude": r.alt,
							"speed": msToKmh(r.vel_h),
							"temperature": r.temp,
							"timestamp": r.timestamp,
							"model": r.type,
							"launchsite": (typeof r.launchsite !== "undefined" ? r.launchsite : undefined)
						});
					}

					var opacity = 1-0.0004*timeFromNow(r.timestamp);
					if(opacity < 0.28){
						opacity = 0.28;
					}

					if(r.hasOwnProperty("launchsite")){
						if(r.launchsite.hasOwnProperty("type")){
							var temptype = r.launchsite.type
						}
					}

					radiosondesGeojson.features.push({
						"geometry": {
							"type": "Point",
							"coordinates": [r.lon, r.lat]
						},
						"type": "Feature",
						"properties": {
							"id": rid,
							"timestamp": r.timestamp,
							"frame": r.frame,
							"altitude": r.alt,
							"temperature": r.temp,
							"opacity": opacity,
							"heading": r.heading,
							"type": temptype,
							"marker": r.hasOwnProperty("burst") ? "chute" : "hab"
						}
					});
					radiosondesFilteredTmp.push(r);

				}
				//lieber auf ein intervall beim select ausweichen?
				if(rid==id){
					radiosondeSelectedData = r;
//					radiosondeInfoRefresh(r);
/*
					//liveprediction
//					if(r.hasOwnProperty("burst") && (( typeof predictionTrack === "undefined" ) || (predictionTrack && predictionTrack.metadata.serial == rid && r.seen < 60 && new Date(predictionTrack.metadata.timestamp).getTime() < new Date().getTime()-60000))) {
					if(r.predictiontimestamp && (typeof predictionTrack === "undefined" || r.predictiontimestamp > predictionTrack?.metadata?.timestamp+1)) {
						predictionTrackGroup.clearLayers();
//						(typeof predictionTrack !== "undefined") ? console.log(new Date(predictionTrack.metadata.timestamp).getTime() + " " + new Date(predictionTrack.metadata.timestamp).getTime()-60000) : false;

						fetchController = new AbortController();
						fetch("https://radiosonde.api.sdrmap.org/liveprediction/"+ id +".json", { signal: fetchController.signal })
						.then(function(response) {
							return response.json();
						})
						.then(function(data) {
							globalThis.predictionTrack = data;

							var meta = data.metadata;
							predictionLandingpointmarkerGroup.clearLayers();
							predictionBurstmarkerGroup.clearLayers();


							if(meta.hasOwnProperty("landingpoint")){
								f = {
									"geometry": {
										"type": "Point",
										"coordinates": [meta.landingpoint.lon, meta.landingpoint.lat]
									},
									"type": "Feature",
									"properties": {
										"altitude":meta.landingpoint.alt,
										"fillColor":landingpointToColor(0),
										"zIndexOffset":meta.landingpoint.alt-99990,
										"marker":"landingpoint"
									}
								};
								radiosondeMarker(f).addTo(predictionLandingpointmarkerGroup);
							}
							if(meta.hasOwnProperty("burst") && typeof burstmarker === "undefined" || !map.hasLayer(burstmarker)){
								f = {
									"geometry": {
										"type": "Point",
										"coordinates": [meta.burst.lon, meta.burst.lat]
									},
									"type": "Feature",
									"properties": {
										"altitude":meta.burst.alt,
										"fillColor":"orange",
										"zIndexOffset":meta.burst.alt-99990,
										"marker":"burst"
									}
								};
								radiosondeMarker(f).addTo(predictionBurstmarkerGroup);
							}

							globalThis.predictionTrack.layer = L.geoJSON(data.geojson, {
								style: function(feature) {
									return {
										color: altitudeToColor(mToFt(feature.properties.altitude)),
										zIndexOffset: feature.properties.altitude - 100000,
										opacity: 0.5
									}
								},
								onEachFeature: function(feature, layer) {
									//layer.bindTooltip("Time: " + feature.properties.timestamp + "<br/>Altitude: " + feature.properties.altitude);
									layer.bindTooltip("Time:&emsp;&ensp;&nbsp;" + tsToReadable(feature.properties.timestamp) + "<br>Altitude:&ensp;&nbsp;" + Math.round(feature.properties.altitude) + "m");
									return layer;
								}
							}).addTo(predictionTrackGroup);
						}).catch((error) => {  });
					}
*/
					//focus
					if(vehicleInFocus){
						if(typeof r.lat !== 'undefined' && typeof r.lon !== 'undefined'){
							map.panTo([r.lat, r.lon]);
						}
					}
				}
			}
		);
		//Das könnte in eine interval die nur läuft, wenn die liste auch offen ist, oder zumindest in eine eigene funktion die nur dann läuft
		radiosondeListTableRefresh();
		radiosondesFiltered=radiosondesFilteredTmp;
	});

	//Stations
	var stationsFilteredTmp = [];

	fetch('https://sys.api.sdrmap.org/station.json')
	.then(function(response) { return response.json(); })
	.then(function(stations) {

		stationsGeojson = {
			type: 'FeatureCollection',
			features: []
		}

		stationListTableData=[];

		//Tasks per station
		Object.keys(stations).forEach(
			function station(sid){
				var s = stations[sid];

				//Hier wird gefiltert
				var include = true;

				//bounds
				//if(typeof s.lon === 'undefined' || typeof s.lat === 'undefined' || !map.getBounds().contains(L.latLng(s.lat, s.lon))) {
				if(typeof s.lon === 'undefined' || typeof s.lat === 'undefined') {
					include = false;
				}

				//filterStation
				if(filterStation != 'all'){
					if(filterStation != sid){
						include = false;
					}
				}

				if(include == true){

					if(typeof s.lon !== 'undefined' && typeof s.lat !== 'undefined'){
						stationsGeojson.features.push({
							"geometry": {
								"type": "Point",
								"coordinates": [s.lon, s.lat+0.0001]
							},
							"type": "Feature",
							"properties": {
								"id": sid,
								"timestamp": s.timestamp
							}
						});
					}

					stationsFilteredTmp.push(s);

				}
			}
		);

		//Das könnte in eine interval die nur läuft, wenn die liste auch offen ist, oder zumindest in eine eigene funktion die nur dann läuft
		//stationListTableRefresh();
		stationsFiltered=stationsFilteredTmp;
		//console.log(stationsGeojson);

		if(refreshRealtimeLayers["stations"]) {
			stationLayer.update();
		}
		if(refreshRealtimeLayers["planes"]) planeLayer.update();
		if(refreshRealtimeLayers["ships"]) shipLayer.update();
		if(refreshRealtimeLayers["radiosondes"]) radiosondeLayer.update();
		//map.fire("moveend");
		if(refreshRealtimeLayers["stop"]){
			map.stop();
		}


		stationData();
		if(document.getElementById("navbarDesktop").style.display == "none"){
			if(!mobile){
				sidebarHide();
				mobile=true;
			}
		}

	});

}

setInterval(worker, 1000);

//Realtime layer for planes
planeLayer = L.realtime(function(success, error) {
		success(aircraftsGeojson);
}, {
	//Ever so often
	//interval: 1 * 5000,
	interval: 1 * 1000,
	container: markersCanvas,
	//Generate Plane markers via div and svg
	pointToLayer: function (feature, latlng) {
		return planeMarker(feature).on('click', function onClick(e) {
			L.DomEvent.stopPropagation(e);
			planeSelect(feature.properties.id);
		});
	},
	updateFeature: function(feature, oldLayer) {
		if (!oldLayer){ return; }

		var c = feature.geometry.coordinates;
		oldLayer.setLatLng([c[1], c[0]]);

		oldLayer.setStyle(planeMarker(feature, false));

		if(feature.properties.id == id) {
			if(typeof planeGhostMarker !== 'undefined') {
				planeGhostMarker.remove();
			}

			//console.log(map);
			//if(trackGroup.hasLayer(globalThis.track)){
			if(typeof track !== "undefined" && map.hasLayer(track)) {
				if(typeof vehiclePositionOld === 'undefined'){
					d = Object.values(track._layers)[0]._latlngs[0];
					vehiclePositionOld=[d['lng'], d['lat']];
				}

				track.addData({
					"type":"Feature",
					"properties":{
						"timestamp": Date.now()/1000,
						"altitude":feature.properties.altitude,
						"zIndexOffset":feature.properties.altitude-100000,
						"opacity":feature.properties.opacity,
					},
					"geometry":{
						"type":"LineString",
						"coordinates":[
							c,
							vehiclePositionOld
						]
					}
				});
				vehiclePositionOld=c;
			}
		}
		return oldLayer;
	},
}).addTo(map);

/*******************************/
/*****SCHIFFE******************/
//Realtime layer for planes
shipLayer = L.realtime(function(success, error) {
		success(shipsGeojson);
}, {
	//Ever so often
	interval: 5 * 1000,
	container: markersCanvas,
	//Generate Plane markers via div and svg
	pointToLayer: function (feature, latlng) {
		return shipMarker(feature).on('click', onClick);
		function onClick(e) {
			shipSelect(feature.properties.id);
		}
	},
	updateFeature: function(feature, oldLayer) {
		if (!oldLayer){ return; }
		
		var c = feature.geometry.coordinates;
		
		oldLayer.setStyle(shipMarker(feature, false));
		oldLayer.setLatLng([c[1], c[0]]);
		oldLayer.redraw();

		if(feature.properties.id == id) {
			if(typeof vehicleGhostMarker !== 'undefined') {
				vehicleGhostMarker.remove();
			}

//console.log("shipsel");
			//console.log(track);
			//if(map.hasLayer(track)){
			if(typeof track !== "undefined" && trackGroup.hasLayer(track)) {
				//console.log("shiptrack");
				//console.log(track);
				// Was wollten wir hier tun?
				/*if(typeof Object.values(track._layers)[0] !== 'undefined'){
					d = Object.values(track._layers)[0]._latlngs[0];
				}
				else{
					delete d;
				}
				if(typeof vehiclePositionOld == 'undefined'){
					if(typeof d != 'undefined' && typeof d['lng'] != 'undefined'){
							vehiclePositionOld=[d['lng'], d['lat']];
					}
					else{
						vehiclePositionOld=[c[0], c[1]];
					}
				}*/
				if(typeof vehiclePositionOld === 'undefined'){
					d = Object.values(track._layers)[0]._latlngs[0];
					vehiclePositionOld=[d['lng'], d['lat']];
				}

				/*track.addData({
					"type":"LineString",
					"properties":{
						"timestamp": Date.now()/1000,
						"altitude": 0,
						"zIndexOffset": -100000
					},
					"coordinates":[
						[c[0], c[1]],
						vehiclePositionOld
					]
				});*/
				
				track.addData({
					"type":"Feature",
					"properties":{
						"timestamp": Date.now()/1000,
						"altitude": 0,
						"zIndexOffset": -100000
					},
					"geometry":{
						"type":"LineString",
						"coordinates":[
							[c[0], c[1]],
							vehiclePositionOld
						]
					}
				});
				vehiclePositionOld=c;
			}
		}
		return oldLayer;
	}

}).addTo(map);

/*shipLayer.on('update', function() {
	console.log("update");
});*/

/*******************************/
/*****Radiosondes***************/
//Realtime layer for radiosondes
radiosondeLayer = L.realtime(function(success, error) {
	success(radiosondesGeojson);
}, {
	//Ever so often
	interval: 1 * 1000,
	container: markersCanvas,

	//Generate Plane markers via div and svg
	pointToLayer: function (feature, latlng) {
		return radiosondeMarker(feature).on('click', function onClick(e) {
			radiosondeSelect(feature.properties.id);
		});
	},
	updateFeature: function(feature, oldLayer) {
		if (!oldLayer){ return; }
		var c = feature.geometry.coordinates;
		oldLayer.setLatLng([c[1], c[0]]);
		oldLayer.setStyle(radiosondeMarker(feature, false));

		if(feature.properties.id == id) {
			if(typeof vehicleGhostMarker !== 'undefined') {
				vehicleGhostMarker.remove();
			}

			//console.log(track);
			if(typeof track !== "undefined" && trackGroup.hasLayer(track)) {
				if(typeof vehiclePositionOld === 'undefined'){
					//d = Object.values(track._layers)[0]._latlngs[0];
					d = Object.values(track._layers)[0]._latlngs[0];
					vehiclePositionOld=[d['lng'], d['lat']];
				}
				else 
				//console.log(vehiclePositionOld +" "+c);
				//if(vehiclePositionOld[0] != c[0] || vehiclePositionOld[1] != c[1]) {
				//console.log(feature.properties);
				track.addData({
					"type":"Feature",
					"properties":{
						"timestamp": Date.now()/1000,
						"altitude": feature.properties.altitude,
						"zIndexOffset": mToFt(feature.properties.altitude) - 100000,
						"temperature": feature.properties.temperature
					},
					"geometry":{
						"type":"LineString",
						"coordinates":[
							c,
							vehiclePositionOld
						]
					}
				});

				vehiclePositionOld=c;
				//}
			}
		}
		return oldLayer;
	}
//}).addTo(map);
});

/*******************************/
/*****Stations***************/
//Realtime layer for stations
stationLayer = L.realtime(function(success, error) {
	success(stationsGeojson);
}, {
	//Ever so often
	interval: 60 * 1000,
	container: markersCanvas,
	//Generate Plane markers via div and svg
	pointToLayer: function (feature, latlng) {
		return stationMarker(feature).on('click', function onClick(e) {
			stationSelect(feature.properties.id);
		});
	},
	updateFeature: function(feature, oldLayer) {
		if (!oldLayer){ return; }
		//console.log('radiorefresh');
		//console.log(oldLayer._icon);

		var c = feature.geometry.coordinates;
		oldLayer.setLatLng([c[1], c[0]]);
		oldLayer.setStyle(stationMarker(feature, false));

		return oldLayer;
	}
}).addTo(map);

/*******************************/
/*****Launchsites***************/
//Realtime layer for launchsites
launchsiteLayer = L.realtime(function(success, error) {
	var launchsitesGeojson = {
		type: 'FeatureCollection',
		features: []
	}
	fetch('https://radiosonde.api.sdrmap.org/launchsites.json')
	.then(response => response.json())
	.then(
		function(l){
			Object.keys(l).forEach(
				function(k){
					launchsitesGeojson.features.push({
							"geometry": {
								"type": "Point",
								"coordinates": [l[k]['location']['lon'], l[k]['location']['lat']+0.0001]
							},
							"type": "Feature",
							"properties": {
								"id": k,
								"type": l[k]['type']
							}
						});
				}
			)
			success(launchsitesGeojson);
		}
	)
}, {
	//Ever so often
	interval: 3 * 1000,
	container: markersCanvas,

	pointToLayer: function (feature, latlng) {
		return launchsiteMarker(feature).on('click', function onClick(e) {
			launchsiteSelect(feature.properties.id);
		});
	},
	updateFeature: function(feature, oldLayer) {
		if (!oldLayer){ return; }

		var c = feature.geometry.coordinates;
		oldLayer.setLatLng([c[1], c[0]]);
		oldLayer.setStyle(launchsiteMarker(feature, false));

		return oldLayer;
	}
}).addTo(map);

var scale = L.control.scale().addTo(map);


//When the map loads do stuff to fix tiles and tracks not showing
map.on("load",function() {
	setTimeout(() => {
		map.invalidateSize();
	}, 1);
});

map.setView([51.505, 7.09], 5);

//Get Planeid from url

if(typeof id !== 'undefined') {
	planeSelect(id, true, 9);
}
else if(typeof urlship !== 'undefined'){
	shipSelect(urlship, true, 13);
}
else if(typeof urlradiosonde !== 'undefined'){
	radiosondeSelect(urlradiosonde, true, 9);
}
else if(typeof station !== 'undefined'){
	map.setZoom(10);
	stationSelect(station, true);
}else if(typeof launchsite !== 'undefined'){
	map.setZoom(10);
	launchsiteSelect(launchsite, true);
}else if(typeof lat !== 'undefined' && typeof lon !== 'undefined' && typeof zoom !== 'undefined'){
	sidebarPanelShow('planeList');
	map.setView([lat, lon], zoom);
}
else{
	//planeListShow();
	sidebarPanelShow('planeList');
}

//stationLayerAdd();

filterInit();

//Ende vom Init

/****************************************/
/*****************Show*******************/
/****************************************/

//showPlaneHistoryList
function planeHistoryListShow() {
	//clearSidebar();
	document.getElementById("planeHistoryListShow").className = 'buttonWait';
	planesHistoryTableData = [];
	fetch(urlHistory)
		.then(response => response.json())
		.then(data => planesHistoryTableDataMangle(data))
		.catch(err => console.log(err));

	function planesHistoryTableDataMangle(data){
		Object.entries(data).forEach(function blalaberfasel(fk){
			planesHistoryTableData.push({
				'hex': fk[0],
				'flight': fk[1]['flight'],
				'seen': fk[1]['seen']
			});
		});
		planesHistoryTable.replaceData(planesHistoryTableData);

		document.getElementById("planeHistoryListShow").className = 'buttonActive';
	};
}

//Get vars from url
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

//Set vars in url
function setUrlVars(){
	var urlparameters = "?lat=" + Math.round(map.getBounds().getCenter().lat*10000)/10000 + "&lon=" + Math.round(map.getBounds().getCenter().lng*10000)/10000 + "&zoom=" + map.getZoom();
	
	if(typeof id !== 'undefined' && id != '' && typeof vehicleType !== 'undefined'){
		if(vehicleType == 'plane'){
			var urlparameters = "?plane=" + id;
		}else if(vehicleType == 'ship'){
			var urlparameters = "?ship=" + id;
		}else if(vehicleType == 'radiosonde'){
			var urlparameters = "?radiosonde=" + id;
		}
	}
	
	if(typeof stationSelected !== 'undefined' && stationSelected != ''){
		var urlparameters = "?station=" + stationSelected
	}
	
	if(typeof launchsiteSelected !== 'undefined' && launchsiteSelected != ''){
		var urlparameters = "?launchsite=" + launchsiteSelected
	}
	
	window.history.pushState("","",urlparameters);
}

function menueToggle(){
	if(document.getElementById("menue").style != 'display:grid !important'){
		menueShow();
	}
	else{
		menueHide();
	}
}

function menueShow(){
	document.getElementById("menue").style = 'display:grid !important';
	document.getElementById("mobileClose").style = 'display:block';
}

function menueHide(){
	document.getElementById("menue").style = 'display:none';
}

//stations
function stationData(){
	var temp = [];
	fetch('https://sys.api.sdrmap.org/station.json')
		.then(response => response.json())
		.then(data => stationLayerMangle(data))
		.catch(err => console.log(err));
		function stationLayerMangle(data) {
			Object.entries(data).forEach(function xyz(i){
				//i[1]["seen"]=uptimeToIcon(i[1]["seen"]);
				//console.log("name " + i[1]["name"]);
				i[1]["seen"]=(typeof i[1]["timestamps"] !== "undefined" ? timestampsToIcon(i[1]["timestamps"]) : timestampsToIcon([ ]));
				temp.push(i[1]);
			});
			stationTable.replaceData(temp);
		}
}

//
function darkmodeToggle(){
	if(!darkmode){
		darkmodeOn();
	}
	else{
		darkmodeOff();
	}
}
function darkmodeOn(){
	darkmode = true;
	document.getElementById("map").classList.add('darktile');
	document.getElementById("darkmodeToggle").className = 'buttonActive';
}

function darkmodeOff(){
	darkmode = false;
	document.getElementById("map").classList.remove('darktile');
	document.getElementById("darkmodeToggle").className = 'button';
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
	darkmodeOn();
}


//middledings
function centeroverlayShow(i, jump=false){
	sidebarHide();
	menueHide();
	corneroverlayClose();
	document.getElementById('leftbarDesktop').style.display = 'none';
	document.getElementById(i).style.display = 'block';
	if (jump != false) {
		document.getElementById(jump).scrollIntoView({behaviour: 'smooth'});
	}
}

function centeroverlayClose(){
	//sidebarShow();
	centeroverlays.forEach(
		function(i){
			document.getElementById(i).style.display = 'none';
		}
	);
	document.getElementById('leftbarDesktop').style.display = 'block';
}

function corneroverlayShow(type, message){
	document.getElementById('corneroverlay').style.display = 'block';
	document.getElementById("corneroverlayHeadline").className = 'corneroverlayHeadline' + ucFirst(type);
	document.getElementById("corneroverlayContent").className = 'corneroverlayContent' + ucFirst(type);
	document.getElementById("corneroverlayContent").innerHTML = message;
}

function corneroverlayClose(){
	document.getElementById('corneroverlay').style.display = 'none';
	document.getElementById("corneroverlayHeadline").className = '';
	document.getElementById("corneroverlayContent").className = '';
	document.getElementById("corneroverlayContent").innerHTML = 'n/a';
}

// refresh layers after filtering, zoomend and moveend, etc
function layersRefresh(){
	planeLayer.stop();
	planeLayer.start();
	planeLayer.update();

	shipLayer.stop();
	shipLayer.start();
	shipLayer.update();

	radiosondeLayer.stop();
	radiosondeLayer.start();
	radiosondeLayer.update(); //das wirkt hier noch nicht, da der worker nnoch nicht die aktuellen daten mit den neuen bounds bereitgestellt hat 

	stationLayer.stop();
	stationLayer.start();
	stationLayer.update(); //das wirkt hier noch nicht, da der worker nnoch nicht die aktuellen daten mit den neuen bounds bereitgestellt hat 

}

//Attribution
function attribution(){
	var output="<table><thead><tr><td>Marker</td><td>License</td><td>Origin</td></thead><tbody>";
	Object.values(markers).forEach(
		function(i){
			Object.entries(i).forEach(
				function(ii){
					output += "<tr><td>" + ii[0] + "</td><td>" + ii[1].license + "</td><td>" + ii[1].origin + "</td></tr>";
				}
			)
		}
	)
	output += "</tbody></table>";
	document.getElementById("attributionMarkers").innerHTML = output;
}
attribution();
//corneroverlayShow('warn', '<b>adsb.chaos-consulting.de is now sdrmap.org!</b><br/> This is sdrmap Release 4.0 (released 19/12/24)<br/><a style="text-decoration:underline; cursor:pointer" onclick="centeroverlayShow(\'about\',\'Changelog\')">Check out the new features!</a>');
