//Station stuff
//stationSelect

var stationInterval;

function stationSelect(name, focus=false) {
	vehicleDeSelect();
	clearSidebar();
//	removeTrack();
	stationMlatPeersTableData =[];
	sidebarShow();
	stationSelected = name;
	layersRefresh();
	id='';
	setUrlVars();
	document.getElementById("stationContent").style = "display:block";
	document.getElementById("stationName").innerHTML = name;
	document.getElementById("stationInfoTableFilter").setAttribute( "onclick", "filterStationToggle('" + name + "')");
	document.getElementById("stationInfoTableHeatmap").setAttribute( "onclick", "heatmapStationToggle('" + name + "')");
	//window.history.pushState("","","?station=" + name);
	document.getElementById("stationLink").innerHTML = '<a href="?station=' + name + '">' + urlBase + '/?station=' + name + '</a>';

	if(!focus){
		stationSidebarRefresh();
	}
	stationInterval = setInterval(stationSidebarRefresh, 5000);
}

//stationDeSelect
function stationDeSelect(){
	if(stationSelected == filterStation){
		heatmapLayerRemove();
	}
	stationSelected = '';
	clearInterval(stationInterval);
	sidebarPanelShow('stationList');
	setUrlVars();
}

//sidebarRefresh
function stationSidebarRefresh() {

	document.getElementById("stationInfoRefreshIndicator").style.display='';

	//hier die mangle mit legacy geraffel antreten, sollte später mal irgendwie anders
	fetch(urlBase + '/data/station.json')
	.then(response => response.json())
	.then(data => stationMangle(data))
	.catch(err => console.log(err));

	stationPlanesTableData = [];
	stationPlanesLat = 0;
	stationPlanesMlat = 0;
	stationPlanesNolat = 0;
	stationPlanesUnique = 0;
	stationPlanesRssiMin = 99;
	stationPlanesRssiSum = 0;
	stationPlanesRssiMax = -99;

	stationShipsTableData = [];
	stationShipsLat = 0;
	stationShipsNolat = 0;
	stationShipsUnique = 0;
	stationShipsRssiMin = 99;
	stationShipsRssiSum = 0;
	stationShipsRssiMax = -99;

	stationRadiosondesTableData = [];
	//stationRadiosondesLat = 0;
	//stationRadiosondesTotal = 0
	//stationRadiosondesUnique = 0;

	//aircrafts
	Object.values(aircrafts).forEach(function planeStation(f) {
		//selected station
		if(typeof stationSelected !== undefined && stationSelected !=''){
			if(stationSelected in f.station){
				stationPlanesTableData.push({
					'hex': f.hex,
					'registration': f.registration,
					'flight': f.flight,
					'altitude': ftToM(f.altitude),
					'type': f.type,
					'rssix': f.station[ stationSelected ]['rssix'],
					'dist': f.station[ stationSelected ]['dist'],
					'fix': fixToIcon(f.fix)
				});

				//zaehlen
				if(f.fix == "true"){
					stationPlanesLat++;
				}
				if(f.fix == "mlat"){
					stationPlanesMlat++;
				}
				if(f.fix == "false"){
					stationPlanesNolat++;
				}
				if(Object.keys(f.station).length==1){
					stationPlanesUnique++;
				}

				//rssi
				if(f.station[ stationSelected ]['rssix'] < stationPlanesRssiMin){
					stationPlanesRssiMin = f.station[ stationSelected ]['rssix'];
				}
				if(f.station[ stationSelected ]['rssix'] > stationPlanesRssiMax){
					stationPlanesRssiMax = f.station[ stationSelected ]['rssix'];
				}
				if(typeof(parseFloat(f.station[ stationSelected ]['rssix'])) === "number"){
					stationPlanesRssiSum = stationPlanesRssiSum + parseFloat(f.station[ stationSelected ]['rssix']);
				}
			}
		}
	});

	stationPlanesTotal = stationPlanesLat + stationPlanesMlat + stationPlanesNolat;
	stationPlanesRssiAvg = stationPlanesRssiSum / stationPlanesTotal;
	
	
	stationPlanesTableData.sort((a,b) => {
		return b.rssix - a.rssix;
	});
	document.getElementById("stationPlanesTableBody").innerHTML='';
	Object.values(stationPlanesTableData).slice(0, 10).forEach(
		function stationPlanes(i){
			if(i.registration == undefined){
				i.registration='';
			}
			if(i.dist == undefined){
				dist='';
			}
			else{
				dist=i.dist + 'km';
			}

			document.getElementById("stationPlanesTableBody").innerHTML+='<tr style="color:' + typeToColor('white', i.type) + ' !important;" onclick="planeSelect(\''+ i.hex +'\')"><td class="topIcao">' + i.hex + '</td><td class="topRegistration">' + i.registration + '</td><td class="topFlight">' + i.flight + '</td><td class="topRssi">' + i.rssix + '</td><td class="topDist">' + dist + '</td><td class="topFix">' + i.fix + '</td></tr>';
		}
	);

	//range
	//document.getElementById("stationRangePlane").innerHTML='<i class="fa-solid fa-plane"></i> n/a';
//	console.log('clear');

	//
	stationTableDataFiltered = [];
	Object.values(stationPlanesTableData).forEach(
		function iwas(i){
			if(i.dist !== undefined){
				stationTableDataFiltered.push(
					i
				);
			}
		}
	);

	//min
	stationTableDataFiltered.sort((a,b) => {
		return a.dist - b.dist;
	});
	/*Object.values(stationTableDataFiltered).slice(0, 1).forEach(
		function stationRangePlane(i){
			if(typeof(i.dist) === "number"){
				document.getElementById("stationRangePlane").innerHTML='<i class="fa-solid fa-plane"></i> ' + mToKm(i.dist);
			}
		}
	);*/

	//avg
	var rangesum = 0;
	var rangecount = 0;
	Object.values(stationTableDataFiltered).forEach(
		function stationRangePlane(i){
			if(typeof(i.dist) == 'number'){
				rangesum = rangesum + i.dist;
				rangecount = rangecount + 1;
			}
		}
	);
	var rangeavg = rangesum / rangecount;
	/*if(rangeavg > 0){
		document.getElementById("stationRangePlane").innerHTML+='/' + mToKm(rangeavg);
		//console.log('range_avg: ' + rangeavg);
	}*/

	//max
	stationTableDataFiltered.sort((a,b) => {
		return b.dist - a.dist;
	});
	/*Object.values(stationTableDataFiltered).slice(0, 1).forEach(
		function stationRangePlane(i){
				if(typeof(i.dist) == 'number'){
					document.getElementById("stationRangePlane").innerHTML+='/' + mToKm(i.dist) + 'km';
					//console.log('range_max: ' + i.dist);
				}
		}
	);*/

	//ships
	Object.values(ships).forEach(function shipStation(s) {
		//selected station
		if(typeof stationSelected !== undefined && stationSelected !=''){
			if(stationSelected in s.station){
				stationShipsTableData.push({
					'mmsi': s.mmsi,
					'shipname': s.shipname,
					'callsign': s.callsign,
					'type': s.type,
					'rssi': s.station[ stationSelected ]['rssi'],
					'dist': s.station[ stationSelected ]['dist'],
					'fix': fixToIcon(s.fix)
				});

				//zaehlen
				//if(typeof s.lat !== undefined && s.lat !='' && typeof s.lon !== undefined && s.lon !=''){
				//console.log("fix" + s.fix);
				if(s.fix=='true'){
					stationShipsLat++;
					//console.log('t');
				}
				else{
					stationShipsNolat++;
					//console.log('false');
				}

				if(Object.keys(s.station).length==1){
					stationShipsUnique++;
				}

				//rssi
				if(s.station[ stationSelected ]['rssi'] < stationShipsRssiMin && s.station[ stationSelected ]['rssi'] != null){
					stationShipsRssiMin = s.station[ stationSelected ]['rssi'];
				}
				if(s.station[ stationSelected ]['rssi'] > stationShipsRssiMax && s.station[ stationSelected ]['rssi'] != null){
					stationShipsRssiMax = s.station[ stationSelected ]['rssi'];
				}
				if(typeof(parseFloat(s.station[ stationSelected ]['rssi'])) === "number" && s.station[ stationSelected ]['rssi'] != null){
					stationShipsRssiSum = stationShipsRssiSum + parseFloat(s.station[ stationSelected ]['rssi']);
				}
			}
		}
	});

	stationShipsTotal=stationShipsLat+stationShipsNolat;
	stationShipsRssiAvg = stationShipsRssiSum / stationShipsTotal;

	stationShipsTableData.sort((a,b) => {
		return b.rssi - a.rssi;
	});
	document.getElementById("stationShipsTableBody").innerHTML='';
	Object.values(stationShipsTableData).slice(0, 10).forEach(
		function stationShips(i){
			//handle nonexistent values
			if(i.shipname== undefined){
				i.shipname='';
			}
			if(i.callsign == undefined){
				i.callsign='';
			}
			if(isNaN(i.rssi) || i.rssi == null || i.rssi == undefined){
				i.rssi='';
			}
			else{
				i.rssi=Math.round(i.rssi*10)/10;
			}
			if(i.dist == undefined){
				dist='';
			}
			else{
				dist=i.dist + 'km';
			}

			document.getElementById("stationShipsTableBody").innerHTML+='<tr style="color:' + typeToColor('white', i.type) + ' !important;" onclick="shipSelect(\''+ i.mmsi +'\')"><td class="topMmsi">' + i.mmsi + '</td><td class="topShipname">' + i.shipname + '</td><td class="topCallsign">' + i.callsign + '</td><td class="topRssi">' + i.rssi + '</td><td class="topDist">' + dist + '</td><td class="topFix">' + i.fix + '</td></tr>';
		}
	);
	
		//
	stationTableDataFiltered = [];
	Object.values(stationShipsTableData).forEach(
		function iwas(i){
			if(i.dist !== undefined){
				stationTableDataFiltered.push(
					i
				);
			}
		}
	);

//radiosondes
	Object.entries(radiosondes).forEach(function radiosondeStation(r) {
		//selected station
		if(typeof stationSelected !== undefined && stationSelected !=''){
			if(stationSelected in r[1]['stations']){
				stationRadiosondesTableData.push({
					'id': r[0],
					'snr': r[1]['stations'][stationSelected]['snr'],
					'distance': r[1]['stations'][stationSelected]['distance']
				});
			}
		}
	});

	document.getElementById("stationRadiosondesTableBody").innerHTML='';
	Object.values(stationRadiosondesTableData).slice(0, 10).forEach(
		function stationRadiosondes(i){
			//handle nonexistent values
			if(i.id== undefined){
				i.id='';
			}
			if(isNaN(i.snr) || i.snr == null || i.snr == undefined){
				i.snr='';
			}
			else{
				i.snr=Math.round(i.snr*10)/10;
			}
			if(i.distance == undefined){
				dist='';
			}
			else{
				dist=i.distance + 'km';
			}

			document.getElementById("stationRadiosondesTableBody").innerHTML+='<tr onclick="radiosondeSelect(\''+ i.id +'\')"><td class="topRid">' + i.id + '</td><td class="topSnr">' + i.snr + '</td><td class="topDist">' + dist + '</td></tr>';
		}
	);

	

	setTimeout(function(){document.getElementById("stationInfoRefreshIndicator").style.display='none'}, 1000);
}

