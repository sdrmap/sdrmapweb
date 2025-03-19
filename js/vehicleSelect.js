//planeSelect
function planeSelect(pid, focus=false, zoom=false) {
	vehicleDeSelect('plane');
	id=pid;

	vehicleType='plane';
	clearSidebar();
	vehiclePositionOld;
	document.getElementById("planeContent").style = "display:block";
	sidebarShow();
	setUrlVars();

	planeLayer.update();
	//window.history.pushState("","","?plane=" + id);
	//history
	cellRefresh("planeId", id);
	var plane;
	fetch(urlBase + '/data/planeHistory.php?plane=' + id)
		.then(function(response) {
			return response.json();
	})
	.then(function(data) {
		plane = data;
		if(true){
			planeInfoRefresh(data);
			if(focus){
				vehicleFocusOn();
			}
			if(zoom != false){
				map.setZoom(zoom);
			}
		}
	});

	document.getElementById("exportTrackGeojson").href = urlBase + '/data/export.php?plane=' + id;

			var newTimestamp=0;
			var newAltitude=0;

	//Load history from server
	if(typeof fetchController === 'object') {
		fetchController.abort();
	}
	fetchController = new AbortController();
	fetch(urlBase + '/track/?plane=' + id, { signal: fetchController.signal })
		.then(function(response) {
			return response.json();
	})
	.then(function(data) {
		globalThis.track = L.geoJSON(data, {
			style: function(feature) {
				return {
					color: altitudeToColor(feature.properties.altitude),
					zIndexOffset: feature.properties.altitude - 100000,
					dashArray: feature.properties.dashArray,
					opacity: feature.properties.opacity
				};
			},
			onEachFeature: function (feature, layer){
				var timestampTo = new Date(Math.floor(newTimestamp)*1000).toUTCString();
				var timestampFrom = new Date(Math.floor(feature.properties.timestamp)*1000).toUTCString();
				var timestampDiff = (newTimestamp - feature.properties.timestamp);
//				console.log(timestampDiff);//NaN
				var altitudeNewM = Math.round(newAltitude/3.28269);
				var altitudeM = Math.round(feature.properties.altitude/3.28269);
				var altitudeDiff = newAltitude-feature.properties.altitude;
				var altitudeDiffM = Math.round(altitudeDiff/3.28269);
				var altitudeRate = Math.round(altitudeDiff/timestampDiff*60);
				var altitudeRateM = Math.round(altitudeRate/3.28269);
				layer.bindTooltip("From:&emsp;&ensp;&nbsp;" + timestampFrom + "<br>To:&emsp;&emsp;&emsp;" + timestampTo + "<br>Altitude:&ensp;&nbsp;" + altitudeM + "m / " + feature.properties.altitude + "ft -> " + altitudeNewM + "m / " + newAltitude + "ft (" + altitudeDiffM + "m / " + altitudeDiff + "ft)<br>Rate:&emsp;&emsp;" + altitudeRateM + "m/min / " + altitudeRate + "ft/min");
				//layer.setStyle({renderer: vehicleRenderer});
				//layer.bindTooltip("Test");
				newTimestamp=feature.properties.timestamp;
				newAltitude=feature.properties.altitude;
			}
//		}).addTo(map);
		}).addTo(trackGroup);
	}).then(function() {
		//History stuff for a non live plane
		if(!(id in aircrafts)){
			d = Object.values(track._layers)[0]._latlngs[0];
			var fakeFeature = { properties: { model: plane.model, track: 0, opacity: 1, type: "his" }};
			planeGhostMarker = L.marker(d, {
				icon: planeIcon(fakeFeature)
			}).addTo(track);
		}
		//console.log(map);
	}).catch((error) => { });
}

