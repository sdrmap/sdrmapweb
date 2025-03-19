//launchsite stuff
//launchsiteSelect

var launchsiteInterval;
var launchsiteRecentSondes;

function launchsiteSelect(name, focus=false) {
	vehicleDeSelect();
	clearSidebar();
	//removeTrack();
	sidebarShow();
	launchsiteSelected = name;
	layersRefresh();
	id='';
	setUrlVars();
	document.getElementById("launchsiteContent").style = "display:block";
	document.getElementById("launchsiteName").innerHTML = name;
	//document.getElementById("launchsiteInfoTableFilter").setAttribute( "onclick", "filterStationToggle('" + name + "')");
	//document.getElementById("launchsiteInfoTableHeatmap").setAttribute( "onclick", "heatmapStationToggle('" + name + "')");
	//window.history.pushState("","","?launchsite=" + name);
	document.getElementById("launchsiteLink").innerHTML = '<a href="?launchsite=' + name + '">' + urlBase + '/?launchsite=' + name + '</a>';

	//if(!focus){
		launchsiteSidebarRefresh();
	//}
	launchsiteInterval = setInterval(launchsiteSidebarRefresh, 5000);
}

//launchsiteDeSelect
function launchsiteDeSelect(){
	if(launchsiteSelected != '') {
		sidebarPanelShow('launchsiteList');
	}
	launchsiteSelected = '';
	predictionLandingpointmarkerGroup.clearLayers();
	predictionBurstmarkerGroup.clearLayers();
	predictionTrackGroup.clearLayers();
	clearInterval(launchsiteInterval);
	setUrlVars();
}

//sidebarRefresh
function launchsiteSidebarRefresh() {

	document.getElementById("launchsiteInfoRefreshIndicator").style.display='';

	fetch('https://radiosonde.api.sdrmap.org/launchsites.json')
	.then(response => response.json())
	.then(
		function(data){
			const j = data[launchsiteSelected];
			cellRefresh("launchsiteOperator", j.operator);
			
			//freqs
			document.getElementById("launchsiteFrequencies").innerHTML='';

			//Object.entries(j.frequencies).sort(([,a],[,b]) => a-b);
			//Object.values(j.frequencies).forEach(
			Object.entries(j.frequencies).sort(([,a],[,b]) => a-b).forEach(
				function launchsiteFrequencies(i){
					document.getElementById("launchsiteFrequencies").innerHTML+='<span class="minitag">' + i[1] + 'MHz</span>';
				}
			)
			
			//active sondes
			document.getElementById("launchsiteActiveSondesTableBody").innerHTML='';
			//shlechte datenquelle weil bounds gefiltert

			var launchsiteActiveSondesCounter=0;
			Object.keys(radiosondes).forEach(
				function sondie(k){
					s=radiosondes[k];
					if(s.launchsite?.name == launchsiteSelected){
						document.getElementById("launchsiteActiveSondesTableBody").innerHTML+='<tr onclick="radiosondeSelect(\''+ k +'\')"><td>' + k + '</td><td>' + s.type + '</td><td>' + Math.round(s.alt) + 'm</td><td>' + secondsToReadable(timeFromNow(s.timestamp)) + '</td></tr>';
						//document.getElementById("launchsiteSondesTableBody").insertRow;
						launchsiteActiveSondesCounter++;
					}
				}
			)

			document.getElementById("launchsiteActiveSondesCount").innerHTML=launchsiteActiveSondesCounter;
			var launchsiteRecentSondesCounter=0;

			//recent sondes
			fetch('https://radiosonde.api.sdrmap.org/history.json')
				.then(function(response){
					return response.json();
				})
			.then(function(recentRadiosondes){
				document.getElementById("launchsiteRecentSondesTableBody").innerHTML='';
				launchsiteRecentSondes = new Array();
				Object.entries(recentRadiosondes).sort(([,a],[,b]) => b.timestamp-a.timestamp).forEach(
					function sondie(k){
						s=k[1];
						if(s['launchsite']==launchsiteSelected && !Object.keys(radiosondes).includes(k[0])){
							document.getElementById("launchsiteRecentSondesTableBody").innerHTML+='<tr style="color:' + landingpointToColor(launchsiteRecentSondesCounter) + '" onclick="radiosondeSelect(\''+ k[0] +'\')"><td>' + k[0] + '</td><td>' + tsToReadable(s.timestamp) + '</td><td>' + secondsToReadable(timeFromNow(s.timestamp)) + '</td></tr>';
							launchsiteRecentSondes[launchsiteRecentSondesCounter]=new Array();
							launchsiteRecentSondes[launchsiteRecentSondesCounter]['id']=k[0];
							launchsiteRecentSondesCounter++;
						}
					}
				)
				cellRefresh("launchsiteRecentSondesCount", launchsiteRecentSondesCounter);
			})

			//upcoming sondes
			document.getElementById("launchsiteUpcomingSondesTableBody").innerHTML=''
			if(typeof j.upcoming_sondes !== 'undefined'){
				launchsiteUpcomingSondes = j.upcoming_sondes;
				Object.keys(j.upcoming_sondes).forEach(
					function sondie(k){
//						console.log("nowts:" + parseInt(Date.now()/1000) + " #tsstart" + parseInt(j.upcoming_sondes[k]) + " #tfn" + timeFromNow(j.upcoming_sondes[k]));
						document.getElementById("launchsiteUpcomingSondesTableBody").innerHTML+='<tr id="launchsiteUpcomingSondesTr_' + k + '" style="color:' + landingpointToColor(k) + '" onclick="prediction(' + j.upcoming_sondes[k] + ')"><td>' + k + '</td><td>' + tsToReadable(j.upcoming_sondes[k]) + '</td><td>' + secondsToReadable(timeFromNow(j.upcoming_sondes[k])) + '</td></tr>'
					}
				);
				cellRefresh("launchsiteUpcomingSondesCount", Object.keys(j.upcoming_sondes).length);
			}
			else{
				cellRefresh("launchsiteUpcomingSondesCount", 0);
			}
			cellRefresh("launchsiteUpcomingSondesDatasetTimestamp", tsToReadable(j.prediction_dataset));

			//schedule
			var temptable = '';
			var nextflight = false;
			var tomorrow = undefined;
			if(typeof j.starts !== 'undefined'){
				var today = new Date().getUTCDay();
				const todaytime = new Date().getUTCHours();
				
				Object.keys(j.starts).forEach(
					function launchsiteStarts(i){
						temptable+='<tr><td>' + numToWeekday(i) + '</td>';
						Object.values(j['starts'][i]).forEach(
							function launchsiteStarts(s){
								//ist der start über den wir hier gerade sprechen in der zukunft?
								//tag
								nextflight=false;
								if(i == today){
									var splitted = s.split(":");
									if(todaytime < splitted[0]){
										nextflight = true;
										//console.log();
									}
									else{
										if(todaytime == splitted[0] && new Date().getUTCMinutes() < splitted[1]){
											nextflight = true;
										}
									}
								}
								if(nextflight){
									temptable+='<td class="td_highlighted">' + s + '</td>';
								} else {
									temptable+='<td>' + s + '</td>';
								}
							}
						)
						if(i == today && nextflight==false){
							today = today + 1 % 6;
						}
						var rest = 5 - Object.keys(j['starts'][i]).length;
						for(i=0; i < rest; i++){
							temptable+='<td></td>';
						}
						temptable+='</tr>';
					}
				)
			}
			document.getElementById("launchsiteScheduleTableBody").innerHTML='';
			document.getElementById("launchsiteScheduleTableBody").innerHTML=temptable;
			setTimeout(function(){document.getElementById("launchsiteInfoRefreshIndicator").style.display='none'}, 1000);
		}
	)
};