function stationMangle(data) {
	/*Hier statt der Schleife mal was verbessern als assoc mit Object.entries*/
	Object.values(data).forEach(function aircrafts(s){

		//
		if(stationSelected === s.name){
			//Notify Geraffel
			document.getElementById("stationNoticeTableBody").innerHTML = '';
			
			//Info
			//Info/Name
			//Info/Timestamps
			//Info/Timestamps/Sysinfo
			cellRefresh("stationTimestampFeeder", '<i class="fa-solid fa-microchip"></i> n/a');
			if(typeof s.timestamps.feeder !== 'undefined' && s.timestamps.feeder != 0){
				if(timeFromNow(s.timestamps.feeder) < 90){
					cellRefresh("stationTimestampFeeder", '<i class="ok"> <i class="fa-solid fa-microchip"></i> now</i>');
				}
				else{
					if(timeFromNow(s.timestamps.feeder) < 300){
						cellRefresh("stationTimestampFeeder", '<i class="warn"> <i class="fa-solid fa-microchip"></i> ' + timeFromNow(s.timestamps.feeder) + 's</i>');
					}
					else{
						cellRefresh("stationTimestampFeeder", '<i class="crit"> <i class="fa-solid fa-microchip"></i> ' + tsToReadable(s.timestamps.feeder) + '</i>');
					}
				}
			}
			else{
				cellRefresh("stationTimestampFeeder", '<i class="fa-solid fa-microchip"></i> n/a');
			}

			//Info/Timestamps/Uptime
			if(s.hasOwnProperty("uptime") && (Date.now()/1000-s.timestamps.feeder)<600){
				var uptimeDays = Math.floor(s.uptime/3600/24);
				var uptimeHours = Math.floor((s.uptime-(uptimeDays*24*3600))/3600);
				if(uptimeHours < 10){
					uptimeHours = '0' + uptimeHours;
				}
				var uptimeMinutes = Math.floor((s.uptime-(uptimeDays*24*3600)-(uptimeHours*3600))/60);
				if(uptimeMinutes < 10){
					uptimeMinutes = '0' + uptimeMinutes;
				}
				document.getElementById("stationUptime").innerHTML = 'up ' + uptimeDays + ' days, ' + uptimeHours + ':' + uptimeMinutes;
			}
			else{
				document.getElementById("stationUptime").innerHTML = 'n/a';
			}
			//Info/Timestamps/ADSB
			//Info/Timestamps//MLAT
			cellRefresh("stationTimestampMlat", '<i class="fa-solid fa-compass"></i> n/a');
			if(typeof s.timestamps.mlat !== 'undefined' && s.timestamps.mlat != 0){
				if(timeFromNow(s.timestamps.mlat) < 90){
					cellRefresh("stationTimestampMlat", '<i class="fa-solid fa-compass"></i> now');
				}
				else{
					if(timeFromNow(s.timestamps.mlat) < 300){
						cellRefresh("stationTimestampMlat", '<i class="fa-solid fa-compass"></i> ' + timeFromNow(s.timestamps.mlat) + ' s');
					}
					else{
						cellRefresh("stationTimestampMlat", '<i class="fa-solid fa-compass"></i> ' + tsToReadable(s.timestamps.mlat));
					}
				}
			}
			else{
				if(typeof s.timestamps.adsb !== 'undefined' && s.timestamps.adsb != 0){
					document.getElementById("stationNoticeTableBody").innerHTML += '<tr><td><i class="fa-solid fa-circle-info" style="color:yellow"></i> This station is ADS-B but not MLAT enabled, check our Wiki to learn how to add MLAT.</td></tr>';
				}
			}
			//Info/Timestamps/AIS
			//Info/Timestamps/Radiosondes
			//Info/ADSB
			cellRefresh("stationTimestampAdsb", '<i class="fa-solid fa-plane"></i> n/a');
			if(typeof s.timestamps.adsb !== 'undefined' && s.timestamps.adsb != 0){
				if(timeFromNow(s.timestamps.adsb) < 30){
					cellRefresh("stationTimestampAdsb", '<i class="ok"> <i class="fa-solid fa-plane"></i> now</i>');
					if(s.planes == 0){
						document.getElementById("stationNoticeTableBody").innerHTML += '<tr><td><i class="fa-solid fa-circle-exclamation" style="color:red"></i> Something seems to be wrong with the ADS-B reception of this station </td></tr>';
					}
					if(s.planes < 5 && s.planes != 0){
						document.getElementById("stationNoticeTableBody").innerHTML += '<tr><td><i class="fa-solid fa-circle-exclamation" style="color:yellow"></i> The number of planes recived by this station is very low, maybe there is room for improvement </td></tr>';
					}
				}
				else{
					if(timeFromNow(s.timestamps.adsb) < 300){
						document.getElementById("stationTimestampAdsb").innerHTML = '<i class="warn"> <i class="fa-solid fa-plane"></i> ' + timeFromNow(s.timestamps.adsb) + 's</i>';
					}
					else{
						document.getElementById("stationTimestampAdsb").innerHTML = '<i class="crit"> <i class="fa-solid fa-plane"></i> ' + tsToReadable(s.timestamps.adsb) + '</i>';
					}
					document.getElementById("stationNoticeTableBody").innerHTML += '<tr><td><i class="fa-solid fa-circle-exclamation" style="color:red"></i> This station is ADS-B enabled but has not received planes for a long time </td></tr>';
				}
				if(typeof s['adsb'] !== "undefined" && s['adsb']['total'] > 0){
					cellRefresh("stationPlanes", '<b>' + s.adsb.total + '</b>');
					cellRefresh("stationPositions", fixToIcon('true') + ' ' + s.adsb.total_fix);
					cellRefresh("stationMlats", fixToIcon('mlat') + ' ' + s.adsb.total_mlat);
					cellRefresh("stationPositionsFalse", fixToIcon('false') + ' ' + (s.adsb.total-s.adsb.total_fix-s.adsb.total_mlat));
					cellRefresh("stationPlanesPositionsUnique", 'U ' + s.adsb.total_unique);
					console.log(s.adsb.dist);
					//auch bei sonden und schiffchen wenn station keine koords und damit keine dist hat
					if(typeof s['adsb']['dist'] !== "undefined" && s['adsb']['dist'] != null){
						cellRefresh("stationRangePlane", '<i class="fas fa-bullseye"></i> ' + s.adsb.dist.min + '/' + s.adsb.dist.avg + '/' + s.adsb.dist.max + 'km');
					}
					cellRefresh("stationPlanesRssi", '<i class="fas fa-signal"></i> ' + s.adsb.rssi.min + '/' + s.adsb.rssi.avg + '/' + s.adsb.rssi.max);
				}
				else{
					cellRefresh("stationPlanes", '<b>0</b>');
					cellRefresh("stationPositions", fixToIcon('true') + ' 0');
					cellRefresh("stationMlats", fixToIcon('mlat') + ' 0');
					cellRefresh("stationPositionsFalse", fixToIcon('false') + ' 0');
					cellRefresh("stationPlanesPositionsUnique", 'U 0');
					cellRefresh("stationRangePlane");
					cellRefresh("stationPlanesRssi");
				}
			}
			else{
				cellRefresh("stationTimestampAdsb", '<i class="fa-solid fa-plane"></i> n/a');
				cellRefresh("stationPlanes");
				cellRefresh("stationPositions");
				cellRefresh("stationMlats");
				cellRefresh("stationPositionsFalse");
				cellRefresh("stationPlanesPositionsUnique");
				cellRefresh("stationRangePlane");
				cellRefresh("stationPlanesRssi");
			}

			//Info/AIS
			cellRefresh("stationTimestampAis", '<i class="fa-solid fa-ship"></i> n/a');
			if(typeof s.timestamps.ais !== 'undefined' && s.timestamps.ais != 0){
				if(timeFromNow(s.timestamps.ais) < 300){
					cellRefresh("stationTimestampAis", '<i class="ok"> <i class="fa-solid fa-ship"></i> now</i>');
					if(s.ships == 0){
						document.getElementById("stationNoticeTableBody").innerHTML += '<tr><td><i class="fa-solid fa-circle-exclamation" style="color:red"></i> Something seems to be wrong with the AIS reception of this station </td></tr>';
					}
					if(s.ships < 5 && s.ships != 0){
						document.getElementById("stationNoticeTableBody").innerHTML += '<tr><td><i class="fa-solid fa-circle-exclamation" style="color:yellow"></i> The number of ships recived by this station is very low, maybe there is room for improvement </td></tr>';
					}
				}
				else{
					if(timeFromNow(s.timestamps.ais) < 1800){
						cellRefresh("stationTimestampAis", '<i class="warn"> <i class="fa-solid fa-ship"></i> ' + timeFromNow(s.timestamps.ais) + 's</i>');
					}
					else{
						cellRefresh("stationTimestampAis", '<i class="crit"> <i class="fa-solid fa-ship"></i> ' + tsToReadable(s.timestamps.ais) + '</i>');
						document.getElementById("stationNoticeTableBody").innerHTML += '<tr><td><i class="fa-solid fa-circle-exclamation" style="color:red"></i> This station is AIS enabled but has not received ships for a long time </td></tr>';
					}
				}
				if(typeof s['ais'] !== "undefined" && s['ais']['total'] > 0){
					cellRefresh("stationShips", '<b>' + s['ais']['total'] + '</b>');
					cellRefresh("stationShipsPositions", fixToIcon('true') + ' ' + s['ais']['total_fix']);
					cellRefresh("stationShipsPositionsFalse", fixToIcon('false') + ' ' + (s['ais']['total']-s['ais']['total_fix']));
					cellRefresh("stationShipsPositionsUnique", 'U ' + s['ais']['total_unique']);
					cellRefresh("stationRangeShip", '<i class="fas fa-bullseye"></i> ' + s.ais.distance.min + '/' + s.ais.distance.avg + '/' + s.ais.distance.max + 'km');
					cellRefresh("stationShipsRssi", '<i class="fas fa-signal"></i> ' + s.ais.rssi.min + '/' + s.ais.rssi.avg + '/' + s.ais.rssi.max);
				}
				else{
					cellRefresh("stationShips", '<b>0</b>');
					cellRefresh("stationShipsPositions", fixToIcon('true') + ' 0');
					cellRefresh("stationShipsPositionsFalse", fixToIcon('false') + ' 0');
					cellRefresh("stationShipsPositionsUnique", 'U 0');
					cellRefresh("stationRangeShip");
					cellRefresh("stationShipsRssi");
				}
				
			}
			else{
				document.getElementById("stationTimestampAis").innerHTML = '<i class="fa-solid fa-ship"></i> n/a';
				cellRefresh("stationShips");
				cellRefresh("stationShipsPositions");
				cellRefresh("stationShipsPositionsFalse");
				cellRefresh("stationShipsPositionsUnique");
				cellRefresh("stationRangeShip");
				cellRefresh("stationShipsRssi");
			}

			//Info/Radiosondes
			cellRefresh("stationTimestampRadiosonde", '<i class="fa-solid fa-parachute-box"></i> n/a');
			if(typeof s.timestamps.radiosonde !== 'undefined' && s.timestamps.radiosonde != 0){
				if(timeFromNow(s.timestamps.radiosonde) < 3600){
					cellRefresh("stationTimestampRadiosonde", '<i class="ok"> <i class="fa-solid fa-parachute-box"></i> now</i>');
				}
				else{
					if(timeFromNow(s.timestamps.radiosonde) < 86400){
						cellRefresh("stationTimestampRadiosonde", '<i class="warn"> <i class="fa-solid fa-parachute-box"></i> ' + tsToReadable(s.timestamps.radiosonde) + '</i>');
					}
					else{
						cellRefresh("stationTimestampRadiosonde", '<i class="crit"> <i class="fa-solid fa-parachute-box"></i> ' + tsToReadable(s.timestamps.radiosonde) + '</i>');
						document.getElementById("stationNoticeTableBody").innerHTML += '<tr><td><i class="fa-solid fa-circle-exclamation" style="color:red"></i> This station is radiosondes enabled but has not received radiosondes for a long time </td></tr>';
}
				}
				if(typeof s['radiosondes'] !== "undefined" && s['radiosondes']['total'] > 0){
					cellRefresh("stationRadiosondes", '<b>' + s.radiosondes.total + '</b>');
					cellRefresh("stationRadiosondesPositionsUnique", 'U ' + s.radiosondes.total_unique);
					cellRefresh("stationRangeRadiosonde", '<i class="fas fa-bullseye"></i> ' + s.radiosondes.distance.min + '/' + s.radiosondes.distance.avg + '/' + s.radiosondes.distance.max + 'km');
					cellRefresh("stationRadiosondeSnr", '<i class="fas fa-signal"></i> ' + s.radiosondes.snr.min + '/' + s.radiosondes.snr.avg + '/' + s.radiosondes.snr.max);
				}
				else{
					cellRefresh("stationRadiosondes", '<b>0</b>');
					cellRefresh("stationRadiosondesPositionsUnique", 'U 0');
					cellRefresh("stationRangeRadiosonde");
					cellRefresh("stationRadiosondeSnr");
				}
			}
			else{
				cellRefresh("stationTimestampRadiosonde", '<i class="fa-solid fa-parachute-box"></i> n/a');
				cellRefresh("stationRadiosondes");
				cellRefresh("stationRadiosondesPositionsUnique");
				cellRefresh("stationRangeRadiosonde");
				cellRefresh("stationRadiosondeSnr");
			}
			
			//Info/CPU Load
			if(s.hasOwnProperty("cpu") && (Date.now()/1000-s.timestamps.feeder)<600){
			var cpuPerc = s.cpu['load']/s.cpu['cores']*100;
				if(cpuPerc < 80){
					var color = '#2b72d7';
					var text = 'white';
				}
				else{
					var color = 'orange';
					var text = 'black';
					document.getElementById("stationNoticeTableBody").innerHTML += '<tr><td><i class="fa-solid fa-circle-info" style="color:yellow"></i> The CPU load of this station is relatively high. For optimal performance you need to free system resources or opt for a faster CPU</td></tr>';
				}
				document.getElementById("stationCpuLoad").innerHTML = '<div id="stationCpuLoadBar" class="loadbar" style="background:linear-gradient(to right, ' + color + ' ' + cpuPerc + '%, rgba(57, 63, 76, 0.82) ' + cpuPerc + '%); color:' + text + '">' + s.cpu['load'] + '</div>';
				document.getElementById("stationCpuLoad").title = s.cpu['model'] + ' ' + s.cpu['cores'] + ' Core CPU with a load of: ' + s.cpu['load'];
				document.getElementById("stationCpu").innerHTML = s.cpu['model'] + ' (' + s.cpu['cores'] + ' cores)';
			}
			else{
				document.getElementById("stationCpuLoad").innerHTML = '<div id="stationCpuLoadBar" class="loadbar">n/a</div>';
				document.getElementById("stationCpu").innerHTML = 'n/a';
			}

			//Info/CPU Temp
			if(s.hasOwnProperty("cpu") && s['cpu'].hasOwnProperty("temperature") && (Date.now()/1000-s.timestamps.feeder)<600){
				const tempMax = 90;
				const tempWarn = 80;
				var tempPerc = s.cpu['temperature']/tempMax*100;
				if(s.cpu['temperature'] < tempWarn){
					var color = '#2b72d7';
					var text = 'white';
				}
				else{
					var color = 'orange';
					var text = 'black';
					document.getElementById("stationNoticeTableBody").innerHTML += '<tr><td><i class="fa-solid fa-circle-info" style="color:yellow"></i> The CPU temperature of this station is relatively high. For optimal performance you need to ensure proper cooling</td></tr>';
				}
				document.getElementById("stationCpuTemperature").innerHTML = '<div id="stationCpuTemperatureBar" class="loadbar" style="background:linear-gradient(to right, ' + color + ' ' + tempPerc + '%, rgba(57, 63, 76, 0.82) ' + tempPerc + '%); color:' + text + '">' + s.cpu['temperature'] + '°C</div>';
			}
			else{
				document.getElementById("stationCpuTemperature").innerHTML = '<div id="stationCpuTemperatureBar" class="loadbar">n/a</div>';
			}
			
			//Please note
			///cpu trottle
			if(s.hasOwnProperty("cpu") && s['cpu'].hasOwnProperty("throttled") && s['cpu']['throttled'] > 0){
				document.getElementById("stationNoticeTableBody").innerHTML += '<tr><td><i class="fa-solid fa-circle-info" style="color:yellow"></i> Unstable power source detected! For a stable system please use a decent power supply</td></tr>';
			}
			
			//Planes
			
			//Ships
			
			//Radiosondes
			
			//System
			//System/
			
			//MLAT sync peers
			
			

			
			//locate
			if(typeof s.lat !== 'undefined' && typeof s.lon !== 'undefined' && focus==true){
				map.setZoom(15);
				map.panTo([s.lat, s.lon]);
			}

			if(typeof s.lat !== 'undefined' && typeof s.lon !== 'undefined'){
				document.getElementById("stationInfoTableLocate").setAttribute( "onclick", "map.panTo([0, 0]); map.panTo([" + s.lat + ", " + s.lon + "]); map.setZoom(15)");
				stationSelectedLat = s.lat;
				stationSelectedLon = s.lon;
			}
			

			//Sync geraffel
			document.getElementById("stationMlatPeersTableBody").innerHTML = '';
			var stationMlatPeersCount = 0;
			stationMlatPeersTableData = [];
			if(typeof s.mlat !== 'undefined' && typeof s.mlat.peers !== 'undefined'){
				Object.entries(s.mlat.peers).forEach(function x(y){
					stationMlatPeersTableData.push({
						'name': y[0],
						'syncs': y[1][0],
						'syncErr': y[1][1],
						'syncOffset': y[1][2],
						'distance': y[1][3]
					});
					stationMlatPeersCount++;
				})
				console.log(s.peers);

				stationMlatPeersTableData.sort((a,b) => {
					return b.syncs - a.syncs;
				});
				stationMlatPeersSynctypes = {
					'#f00': 0,
					'#ff8000': 0,
					'#ff0': 0,
					'#0f0': 0
				};
				Object.values(stationMlatPeersTableData).forEach(
					function stationMlatPeers(i){
						document.getElementById("stationMlatPeersTableBody").innerHTML += '<tr onclick="stationSelect(\'' + i.name + '\')" style="color:' + syncToColor(i.syncs) + '"><td class="peerName">' + i.name + '</td><td class="peerSyncs"title="Number of syncs (higher is better)">' + i.syncs + '</td><td class="peerSyncErr" title="Sync time offset (lower is better)">' + i.syncErr + '</td><td class="peerSyncOffset" title="Sync frequency offset (closer to 0 is better)">' + i.syncOffset + '</td><td class="peerDistance" title="Distance to MLAT sync peer (km)">' + i.distance + '</td></tr>';
						stationMlatPeersSynctypes[syncToColor(i.syncs)]++;
					}
				);
				//console.log(stationMlatPeersSynctypes);
			}
			else{
				document.getElementById("stationMlatPeersTableBody").innerHTML = '';
			}
			document.getElementById("stationMlatPeersCount").innerHTML = stationMlatPeersCount + '/<span style="color:#0f0">' + stationMlatPeersSynctypes['#0f0'] + '</span>/<span style="color:#ff0">' + stationMlatPeersSynctypes['#ff0'] + '</span>/<span style="color:#ff8000">' + stationMlatPeersSynctypes['#ff8000'] + '</span>/<span style="color:#f00">' + stationMlatPeersSynctypes['#f00'] + '</span>';

			if(s.hasOwnProperty("memory") && (Date.now()/1000-s.timestamps.feeder)<600){
				//Memory Load
				var memoryPerc = (s.memory['total']-s.memory['available'])/s.memory['total']*100;
				if(memoryPerc < 80){
					var color = '#2b72d7';
					var text = 'white';
				}
				else{
					var color = 'orange';
					var text = 'black';
					document.getElementById("stationNoticeTableBody").innerHTML += '<tr><td><i class="fa-solid fa-circle-info" style="color:yellow"></i> The memory load of this station is relatively high. For optimal performance you need to free system resources or upgrade your memory</td></tr>';
				}
				document.getElementById("stationMemoryLoad").innerHTML = '<div id="stationMemoryLoadBar" class="loadbar" style="background:linear-gradient(to right, ' + color + ' ' + memoryPerc + '%, rgba(57, 63, 76, 0.82) ' + memoryPerc + '%); color:' + text + '">' + Math.round(memoryPerc*10)/10 + '%</div>';
				document.getElementById("stationMemoryLoad").title = 'Used ' + Math.round((s.memory['total']-s.memory['available'])/1024) + 'MB + ' + Math.round((s.memory['total']-s.memory['free'])/1024) + 'MB caches of a total of '+ Math.round(s.memory['total']/1024) + 'MB of intalled system memory';
				document.getElementById("stationMemory").innerHTML = Math.round(s.memory['total']/1024) + 'MB';
			}
			else{
				document.getElementById("stationMemoryLoad").innerHTML = '<div id="stationMemoryLoadBar" class="loadbar">n/a</div>';
				document.getElementById("stationMemory").innerHTML = 'n/a';
			}

			

			//os
			if(s.hasOwnProperty("os") && s.os.hasOwnProperty("kernel")){
				document.getElementById("kernel").innerHTML=s.os['kernel'];
			}
			else{
				document.getElementById("kernel").innerHTML='n/a';
			}

			//packages

			if(s.hasOwnProperty("packages") && s.packages['c2isrepo']==1){
				document.getElementById("c2isrepo").innerHTML="enabled";
			}
			else{
				document.getElementById("c2isrepo").innerHTML="n/a";
			}

			//dump1090
			document.getElementById("dump1090Fork").innerHTML='n/a';
			document.getElementById("dump1090Version").innerHTML='n/a';

			if(s.hasOwnProperty("packages") && s.packages.hasOwnProperty("dump1090-mutability")){
				document.getElementById("dump1090Fork").innerHTML='dump1090-mutability';
				document.getElementById("dump1090Version").innerHTML=s.packages['dump1090-mutability'];
			}

			if(s.hasOwnProperty("packages") && s.packages.hasOwnProperty("dump1090-fa")){
				document.getElementById("dump1090Fork").innerHTML='dump1090-fa';
				document.getElementById("dump1090Version").innerHTML=s.packages['dump1090-fa'];
			}

			if(s.hasOwnProperty("packages") && s.packages.hasOwnProperty("ais-catcher")){
				document.getElementById("ais-catcher").innerHTML=s.packages['ais-catcher'];
			}
			else{
				document.getElementById("ais-catcher").innerHTML='n/a';
			}

			if(s.hasOwnProperty("packages") && s.packages.hasOwnProperty("mlat-client-c2is")){
				document.getElementById("mlat-client-c2is").innerHTML=s.packages['mlat-client-c2is'];
			}
			else{
				document.getElementById("mlat-client-c2is").innerHTML='n/a';
			}

			if(s.hasOwnProperty("packages") && s.packages.hasOwnProperty("stunnel4")){
				document.getElementById("stunnel4").innerHTML=s.packages['stunnel4'];
			}
			else{
				document.getElementById("stunnel4").innerHTML='n/a';
			}

			if(document.getElementById("stationNoticeTableBody").innerHTML == ''){
				document.getElementById("stationNoticeTableBody").innerHTML = '<tr><td><i class="fa-solid fa-circle-info" style="color:#0f0"></i> Looks alright, nothing to improve.</td></tr>';
			}
		}
	});
	//Show/hide empty tables
	tableAutohide("stationPlanesTable");
	tableAutohide("stationShipsTable");
	tableAutohide("stationRadiosondesTable");
	tableAutohide("stationMlatPeersTable");
}