//shipSelect
function shipSelect(pid, focus=false, zoom=false) {
	vehicleDeSelect('ship');
	id=pid;
	vehicleType='ship';
	clearSidebar();
	document.getElementById("shipContent").style = "display:block";
	sidebarShow();
	shipLayer.update();
	setUrlVars();
	//planeSpeedOld;
	//window.history.pushState("","","?ship=" + id);
	//history
	cellRefresh("shipId", id);
	//Load history from server
	if(typeof fetchController === 'object') {
		fetchController.abort();
	}
	fetchController = new AbortController();
	fetch(urlBase + '/data/shipTrack.php?ship=' + id, { signal: fetchController.signal })
		.then(function(response) {
			return response.json();
	})
	.then(function(data) {
		//If there is a position in it add it to the map
		globalThis.track = L.geoJSON(data, {
			style: function(feature) {
				return {
					color: '#3388ff',
					zIndexOffset: -100000,
					dashArray: feature.properties.dashArray
				};
			},
			onEachFeature: function (feature, layer){
				layer.bindTooltip(new Date(Math.floor(feature.properties.timestamp)*1000).toUTCString() + "<br>");
			}
		}).addTo(trackGroup);
	}).catch((error) => { });

	if(focus){
		vehicleFocusOn();
	}
	if(zoom != false){
		map.setZoom(zoom);
	}

document.getElementById("exportShipTrackGeojson").href = urlBase + '/data/export.php?ship=' + id;

}

//radiosondeSelect
function radiosondeSelect(rid, focus=false, zoom=false) {
	vehicleDeSelect('radiosonde');
	id=rid;
	vehicleType='radiosonde';
	clearSidebar();
	document.getElementById("radiosondeContent").style = "display:block";
	sidebarShow();
	radiosondeLayer.update();
	setUrlVars();
	//window.history.pushState("","","?radiosonde=" + rid);

	var newTimestamp=0;
	var newAltitude=0;
	radiosondeSelectedAltMax=0

	//Load history from server
	if(typeof fetchController === 'object') {
		fetchController.abort();
	}
	fetchController = new AbortController();
//	fetch(urlBase + '/data/radiosondeTrack.php?order=desc&radiosonde=' + rid, { signal: fetchController.signal })
	fetch('https://radiosonde.api.sdrmap.org/history/' + rid + '.json', { signal: fetchController.signal })
		.then(function(response) {
			return response.json();
	})
	.then(function(data) {
		//console.log('radiorload');
		layersRefresh();
		metadata=data.metadata;
		data=data.geojson;
		//
//		console.log('dinge');
		radiosondeSelectedData = metadata;
		
		//
//		cellRefresh("radiosondeVertrateMinMetric", metadata.min_vel_v, 'm/s', 2);
//		cellRefresh("radiosondeVertrateMaxMetric", metadata.max_vel_v, 'm/s', 2);
/*		radiosondeSelectedData = {
			launchsite: {
				name: metadata.launchsite
			}
		};
		//radiosondeSelectedData.launchsite.operator = metadata.operator;
		radiosondeSelectedData.vendor = metadata.type;
		radiosondeSelectedData.type = metadata.vendor;
		console.log(radiosondeSelectedData);*/
		radiosondeInterval = setInterval(radiosondeInfoRefresh, 1000);
		//If there is a position in it add it to the map
		globalThis.track = L.geoJSON(data, {
			style: function(feature) {
				return {
					color: altitudeToColor(mToFt(feature.properties.altitude)),
					zIndexOffset: mToFt(feature.properties.altitude) - 100000,
					dashArray: feature.properties.dashArray
				};
			},
			onEachFeature: function (feature, layer){
				var timestampTo = new Date(Math.floor(newTimestamp)*1000).toUTCString();
				var timestampFrom = new Date(Math.floor(feature.properties.timestamp)*1000).toUTCString();
				var timestampDiff = (timestampTo - timestampFrom);
				var altitudeNewM = Math.round(newAltitude);
				var altitudeM = Math.round(feature.properties.altitude);
				var altitudeDiff = Math.round(feature.properties.altitude-newAltitude);
				var altitudeDiffM = Math.round(altitudeDiff);
				var altitudeRate = Math.round(altitudeDiff/timestampDiff*1000)/1000;
				var altitudeRateM = Math.round(altitudeRate*1000)/1000
				layer.bindTooltip("From:&emsp;&ensp;&nbsp;" + timestampFrom + "<br>To:&emsp;&emsp;&emsp;" + timestampTo + "<br>Altitude:&ensp;&nbsp;" + Math.round(feature.properties.altitude*100)/100 + "m -> " + Math.round(newAltitude) + "m (" + altitudeDiffM + "m)<br>Temp:&emsp;&ensp;&nbsp;" + feature.properties.temp + "°C");
				newTimestamp=feature.properties.timestamp;
				newAltitude=feature.properties.altitude;

				if(radiosondeSelectedAltMax < altitudeM){
					radiosondeSelectedAltMax=altitudeM;
				}
			}
		}).addTo(trackGroup);
	}).catch((error) => { console.log(error) });
	
	if(focus){
		vehicleFocusOn();
	}
	if(zoom != false){
		map.setZoom(zoom);
	}

	document.getElementById("exportRadiosondeTrackGeojson").href = urlBase + '/data/export.php?radiosonde=' + id;

}