//recent
function recent(id=null){
	recentLandingpointmarkerGroup.clearLayers();
	recentBurstmarkerGroup.clearLayers();
	recentTrackGroup.clearLayers();
	predictionLandingpointmarkerGroup.clearLayers();
	predictionBurstmarkerGroup.clearLayers();
	predictionTrackGroup.clearLayers();

	if(id != null){
		fetchRecent(id);
	}
	else{
		//console.log(launchsiteUpcomingSondes);
		Object.entries(launchsiteRecentSondes).forEach(
			function sondie(k) {
				fetchRecent(k[1]['id'], landingpointToColor(k[0]));
//				console.log(k);
			}
		);
	}
}

function fetchRecent(id, color="grey") {
	fetch('https://radiosonde.api.sdrmap.org/history/' + id + '.json')
	.then(response => response.json())
	.then(
		function(data){
			//console.log(data);
			var meta = data.metadata;
			var geo = data.geojson;
			if(meta.hasOwnProperty("burst")){
				feature = {
					"geometry": {
						"type": "Point",
						"coordinates": [meta.burst.lon, meta.burst.lat]
					},
					"type": "Feature",
					"properties": {
						"altitude":meta.burst.alt,
						"fillColor":color,
						"zIndexOffset":meta.burst.alt-99990,
						"marker":"burst"
					}
				};
				radiosondeMarker(feature).on('click', function(e) { L.DomEvent.stopPropagation(e); radiosondeSelect(id) }).addTo(recentBurstmarkerGroup);
			}
			L.geoJSON(geo, {
				style: function(feature) {
					return {
						color: altitudeToColor(mToFt(feature.properties.altitude)),
						zIndexOffset: feature.properties.altitude - 100000,
//						opacity: 0.5
					}
				}
			}).on('click', function(e) { L.DomEvent.stopPropagation(e); radiosondeSelect(id) })
			.addTo(recentTrackGroup);
		}
	);
	fetch('https://radiosonde.api.sdrmap.org/liveprediction/' + id + '.json')
	.then(response => response.json())
	.then(
		function(data){
			var meta = data.metadata;
			var geo = data.geojson;
			if(meta.hasOwnProperty("landingpoint")){
				feature = {
					"geometry": {
						"type": "Point",
						"coordinates": [meta.landingpoint.lon, meta.landingpoint.lat]
					},
					"type": "Feature",
					"properties": {
						"altitude":meta.landingpoint.alt,
						"fillColor":color,
						"zIndexOffset":meta.landingpoint.alt-99990,
						"marker":"landingpoint"
					}
				}
			}
			radiosondeMarker(feature).on('click', function(e) { L.DomEvent.stopPropagation(e); radiosondeSelect(id) }).addTo(recentLandingpointmarkerGroup);
			L.geoJSON(geo, {
				style: function(feature) {
					return {
						color: altitudeToColor(mToFt(feature.properties.altitude)),
						zIndexOffset: feature.properties.altitude - 100000,
						opacity: 0.5
					}
				}
			}).on('click', function(e) { L.DomEvent.stopPropagation(e); radiosondeSelect(id) }).addTo(predictionTrackGroup);
		}
	);
}