function stationGraphsBigRefresh() {
	document.getElementById("stationGraphBigStationname").innerHTML = stationSelected;

	var stationGraphBigData = [];
	var stationGraphStatsAdsbFix = 0;
	var stationGraphStatsAdsbNofix = 0;
	var stationGraphStatsAdsbMlat = 0;

	var stationGraphs = [
		"stationGraphBigAdsbDoughnut",
		"stationGraphBigAdsb",
		"stationGraphBigAdsbDistance",
		"stationGraphBigAdsbRssi",
		"stationGraphBigMlatPeers",
		"stationGraphBigAis",
		"stationGraphBigAisDistance",
		"stationGraphBigAisRssi",
		"stationGraphBigRadiosondes",
		"stationGraphBigRadiosondesDistance",
		"stationGraphBigRadiosondesSnr",
		"stationGraphBigSysperformance",
		"stationGraphBigUptime"
	];

	stationGraphs.forEach(function (graph) {
		if(Chart.getChart(graph) !== undefined) {
			Chart.getChart(graph).destroy();
		}
	});

	(async function() {
		fetch('https://stats.api.sdrmap.org/stations/' + stationGraphsTimespan + '/new_' + stationSelected + '.json')
		.then(function(response) { return response.json(); })
		.then(function(dataIn) {
			stationGraphBigData = dataIn;
			if(typeof stationGraphBigData.adsb !== 'undefined'){
				document.getElementById('stationGraphBigAdsbDoughnut').parentElement.style.display='';
				document.getElementById('stationGraphBigAdsb').parentElement.style.display='';
				document.getElementById('stationGraphBigAdsbDistance').parentElement.style.display='';
				document.getElementById('stationGraphBigAdsbRssi').parentElement.style.display='';
				var ml = 0;
				if (typeof stationGraphBigData.mlat !== 'undefined' && typeof stationGraphBigData.mlat.total !== 'undefined'){
					ml=Object.values(stationGraphBigData.mlat.total).reduce((a, b) => a + b, 0);
				}
				var onepercent=(Object.values(stationGraphBigData.adsb.total_fix).reduce((a, b) => a + b, 0)+ml+Object.values(stationGraphBigData.adsb.total_nofix).reduce((a, b) => a + b, 0))/100;
				new Chart(
					document.getElementById('stationGraphBigAdsbDoughnut'),
					{
						type: 'doughnut',
						//type: 'pie',
						options: {
							responsive: true,
							aspectRatio: 2,
							plugins: {
								legend: {
									position: 'bottom',
									labels: {
										color: 'white'
									}
								},
								title: {
									display: true,
									text: stationSelected,
									color: 'white'
								},
								subtitle: {
									display: true,
									text: 'ADS-B aircrafts by fix',
									color: 'white'
								},
							}
						},
						data: {
							labels: ['ADS-B fix', 'MLAT', 'no fix'],
							datasets: [
								{
									data: [Object.values(stationGraphBigData.adsb.total_fix).reduce((a, b) => a + b, 0)/onepercent, ml/onepercent, Object.values(stationGraphBigData.adsb.total_nofix).reduce((a, b) => a + b, 0)/onepercent],
									backgroundColor: ['#0f0','orange','red'],
									borderColor: ['#0f0','orange','red']
								}
							]
						}
					}
				);
				if(typeof stationGraphBigData.mlat !== 'undefined' && typeof stationGraphBigData.mlat.total !== 'undefined'){
					var ml = stationGraphBigData.mlat.total
				}
				else{
					var ml = [0];
				}
				new Chart(
					document.getElementById('stationGraphBigAdsb'),
					{
						type: 'line',
						options: {
							//spanGaps: 1000 * 60 * 60 * 24 * 2,
							responsive: true,
							pointStyle: false,
							elements: {
								line: {
									tension: 0
								}
							},
							interaction: {
								mode: 'index',
								intersect: false
							},
							scales: {
								y: {
									title: {
										display: true,
										text: '# of aircrafts',
										color: 'white'
									},
									min: 0,
									border: {
										color: '#656565'
									},
									grid: {
										color: '#656565',
									},
									ticks: {
										color: 'white',
									}
								},
								x: {
									type: 'time',
									time: {
										tooltipFormat: 'D.M. HH:mm',
										displayFormats: {
											minute: 'D.M. HH:mm'
										}
									},
									//
									border: {
										color: '#656565'
									},
									grid: {
										color: '#656565',
									},
									ticks: {
										callback: function(val, index) {
											// Hide every 2nd tick label
											return index % 2 === 0 ? this.getLabelForValue(val) : '';
										  },
										color: 'white',
									}
								}
							},
							plugins: {
								legend: {
									position: 'bottom',
									labels: {
										color: 'white'
									}
								},
								title: {
									display: true,
									text: stationSelected,
									color: 'white'
								},
								subtitle: {
									display: true,
									text: 'ADS-B aircrafts by fix',
									color: 'white'
								}
							}
						},
						plugins: [vLine],
						data: {
							labels: Object.keys(stationGraphBigData.adsb.total).map((x) => x * 1000),
							datasets: [
								{
									label: 'Total',
									data: Object.values(stationGraphBigData.adsb.total),
									borderColor: '#2b72d7',
									backgroundColor: '#2b72d7'
								},
								{
									label: 'ADS-B fix',
									data: Object.values(stationGraphBigData.adsb.total_fix),
									borderColor: '#0f0',
									backgroundColor: '#0f0'
								},
								{
									label: 'MLAT',
									//data: Object.values(stationGraphBigData.mlat.total),
									data: Object.values(ml),
									//data: null,
									borderColor: 'orange',
									backgroundColor: 'orange'
								},
								{
									label: 'no fix',
									data: Object.values(stationGraphBigData.adsb.total_nofix),
									//data: null,
									borderColor: 'red',
									backgroundColor: 'red'
								},
								{
									label: 'unique',
									data: Object.values(stationGraphBigData.adsb.total_unique),
									//data: null,
									borderColor: 'white',
									backgroundColor: 'white'
								}
							]
						}
					}
				);
				if(typeof stationGraphBigData.adsb.distance !== 'undefined'){
					new Chart(
						document.getElementById('stationGraphBigAdsbDistance'),
						{
							type: 'line',
							options: {
								responsive: true,
								pointStyle: false,
								elements: {
									line: {
										tension: 0
									}
								},
								interaction: {
									mode: 'index',
									intersect: false
								},
								scales: {
									y: {
										title: {
											display: true,
											text: 'distance in km',
											color: 'white'
										},
										min: 0,
										border: {
											color: '#656565'
										},
										grid: {
											color: '#656565',
										},
										ticks: {
											color: 'white',
										}
									},
									x: {
										type: 'time',
										time: {
											tooltipFormat: 'D.M. HH:mm',
											displayFormats: {
												minute: 'D.M. HH:mm'
											}
										},
										border: {
											color: '#656565'
										},
										grid: {
											color: '#656565',
										},
										ticks: {
											callback: function(val, index) {
												// Hide every 2nd tick label
												return index % 2 === 0 ? this.getLabelForValue(val) : '';
											  },
											color: 'white',
										}
									}
								},
								plugins: {
									legend: {
										position: 'bottom',
										labels: {
											color: 'white'
										}
									},
									title: {
										display: true,
										text: stationSelected,
										color: 'white'
									},
									subtitle: {
										display: true,
										text: 'ADS-B aircrafts distance',
										color: 'white'
									}
								}
							},
							plugins: [vLine],
							data: {
								labels: Object.keys(stationGraphBigData.adsb.distance.avg).map((x) => x * 1000),
								datasets: [
									{
										label: 'min',
										data: Object.values(stationGraphBigData.adsb.distance.min),
										borderColor: 'orange',
										backgroundColor: 'orange'
									},
									{
										label: 'avg',
										data: Object.values(stationGraphBigData.adsb.distance.avg),
										borderColor: '#2b72d7',
										backgroundColor: '#2b72d7'
									},
									{
										label: 'max',
										data: Object.values(stationGraphBigData.adsb.distance.max),
										borderColor: '#fff',
										backgroundColor: '#fff'
									}
								]
							}
						}
					);
				}
				if(typeof stationGraphBigData.adsb.rssi !== 'undefined'){
					new Chart(
						document.getElementById('stationGraphBigAdsbRssi'),
						{
							type: 'line',
							options: {
								responsive: true,
								pointStyle: false,
								elements: {
									line: {
										tension: 0
									}
								},
								interaction: {
									mode: 'index',
									intersect: false
								},
								scales: {
									y: {
										title: {
											display: true,
											text: 'rssi in dbFS',
											color: 'white'
										},
										max: 0,
										border: {
											color: '#656565'
										},
										grid: {
											color: '#656565',
										},
										ticks: {
											color: 'white',
										}
									},
									x: {
										type: 'time',
										time: {
											tooltipFormat: 'D.M. HH:mm',
											displayFormats: {
												minute: 'D.M. HH:mm'
											}
										},
										border: {
											color: '#656565'
										},
										grid: {
											color: '#656565',
										},
										ticks: {
											callback: function(val, index) {
												// Hide every 2nd tick label
												return index % 2 === 0 ? this.getLabelForValue(val) : '';
											  },
											color: 'white',
										}
									}
								},
								plugins: {
									legend: {
										position: 'bottom',
										labels: {
											color: 'white'
										}
									},
									title: {
										display: true,
										text: stationSelected,
										color: 'white'
									},
									subtitle: {
										display: true,
										text: 'ADS-B aircrafts rssi',
										color: 'white'
									}
								}
							},
							plugins: [vLine],
							data: {
								labels: Object.keys(stationGraphBigData.adsb.rssi.min).map((x) => x * 1000),
								datasets: [
									{
										label: 'min',
										data: Object.values(stationGraphBigData.adsb.rssi.min),
										borderColor: 'orange',
										backgroundColor: 'orange'
									},
									{
										label: 'avg',
										data: Object.values(stationGraphBigData.adsb.rssi.avg),
										borderColor: '#2b72d7',
										backgroundColor: '#2b72d7'
									},
									{
										label: 'max',
										data: Object.values(stationGraphBigData.adsb.rssi.max),
										borderColor: '#fff',
										backgroundColor: '#fff'
									}
								]
							}
						}
					);
				}
				if(typeof stationGraphBigData.mlat !== 'undefined' && typeof stationGraphBigData.mlat.peers_total !== 'undefined'){
					new Chart(
						document.getElementById('stationGraphBigMlatPeers'),
						{
							type: 'line',
							options: {
								responsive: true,
								pointStyle: false,
								elements: {
									line: {
										tension: 0
									}
								},
								interaction: {
									mode: 'index',
									intersect: false
								},
								scales: {
									y: {
										title: {
											display: true,
											text: '# of peers',
											color: 'white'
										},
										min: 0,
										border: {
											color: '#656565'
										},
										grid: {
											color: '#656565',
										},
										ticks: {
											color: 'white',
										}
									},
									x: {
										type: 'time',
										time: {
											tooltipFormat: 'D.M. HH:mm',
											displayFormats: {
												minute: 'D.M. HH:mm'
											}
										},
										border: {
											color: '#656565'
										},
										grid: {
											color: '#656565',
										},
										ticks: {
											callback: function(val, index) {
												// Hide every 2nd tick label
												return index % 2 === 0 ? this.getLabelForValue(val) : '';
											  },
											color: 'white',
										}
									}
								},
								plugins: {
									legend: {
										position: 'bottom',
										labels: {
											color: 'white'
										}
									},
									title: {
										display: true,
										text: stationSelected,
										color: 'white'
									},
									subtitle: {
										display: true,
										text: 'ADS-B MLAT peers',
										color: 'white'
									}
								}
							},
							plugins: [vLine],
							data: {
								labels: Object.keys(stationGraphBigData.mlat.peers_total).map((x) => x * 1000),
								datasets: [
									{
										label: 'total',
										data: Object.values(stationGraphBigData.mlat.peers_total),
										borderColor: '#2b72d7',
										backgroundColor: '#2b72d7'
									},
									{
										label: 'green',
										data: Object.values(stationGraphBigData.mlat.peers_green),
										borderColor: '#0f0',
										backgroundColor: '#0f0'
									},
									{
										label: 'yellow',
										data: Object.values(stationGraphBigData.mlat.peers_yellow),
										borderColor: 'yellow',
										backgroundColor: 'yellow'
									},
									{
										label: 'orange',
										data: Object.values(stationGraphBigData.mlat.peers_orange),
										borderColor: 'orange',
										backgroundColor: 'orange'
									},
									{
										label: 'red',
										data: Object.values(stationGraphBigData.mlat.peers_red),
										borderColor: 'red',
										backgroundColor: 'red'
									}
								]
							}
						}
					);
				}
			}
			else{
				document.getElementById('stationGraphBigAdsbDoughnut').parentElement.style.display='none';
				document.getElementById('stationGraphBigAdsb').parentElement.style.display='none';
				document.getElementById('stationGraphBigAdsbDistance').parentElement.style.display='none';
				document.getElementById('stationGraphBigAdsbRssi').parentElement.style.display='none';
			}
			if(typeof stationGraphBigData.ais !== 'undefined'){
				document.getElementById('stationGraphBigAis').parentElement.style.display='';
				document.getElementById('stationGraphBigAisDistance').parentElement.style.display='';
				document.getElementById('stationGraphBigAisRssi').parentElement.style.display='';
				new Chart(
					document.getElementById('stationGraphBigAis'),
					{
						type: 'line',
						options: {
							responsive: true,
							//maintainAspectRatio: false,
							pointStyle: false,
							elements: {
								line: {
									tension: 0
								}
							},
							interaction: {
								mode: 'index',
								intersect: false
							},
							scales: {
								y: {
									title: {
										display: true,
										text: '# of vessels',
										color: 'white'
									},
									min: 0,
									border: {
										color: '#656565'
									},
									grid: {
										color: '#656565',
									},
									ticks: {
										color: 'white',
									}
								},
								x: {
									type: 'time',
									time: {
										tooltipFormat: 'D.M. HH:mm',
										displayFormats: {
											minute: 'D.M. HH:mm'
										}
									},
									border: {
										color: '#656565'
									},
									grid: {
										color: '#656565',
									},
									ticks: {
										callback: function(val, index) {
											// Hide every 2nd tick label
											return index % 2 === 0 ? this.getLabelForValue(val) : '';
										},
										color: 'white'
									}
								}
							},
							plugins: {
								legend: {
									position: 'bottom',
									labels: {
										color: 'white'
									}
								},
								title: {
									display: true,
									text: stationSelected,
									color: 'white'
								},
								subtitle: {
									display: true,
									text: 'AIS vessels',
									color: 'white'
								}
							}
						},
						plugins: [vLine],
						data: {
							labels: Object.keys(stationGraphBigData.ais.total).map((x) => x * 1000),
							datasets: [
								{
									label: 'AIS fix',
									data: Object.values(stationGraphBigData.ais.total),
									//borderColor: '#0f0',
									//backgroundColor: '#0f0'
									borderColor: '#2b72d7',
									backgroundColor: '#2b72d7'
								},
								{
									label: 'unique',
									data: Object.values(stationGraphBigData.ais.total_unique),
									borderColor: 'white',
									backgroundColor: 'white'
								}
							]
						}
					}
				);
				if(typeof stationGraphBigData.ais.distance !== 'undefined'){
					new Chart(
						document.getElementById('stationGraphBigAisDistance'),
						{
							type: 'line',
							options: {
								responsive: true,
								pointStyle: false,
								elements: {
									line: {
										tension: 0
									}
								},
								interaction: {
									mode: 'index',
									intersect: false
								},
								scales: {
									y: {
										title: {
											display: true,
											text: 'distance in km',
											color: 'white'
										},
										min: 0,
										border: {
											color: '#656565'
										},
										grid: {
											color: '#656565',
										},
										ticks: {
											color: 'white',
										}
									},
									x: {
										type: 'time',
										time: {
											tooltipFormat: 'D.M. HH:mm',
											displayFormats: {
												minute: 'D.M. HH:mm'
											}
										},
										border: {
											color: '#656565'
										},
										grid: {
											color: '#656565',
										},
										ticks: {
											callback: function(val, index) {
												// Hide every 2nd tick label
												return index % 2 === 0 ? this.getLabelForValue(val) : '';
											  },
											color: 'white',
										}
									}
								},
								plugins: {
									legend: {
										position: 'bottom',
										labels: {
											color: 'white'
										}
									},
									title: {
										display: true,
										text: stationSelected,
										color: 'white'
									},
									subtitle: {
										display: true,
										text: 'AIS vessels distance',
										color: 'white'
									}
								}
							},
							plugins: [vLine],
							data: {
								labels: Object.keys(stationGraphBigData.ais.distance.avg).map((x) => x * 1000),
								datasets: [
									{
										label: 'min',
										data: Object.values(stationGraphBigData.ais.distance.min),
										borderColor: 'orange',
										backgroundColor: 'orange'
									},
									{
										label: 'avg',
										data: Object.values(stationGraphBigData.ais.distance.avg),
										borderColor: '#2b72d7',
										backgroundColor: '#2b72d7'
									},
									{
										label: 'max',
										data: Object.values(stationGraphBigData.ais.distance.max),
										borderColor: '#fff',
										backgroundColor: '#fff'
									}
								]
							}
						}
					);
				}
				if(typeof stationGraphBigData.ais.rssi !== 'undefined'){
					new Chart(
						document.getElementById('stationGraphBigAisRssi'),
						{
							type: 'line',
							options: {
								responsive: true,
								pointStyle: false,
								elements: {
									line: {
										tension: 0
									}
								},
								interaction: {
									mode: 'index',
									intersect: false
								},
								scales: {
									y: {
										title: {
											display: true,
											text: 'rssi',
											color: 'white'
										},
										max: 0,
										//min: -50,
										border: {
											color: '#656565'
										},
										grid: {
											color: '#656565',
										},
										ticks: {
											color: 'white',
										}
									},
									x: {
										type: 'time',
										time: {
											tooltipFormat: 'D.M. HH:mm',
											displayFormats: {
												minute: 'D.M. HH:mm'
											}
										},
										border: {
											color: '#656565'
										},
										grid: {
											color: '#656565',
										},
										ticks: {
											callback: function(val, index) {
												// Hide every 2nd tick label
												return index % 2 === 0 ? this.getLabelForValue(val) : '';
											  },
											color: 'white',
										}
									}
								},
								plugins: {
									legend: {
										position: 'bottom',
										labels: {
											color: 'white'
										}
									},
									title: {
										display: true,
										text: stationSelected,
										color: 'white'
									},
									subtitle: {
										display: true,
										text: 'AIS vessels rssi',
										color: 'white'
									}
								}
							},
							plugins: [vLine],
							data: {
								labels: Object.keys(stationGraphBigData.ais.rssi.avg).map((x) => x * 1000),
								datasets: [
									{
										label: 'min',
										data: Object.values(stationGraphBigData.ais.rssi.min),
										borderColor: 'orange',
										backgroundColor: 'orange'
									},
									{
										label: 'avg',
										data: Object.values(stationGraphBigData.ais.rssi.avg),
										borderColor: '#2b72d7',
										backgroundColor: '#2b72d7'
									},
									{
										label: 'max',
										data: Object.values(stationGraphBigData.ais.rssi.max),
										borderColor: '#fff',
										backgroundColor: '#fff'
									}
								]
							}
						}
					);
				}
			}
			else{
				document.getElementById('stationGraphBigAis').parentElement.style.display='none';
				document.getElementById('stationGraphBigAisDistance').parentElement.style.display='none';
				document.getElementById('stationGraphBigAisRssi').parentElement.style.display='none';
			}
			//radiosonde
			if(typeof stationGraphBigData.radiosondes !== 'undefined'){
				document.getElementById('stationGraphBigRadiosondes').parentElement.style.display='';
				document.getElementById('stationGraphBigRadiosondesDistance').parentElement.style.display='';
				document.getElementById('stationGraphBigRadiosondesSnr').parentElement.style.display='';
				new Chart(
					document.getElementById('stationGraphBigRadiosondes'),
					{
						type: 'line',
						options: {
							responsive: true,
							//maintainAspectRatio: false,
							pointStyle: false,
							elements: {
								line: {
									tension: 0
								}
							},
							interaction: {
								mode: 'index',
								intersect: false
							},
							scales: {
								y: {
									title: {
										display: true,
										text: '# of radiosondes',
										color: 'white'
									},
									min: 0,
									border: {
										color: '#656565'
									},
									grid: {
										color: '#656565',
									},
									ticks: {
										color: 'white',
									}
								},
								x: {
									type: 'time',
									time: {
										tooltipFormat: 'D.M. HH:mm',
										displayFormats: {
											minute: 'D.M. HH:mm'
										}
									},
									border: {
										color: '#656565'
									},
									grid: {
										color: '#656565',
									},
									ticks: {
										callback: function(val, index) {
											// Hide every 2nd tick label
											return index % 2 === 0 ? this.getLabelForValue(val) : '';
										  },
										color: 'white',
									}
								}
							},
							plugins: {
								legend: {
									position: 'bottom',
									labels: {
										color: 'white'
									}
								},
								title: {
									display: true,
									text: stationSelected,
									color: 'white'
								},
								subtitle: {
									display: true,
									text: 'Radiosondes',
									color: 'white'
								}
							}
						},
						plugins: [vLine],
						data: {
							labels: Object.keys(stationGraphBigData.radiosondes.total).map((x) => x * 1000),
							datasets: [
								{
									label: 'Radiosondes',
									data: Object.values(stationGraphBigData.radiosondes.total),
									borderColor: '#2b72d7',
									backgroundColor: '#2b72d7'
								},
								{
									label: 'unique',
									data: Object.values(stationGraphBigData.radiosondes.total_unique),
									borderColor: 'white',
									backgroundColor: 'white'
								}
							]
						}
					}
				);
				if(typeof stationGraphBigData.radiosondes.distance !== 'undefined'){
					new Chart(
						document.getElementById('stationGraphBigRadiosondesDistance'),
						{
							type: 'line',
							options: {
								responsive: true,
								pointStyle: false,
								elements: {
									line: {
										tension: 0
									}
								},
								interaction: {
									mode: 'index',
									intersect: false
								},
								scales: {
									y: {
										title: {
											display: true,
											text: 'distance in km',
											color: 'white'
										},
										min: 0,
										border: {
											color: '#656565'
										},
										grid: {
											color: '#656565',
										},
										ticks: {
											color: 'white',
										}
									},
									x: {
										type: 'time',
										time: {
											tooltipFormat: 'D.M. HH:mm',
											displayFormats: {
												minute: 'D.M. HH:mm'
											}
										},
										border: {
											color: '#656565'
										},
										grid: {
											color: '#656565',
										},
										ticks: {
											callback: function(val, index) {
												// Hide every 2nd tick label
												return index % 2 === 0 ? this.getLabelForValue(val) : '';
											  },
											color: 'white',
										}
									}
								},
								plugins: {
									legend: {
										position: 'bottom',
										labels: {
											color: 'white'
										}
									},
									title: {
										display: true,
										text: stationSelected,
										color: 'white'
									},
									subtitle: {
										display: true,
										text: 'Radiosondes distance',
										color: 'white'
									}
								}
							},
							plugins: [vLine],
							data: {
								labels: Object.keys(stationGraphBigData.radiosondes.distance.avg).map((x) => x * 1000),
								datasets: [
									{
										label: 'min',
										data: Object.values(stationGraphBigData.radiosondes.distance.min),
										borderColor: 'orange',
										backgroundColor: 'orange'
									},
									{
										label: 'avg',
										data: Object.values(stationGraphBigData.radiosondes.distance.avg),
										borderColor: '#2b72d7',
										backgroundColor: '#2b72d7'
									},
									{
										label: 'max',
										data: Object.values(stationGraphBigData.radiosondes.distance.max),
										borderColor: '#fff',
										backgroundColor: '#fff'
									}
								]
							}
						}
					);
				}
				if(typeof stationGraphBigData.radiosondes.snr !== 'undefined'){
					new Chart(
						document.getElementById('stationGraphBigRadiosondesSnr'),
						{
							type: 'line',
							options: {
								responsive: true,
								pointStyle: false,
								elements: {
									line: {
										tension: 0
									}
								},
								interaction: {
									mode: 'index',
									intersect: false
								},
								scales: {
									y: {
										title: {
											display: true,
											text: 'snr',
											color: 'white'
										},
										min: 0,
										border: {
											color: '#656565'
										},
										grid: {
											color: '#656565',
										},
										ticks: {
											color: 'white',
										}
									},
									x: {
										type: 'time',
										time: {
											tooltipFormat: 'D.M. HH:mm',
											displayFormats: {
												minute: 'D.M. HH:mm'
											}
										},
										border: {
											color: '#656565'
										},
										grid: {
											color: '#656565',
										},
										ticks: {
											callback: function(val, index) {
												// Hide every 2nd tick label
												return index % 2 === 0 ? this.getLabelForValue(val) : '';
											  },
											color: 'white',
										}
									}
								},
								plugins: {
									legend: {
										position: 'bottom',
										labels: {
											color: 'white'
										}
									},
									title: {
										display: true,
										text: stationSelected,
										color: 'white'
									},
									subtitle: {
										display: true,
										text: 'Radiosondes snr',
										color: 'white'
									}
								}
							},
							plugins: [vLine],
							data: {
								labels: Object.keys(stationGraphBigData.radiosondes.snr.avg).map((x) => x * 1000),
								datasets: [
									{
										label: 'min',
										data: Object.values(stationGraphBigData.radiosondes.snr.min),
										borderColor: 'orange',
										backgroundColor: 'orange'
									},
									{
										label: 'avg',
										data: Object.values(stationGraphBigData.radiosondes.snr.avg),
										borderColor: '#2b72d7',
										backgroundColor: '#2b72d7'
									},
									{
										label: 'max',
										data: Object.values(stationGraphBigData.radiosondes.snr.max),
										borderColor: '#fff',
										backgroundColor: '#fff'
									}
								]
							}
						}
					);
				}
			}
			else{
				document.getElementById('stationGraphBigRadiosondes').parentElement.style.display='none';
				document.getElementById('stationGraphBigRadiosondesDistance').parentElement.style.display='none';
				document.getElementById('stationGraphBigRadiosondesSnr').parentElement.style.display='none';
			}
			if(typeof stationGraphBigData.cpu !== 'undefined'){
				document.getElementById('stationGraphBigSysperformance').parentElement.style.display='';
				new Chart(
					document.getElementById('stationGraphBigSysperformance'),
					{
						type: 'line',
						options: {
							responsive: true,
							//maintainAspectRatio: false,
							pointStyle: false,
							elements: {
								line: {
									tension: 0
								}
							},
							interaction: {
								mode: 'index',
								intersect: false
							},
							scales: {
								perc: {
									position: 'left',
									title: {
										display: true,
										text: 'CPU / Memory %',
										color: 'white'
									},
									min: 0,
									max: 100,
									border: {
										color: '#656565'
									},
									grid: {
										color: '#656565',
									},
									ticks: {
										color: 'white',
									}
								},
								temp: {
									position: 'right',
									title: {
										display: true,
										text: 'Temperature °C',
										color: 'white'
									},
									min: 0,
									max: 100,
									border: {
										color: '#656565'
									},
									grid: {
										color: '#656565',
									},
									ticks: {
										color: 'white',
									}
								},
								x: {
									type: 'time',
									time: {
										tooltipFormat: 'D.M. HH:mm',
										displayFormats: {
											minute: 'D.M. HH:mm'
										}
									},
									border: {
										color: '#656565'
									},
									grid: {
										color: '#656565',
									},
									ticks: {
										callback: function(val, index) {
											// Hide every 2nd tick label
											return index % 2 === 0 ? this.getLabelForValue(val) : '';
										  },
										color: 'white',
									}
								}
							},
							plugins: {
								legend: {
									position: 'bottom',
									labels: {
										color: 'white'
									}
								},
								title: {
									display: true,
									text: stationSelected,
									color: 'white'
								},
								subtitle: {
									display: true,
									text: 'System performance',
									color: 'white'
								}
							}
						},
						plugins: [vLine],
						data: {
							labels: Object.keys(stationGraphBigData.cpu.utilization).map((x) => x * 1000),
							datasets: [
								{
									label: 'CPU',
									data: Object.values(stationGraphBigData.cpu.utilization),
									borderColor: '#2b72d7',
									backgroundColor: '#2b72d7',
									yAxisID: 'perc'
								},
								{
									label: 'Memory',
									data: Object.values(stationGraphBigData.memory.utilization),
									borderColor: 'white',
									backgroundColor: 'white',
									yAxisID: 'perc'
								},
								{
									label: 'Temperature',
									data: Object.values(stationGraphBigData.cpu.temperature),
									borderColor: 'orange',
									backgroundColor: 'orange',
									yAxisID: 'temp'
								}
							]
						}
					}
				
				);
			}
			else{
				document.getElementById('stationGraphBigSysperformance').parentElement.style.display='none';
			}
			if(typeof stationGraphBigData.uptime !== 'undefined'){
				document.getElementById('stationGraphBigUptime').parentElement.style.display='';
				new Chart(
					document.getElementById('stationGraphBigUptime'),
					{
						type: 'line',
						options: {
							responsive: true,
							//maintainAspectRatio: false,
							pointStyle: false,
							elements: {
								line: {
									tension: 0
								}
							},
							interaction: {
								mode: 'index',
								intersect: false
							},
							scales: {
								uptime: {
									position: 'left',
									title: {
										display: true,
										text: 'Uptime in days',
										color: 'white'
									},
									min: 0,
									/*max: 100,*/
									border: {
										color: '#656565'
									},
									grid: {
										color: '#656565',
									},
									ticks: {
										color: 'white',
									}
								},
								x: {
									type: 'time',
									time: {
										tooltipFormat: 'D.M. HH:mm',
										displayFormats: {
											minute: 'D.M. HH:mm'
										}
									},
									border: {
										color: '#656565'
									},
									grid: {
										color: '#656565',
									},
									ticks: {
										callback: function(val, index) {
											// Hide every 2nd tick label
											return index % 2 === 0 ? this.getLabelForValue(val) : '';
										  },
										color: 'white',
									}
								}
							},
							plugins: {
								legend: {
									position: 'bottom',
									labels: {
										color: 'white'
									}
								},
								title: {
									display: true,
									text: stationSelected,
									color: 'white'
								},
								subtitle: {
									display: true,
									text: 'System uptime',
									color: 'white'
								}
							}
						},
						plugins: [vLine],
						data: {
							labels: Object.keys(stationGraphBigData.uptime).map((x) => x * 1000),
							datasets: [
								{
									label: 'uptime',
									data: Object.values(stationGraphBigData.uptime).map((x) => x === null ? null : x / 86400),
									borderColor: '#2b72d7',
									backgroundColor: '#2b72d7',
									yAxisID: 'uptime'
								}
							]
						}
					}
				
				);
			}
			else{
				document.getElementById('stationGraphBigSysperformance').parentElement.style.display='none';
			}
		});
	})();
}

function stationGraphsTimespanSet(t){
	stationGraphsTimespan = t;
	stationGraphsBigRefresh();
	document.getElementById("stationGraphsTimespanButton1h").className = 'stationGraphsTimespanButton';
	document.getElementById("stationGraphsTimespanButton1d").className = 'stationGraphsTimespanButton';
	document.getElementById("stationGraphsTimespanButton7d").className = 'stationGraphsTimespanButton';
	document.getElementById("stationGraphsTimespanButton30d").className = 'stationGraphsTimespanButton';
	document.getElementById("stationGraphsTimespanButton1y").className = 'stationGraphsTimespanButton';
	document.getElementById("stationGraphsTimespanButton3y").className = 'stationGraphsTimespanButton';
	document.getElementById("stationGraphsTimespanButton" + t).className = 'stationGraphsTimespanButtonActive';
}