//Die beiden Funktionen müssen weg weil durch vehicleDeSelect ersetzt
//shipDeSelect
function shipDeSelect() {
	vehicleDeSelect();
	shipListShow();
}

//planeDeSelect
function planeDeSelect() {
	vehicleDeSelect();
	planeListShow();
}

//vehicleDeSelect
function vehicleDeSelect() {
	if(sidebarLock){
		//centeroverlayClose('about');
		//centeroverlayClose('stationGraphsBig');
		centeroverlayClose();
	}
	// workaround um das delay beim marker redraw zu minimieren
	map.stop();
	trackGroup.clearLayers();
	predictionTrackGroup.clearLayers();
	predictionTrack = undefined;
	recentTrackGroup.clearLayers();
	recentTrack = undefined;

	if(typeof burstmarker !== 'undefined') {
		burstmarker.remove();
	}

	//nur wenn überhaupt etwas selected ist
	if(id!=undefined && id!='undefined' && sidebarLock==false){
		vehicleSpeedOld;
		vehiclePositionOld=undefined;
		planeAltitudeOld;
		planeDirectionOld;
		removeTrack();
		
		if(vehicleType=='ship'){
			sidebarPanelShow('shipList');
			//shipLayer.update();
		}
		else if(vehicleType=='radiosonde'){
			clearInterval(radiosondeInterval);
			predictionLandingpointmarkerGroup.clearLayers();
			predictionBurstmarkerGroup.clearLayers();
			sidebarPanelShow('radiosondeList');
			//radiosondeLayer.update();
		}
		else{
			sidebarPanelShow('planeList');
			//planeLayer.update();
		}
		id=undefined;
	}
	else if(stationSelected!=""){
		stationDeSelect();
		sidebarPanelShow('stationList');
	}
	if(launchsiteSelected!="" && typeof launchsiteSelected !== "undefined"){
		predictionLandingpointmarkerGroup.clearLayers();
		predictionBurstmarkerGroup.clearLayers();
		recentLandingpointmarkerGroup.clearLayers();
		recentBurstmarkerGroup.clearLayers();
		launchsiteDeSelect();
		sidebarPanelShow('launchsiteList');
	}
	setUrlVars();
}

//Focus tracking plane
//vehicleFocusToggle
function vehicleFocusToggle() {
	if(!vehicleInFocus){
		vehicleFocusOn();
	}
	else{
		vehicleFocusOff();
	}
}

//vehicleFocusOn
function vehicleFocusOn(){
	vehicleInFocus = true;
	document.getElementById("vehicleFocus").style = "color:orange;"
	document.getElementById("vehicleFocus2").style = "color:orange;"
	document.getElementById("vehicleFocusRadiosonde").style = "color:orange;"
}

//vehicleFocusOff
function vehicleFocusOff(){
	vehicleInFocus = false;
	document.getElementById("vehicleFocus").style = "color:white;"
	document.getElementById("vehicleFocus2").style = "color:white;"
	document.getElementById("vehicleFocusRadiosonde").style = "color:white;"
}

//removeTrack
/*function removeTrack(){
	if(map.hasLayer(track)) {
		map.removeLayer(track);
	}
}*/
function removeTrack(){
	trackGroup.clearLayers();
}