//prediction
function prediction(ts=null){
	recentLandingpointmarkerGroup.clearLayers();
	recentBurstmarkerGroup.clearLayers();
	recentTrackGroup.clearLayers();
	predictionLandingpointmarkerGroup.clearLayers();
	predictionBurstmarkerGroup.clearLayers();
	predictionTrackGroup.clearLayers();

	if(ts != null){
		fetchPrediction(ts);
	}
	else{
		//console.log(launchsiteUpcomingSondes);
		Object.entries(launchsiteUpcomingSondes).forEach(
			function sondie(k) {
				fetchPrediction(k[1], landingpointToColor(k[0]));
			}
		);
	}
}

function fetchPrediction(ts, color="grey") {
	fetch('https://radiosonde.api.sdrmap.org/prediction/' + launchsiteSelected + '_' + ts + '.json')
	.then(response => response.json())
	.then(
		function(data){
			var meta = data.metadata;
			var geo = data.geojson;
			if(meta.hasOwnProperty("landingpoint")){
				feature = {
					"geometry": {
						"type": "Point",
						"coordinates": [meta.landingpoint.lon, meta.landingpoint.lat]
					},
					"type": "Feature",
					"properties": {
						"altitude":meta.landingpoint.alt,
						"fillColor":color,
						"zIndexOffset":meta.landingpoint.alt-99990,
						"marker":"landingpoint"
					}
				};
				radiosondeMarker(feature).addTo(predictionLandingpointmarkerGroup);
			}
			if(meta.hasOwnProperty("burst")){
				feature = {
					"geometry": {
						"type": "Point",
						"coordinates": [meta.burst.lon, meta.burst.lat]
					},
					"type": "Feature",
					"properties": {
						"altitude":meta.burst.alt,
						"fillColor":color,
						"zIndexOffset":meta.burst.alt-99990,
						"marker":"burst"
					}
				};
				radiosondeMarker(feature).addTo(predictionBurstmarkerGroup);
			}
			L.geoJSON(geo, {
				style: function(feature) {
					return {
						color: altitudeToColor(mToFt(feature.properties.altitude)),
						zIndexOffset: feature.properties.altitude - 100000,
						opacity: 0.5
					}
				}
			}).addTo(predictionTrackGroup);
		}
	)
}

//aktuell wird die funktion nur beim aufruf der launchsite list aufgerufen, es fehlt noch der zyklische refresh
//launchsiteListRefresh
function launchsiteListRefresh(){
	if(!launchsiteListInterval){
//		console.log('inderif');
		launchsiteListInterval = setInterval(launchsiteListRefresh, 5000);
	}
	document.getElementById("launchsiteListRefreshIndicator").style.display='';
	fetch('https://radiosonde.api.sdrmap.org/launchsites.json')
	.then(response => response.json())
	.then(
		function(data){
			//console.log(data);
			document.getElementById("launchsiteListTableBody").innerHTML='';
			Object.keys(data).forEach(function nnn(l){
				
				var launchsiteActiveSondesCounter=0;
				Object.keys(radiosondes).forEach(
					function sondie(k){
						s=radiosondes[k];
						if(s.launchsite?.name == l){
							launchsiteActiveSondesCounter++;
						}
					}
				)
				
				var tr = '<tr ';
				if(typeof data[l]['type'] !== 'undefined'){
					tr += 'style="color:' + typeToColor(0,data[l]['type']) + '"';
				}
				tr += 'onclick="launchsiteSelect(\'' + l + '\')"><td>' + l + '</td>';
				if(typeof data[l]['upcoming_sondes'] !== 'undefined' && typeof data[l]['upcoming_sondes'][0] !== 'undefined'){
					tr += '<td>' + secondsToReadable(timeFromNow(data[l]['upcoming_sondes'][0])) + '</td>';
				}
				else{
					tr += '<td></td>';
				}
				tr += '<td>' + launchsiteActiveSondesCounter + '</td></tr>';
				//document.getElementById("launchsiteListTableBody").innerHTML+='<tr onclick="launchsiteSelect(\'' + l + '\')" style="color:' + typeToColor(data[l]['type']) + '"><td>' + l + '</td></tr>';
				document.getElementById("launchsiteListTableBody").innerHTML+=tr;
			})
			setTimeout(function(){document.getElementById("launchsiteListRefreshIndicator").style.display='none'}, 1000);
		}
	);
}
