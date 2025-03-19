function cellRefresh(cell, value, text, precision){
	if(typeof value !== 'undefined'){
		if(document.getElementById(cell).innerHTML != value){
			if(typeof precision !== 'undefined'){
				value = Math.round(value*Math.pow(10,precision))/Math.pow(10,precision);
			}
			document.getElementById(cell).innerHTML = value;
			if(typeof text !== 'undefined'){
				document.getElementById(cell).innerHTML += text;
			}
		}
	}
	else{
		document.getElementById(cell).innerHTML = 'n/a';
	}
}

function planeInfoRefresh(f){
	//Info
	cellRefresh("planeId", f.hex);
	document.getElementById("planeId").style='';
	if(f.type !== 'undefined'){
		if(f.type == 'mil'){
			document.getElementById("planeId").style='color:#0f0';
		}
		if(f.type == 'int'){
			document.getElementById("planeId").style='color:#ff00c3';
		}
		if(f.type == 'bos'){
			document.getElementById("planeId").style='color:#f00';
		}
	}

	cellRefresh("planeFlight", f.flight);
	cellRefresh("planeCountry", f.country);
	cellRefresh("planeAirline", f.airline);
	cellRefresh("planeRegistration", f.registration);
	cellRefresh("planeModel", f.model);
	cellRefresh("planeModelLong", f.modelLong);
	cellRefresh("planeSquawk", f.squawk);
	cellRefresh("planeSquawkLong", f.squawkLong);
	cellRefresh("planeSeen", secondsToReadable(timeFromNow(f.timestamp)));


	if(typeof f.picture !== 'undefined'){
		if(f.picture.includes("aircraft")){
			document.getElementById("planePicture").innerHTML='<img src="' + f.picture + '"><a>This is a picture of ' + f.registration + ' which is a '+ f.modelLong +'</a>';
		}
		else{
			document.getElementById("planePicture").innerHTML='<img src="' + f.picture + '"><a>Serving suggestion of a ' + f.modelLong + ' <i class="fas fa-birthday-cake"></i></a>';
		}
	}
	else{
		document.getElementById("planePicture").innerHTML='There is no picture available';
	}
	document.getElementById("planeLink").innerHTML = '<a href="?plane=' + f.hex + '">' + urlBase + '/?plane=' + f.hex + '</a>';

	//Position
	if(typeof f.lat !== 'undefined'){
		if(f.fix == 'mlat'){
			document.getElementById("planeLatLon").innerHTML = '<span style="color:orange">' + f.lat + ' / ' + f.lon + '</span>';
		}
		else{
			document.getElementById("planeLatLon").innerHTML = f.lat + ' / ' + f.lon;
		}
	}
	else{
		document.getElementById("planeLatLon").innerHTML = 'n/a';
	}
	if(typeof f.track !== 'undefined'){
		//Hier gibt es nen 360=0° Bug
		var planeDirectionIndicator='';
		if(typeof planeDirectionOld !== 'undefined'){
			var planeDirectionDiff = f.track - planeDirectionOld;
			if(planeDirectionDiff < 0){
				planeDirectionIndicator='<i class="fas fa-undo-alt"></i>';
			}
			if(planeDirectionDiff > 0){
				planeDirectionIndicator='<i class="fas fa-redo-alt"></i>';
			}
		}
		planeDirectionOld = f.track;
		document.getElementById("planeTrack").innerHTML = /*'<i class="fa-solid fa-compass"></i> ' + */planeDirectionIndicator + ' ' + f.track + '°';
	}
	else{
		document.getElementById("planeTrack").innerHTML = 'n/a';
	}
	if(typeof f.lat !== 'undefined'){
		//document.getElementById("planeSeenPos").innerHTML = f.seen_pos + 's';
		//neue seen logik
		//cellRefresh("planeSeenPos", Math.round((Date.now()/1000-f.position?.timestamp)*10)/10 + 's');
		cellRefresh("planeSeenPos", secondsToReadable(Math.round((Date.now()/1000-f.position?.timestamp)*10)/10));

	}
	else{
		document.getElementById("planeSeenPos").innerHTML = 'n/a';
	}
	//Altitude
	if(typeof f.altitude !== 'undefined'){
		var planeAltitudeIndicator='';
		if(typeof planeAltitudeOld !== 'undefined'){
			var planeAltitudeDiff = f.altitude - planeAltitudeOld;
			if(planeAltitudeDiff < 0){
				planeAltitudeIndicator ='<i class="fas fa-caret-down"></i>';
			}
			if(planeAltitudeDiff > 0){
				planeAltitudeIndicator ='<i class="fas fa-caret-up"></i>';
			}
		}
		planeAltitudeOld = f.altitude;
		if(f.altitude != 'ground'){
			document.getElementById("planeAltitudeNowMetric").innerHTML = planeAltitudeIndicator + ' ' + ftToM(f.altitude) + 'm';
			document.getElementById("planeAltitudeNow").innerHTML = planeAltitudeIndicator + ' ' + f.altitude + 'ft';
		}
		else{
			document.getElementById("planeAltitudeNowMetric").innerHTML = 'ground';
			document.getElementById("planeAltitudeNow").innerHTML = 'ground';
		}
	}
	else{
		document.getElementById("planeAltitudeNowMetric").innerHTML = 'n/a';
		document.getElementById("planeAltitudeNow").innerHTML = 'n/a';
	}

	//nav altitude mcp
	if(typeof f['nav'] !== 'undefined' && typeof f['nav']['altitude'] !== 'undefined' && typeof f['nav']['altitude']['mcp'] !== 'undefined'){
		document.getElementById("planeNavAltitudeMcp").innerHTML = f['nav']['altitude']['mcp'] + 'ft';
	}
	else{
		document.getElementById("planeNavAltitudeMcp").innerHTML = 'n/a';
	}

	//nav altitude fms
	if(typeof f['nav'] !== 'undefined' && typeof f['nav']['altitude'] !== 'undefined' && typeof f['nav']['altitude']['fms'] !== 'undefined'){
		document.getElementById("planeNavAltitudeFms").innerHTML = f['nav']['altitude']['fms'] + 'ft';
	}
	else{
		document.getElementById("planeNavAltitudeFms").innerHTML = 'n/a';
	}

	//nav modes
	document.getElementById("planeNavModes").innerHTML = '';
	if(typeof f['nav'] !== 'undefined' && typeof f['nav']['modes'] !== 'undefined'){
		var modes = '';
		const obj = f['nav']['modes'];
		for (const [mode, value] of Object.entries(obj)){
			if(typeof mode !== 'undefined' && value){
				document.getElementById("planeNavModes").innerHTML += '<span class="minitag">' + mode + '</span>';
			}
		}

	}
	else{
		document.getElementById("planeNavModes").innerHTML = 'n/a';
	}


	//vert_rate
	if(typeof f.vert_rate !== 'undefined'){
		var planeVertrateIndicator='';
		if(f.vert_rate < 0){
				planeVertrateIndicator ='<i class="fas fa-caret-down"></i>';
			}
			if(f.vert_rate > 0){
				planeVertrateIndicator ='<i class="fas fa-caret-up"></i>';
			}
		document.getElementById("planeVertrateNowMetric").innerHTML = planeVertrateIndicator + ' ' + ftToM(f.vert_rate) + 'm/min';
		document.getElementById("planeVertrateNow").innerHTML = planeVertrateIndicator + ' ' + f.vert_rate + 'ft/min';
	}
	else{
		document.getElementById("planeVertrateNowMetric").innerHTML = 'n/a';
		document.getElementById("planeVertrateNow").innerHTML = 'n/a';
	}

	//heading
	if(typeof f['nav'] !== 'undefined' && typeof f['nav']['heading'] !== 'undefined'){
		document.getElementById("planeNavHeading").innerHTML = /*'<i class="fa-solid fa-computer"></i> ' + */f['nav']['heading'] + '°';
	}
	else{
		document.getElementById("planeNavHeading").innerHTML = 'n/a';
	}



	//speed
	if(typeof f.speed !== 'undefined'){
		var planeSpeedIndicator='';
		if(typeof vehicleSpeedOld !== 'undefined'){
			var planeSpeedDiff = f.speed - vehicleSpeedOld;
			if(planeSpeedDiff < 0){
				planeSpeedIndicator = '<i class="fas fa-caret-down"></i>';
			}
			if(planeSpeedDiff > 0){
				planeSpeedIndicator = '<i class="fas fa-caret-up"></i>';
			}
		}
		vehicleSpeedOld = f.speed;
		document.getElementById("planeSpeedNowMetric").innerHTML = planeSpeedIndicator + ' ' + ktToKmh(f.speed) + 'km/h';
		document.getElementById("planeSpeedNow").innerHTML = planeSpeedIndicator + ' ' + f.speed + 'kt';
	}
	else{
		document.getElementById("planeSpeedNowMetric").innerHTML = 'n/a';
		document.getElementById("planeSpeedNow").innerHTML = 'n/a';
	}
}

function shipInfoRefresh(f){
	//Info
	cellRefresh("shipId", f.mmsi);
//	document.getElementById("shipId").style='color:white';
	document.getElementById("shipId").style='';
	if(f.type !== 'undefined'){
		if(f.type == 'mil'){
			document.getElementById("shipId").style='color:#0f0';
		}
		if(f.type == 'int'){
			document.getElementById("shipId").style='color:#ff00c3';
		}
		if(f.type == 'bos'){
			document.getElementById("shipId").style='color:#f00';
		}
	}
	cellRefresh("shipName", f.shipname);
	cellRefresh("shipCallsign", f.callsign);
	cellRefresh("shipDestination", f.destination);
	cellRefresh("shipStatus", f.status);
	cellRefresh("shipStatusText", f.status_text);
	cellRefresh("shipType", f.shiptype);
	cellRefresh("shipTypeText", f.shiptype_text);
	cellRefresh("shipCountry", f.country);
	//cellRefresh("shipStation", f.station);


	if(typeof f.picture !== 'undefined'){
		document.getElementById("shipPicture").innerHTML='<img src="' + f.picture + '"><a>This is a picture of the ' + f.shipname + '</a>';
	}
	else{
		document.getElementById("shipPicture").innerHTML='There is no picture available';
	}

	var length = Math.abs(parseInt(f.to_bow) + parseInt(f.to_stern));
	cellRefresh("shipLength", length, 'm');
	var width = Math.abs(parseInt(f.to_port) + parseInt(f.to_starboard));
	cellRefresh("shipWidth", width, 'm');
	cellRefresh("shipDraught", f.draught, 'm');
	cellRefresh("shipEta", eta(f.eta));
	//console.log(f.to_bow + ' ' + f.to_stern + ' ' + length);

	cellRefresh("shipSeen", secondsToReadable(Math.abs(parseInt(Date.now()/1000) - parseInt(f.timestamp))));
	document.getElementById("shipLink").innerHTML = '<a href="?ship=' + f.mmsi + '">' + urlBase + '/?ship=' + f.mmsi + '</a>';

	//Position
	if(typeof f.lat !== 'undefined'){
		document.getElementById("shipLatLon").innerHTML = f.lat + ' / ' + f.lon;
	}
	else{
		document.getElementById("shipLatLon").innerHTML = 'n/a';
	}
	if(typeof f.course !== 'undefined'){
		//Hier gibt es nen 360=0° Bug
		var shipDirectionIndicator='';
		if(typeof vehicleDirectionOld !== 'undefined'){
			var shipDirectionDiff = f.track - vehicleDirectionOld;
			if(shipDirectionDiff < 0){
				shipDirectionIndicator='<i class="fas fa-undo-alt"></i>';
			}
			if(shipDirectionDiff > 0){
				shipDirectionIndicator='<i class="fas fa-redo-alt"></i>';
			}
		}
		vehicleDirectionOld = f.track;
		document.getElementById("shipCourse").innerHTML = f.course + '° COG' + shipDirectionIndicator;
	}
	else{
		document.getElementById("shipCourse").innerHTML = 'n/a';
	}

	if(typeof f.heading !== 'undefined'){
		//Hier gibt es nen 360=0° Bug
		var shipDirectionIndicator='';
		/*if(typeof vehicleDirectionOld !== 'undefined'){
			var shipDirectionDiff = f.track - vehicleDirectionOld;
			if(shipDirectionDiff < 0){
				shipDirectionIndicator='<i class="fas fa-undo-alt"></i>';
			}
			if(shipDirectionDiff > 0){
				shipDirectionIndicator='<i class="fas fa-redo-alt"></i>';
			}
		}
		vehicleDirectionOld = f.track;*/
		document.getElementById("shipHeading").innerHTML = f.heading + '° HDG' + shipDirectionIndicator;
	}
	else{
		document.getElementById("shipHeading").innerHTML = 'n/a';
	}

	//Speed
	if(typeof f.speed !== 'undefined'){
		var shipSpeedIndicator='';
		if(typeof vehicleSpeedOld !== 'undefined'){
			var shipSpeedDiff = f.speed - vehicleSpeedOld;
			if(shipSpeedDiff < 0){
				shipSpeedIndicator = '<i class="fas fa-caret-down"></i>';
			}
			if(shipSpeedDiff > 0){
				shipSpeedIndicator = '<i class="fas fa-caret-up"></i>';
			}
		}
		vehicleSpeedOld = f.speed;
		document.getElementById("shipSpeedNowMetric").innerHTML = ktToKmh(f.speed) + 'km/h ' + shipSpeedIndicator;
		document.getElementById("shipSpeedNow").innerHTML = f.speed + 'kt ' + shipSpeedIndicator;
	}
	else{
		document.getElementById("shipSpeedNowMetric").innerHTML = 'n/a';
		document.getElementById("shipSpeedNow").innerHTML = 'n/a';
	}


/*
	if(typeof f.picture !== 'undefined'){
		document.getElementById("shipPicture").innerHTML='<img src="' + f.picture + '">';
		if(f.picture.includes("aircraft")){
			document.getElementById("shipDescription").innerHTML='This is a picture of ' + f.registration + ' which is a '+ f.modelLong;
		}
		else{
			document.getElementById("shipDescription").innerHTML='Serving suggestion of a ' + f.modelLong + ' <i class="fas fa-birthday-cake"></i>';
		}
	}
	else{
		document.getElementById("shipPicture").innerHTML='There is no picture available';
		document.getElementById("shipDescription").innerHTML='';
	}
	*/

/*
*/
}

function radiosondeInfoRefresh(){
	//clear all the stuff
	var r=radiosondeSelectedData;
//	cellRefresh("radiosondeSeen", secondsToReadable(Math.round(Date.now()/1000-r.timestamp)));
	cellRefresh("radiosondeSeen", secondsToReadable(timeFromNow(r.timestamp)));

	cellRefresh("radiosondeId", id);
	
	if(r.hasOwnProperty("launchsite")){
		if(r.launchsite.hasOwnProperty("type")){
			if(r.launchsite.type !== 'undefined'){
				//hier mal was mit type to color machen auch bei schiff und plane?
				if(r.launchsite.type == 'mil'){
					document.getElementById("radiosondeId").style='color:#0f0';
				}
				if(r.launchsite.type == 'int'){
					document.getElementById("radiosondeId").style='color:#ff00c3';
				}
				if(r.launchsite.type == 'bos'){
					document.getElementById("radiosondeId").style='color:#f00';
				}
			}
		}
		else{
			document.getElementById("radiosondeId").style='color:#fff';
		}
	}
	else{
		document.getElementById("radiosondeId").style='color:#fff';
	}
	
	cellRefresh("radiosondeFrame", r.frame);
	

	cellRefresh("radiosondeVendor", r.vendor);
	cellRefresh("radiosondeModel", r.type);
	
	//cellRefresh("radiosondeUptime", secondsToReadable(r.frame));
	cellRefresh("radiosondeUptime", secondsToReadable(timeFromNow(r.uptime)));
	//cellRefresh("radiosondeKilltimer", r.burst_timer);
	cellRefresh("radiosondeKilltimer", secondsToReadable(timeFromNow(r.burst_timer)));
	//launchsite
	if(r.hasOwnProperty("launchsite")){
		if(r.launchsite.hasOwnProperty("operator")){
			cellRefresh("radiosondeLaunchsiteOperator", r.launchsite.operator);
		}
		if(r.launchsite.hasOwnProperty("name")){
			cellRefresh("radiosondeLaunchsiteName", '<a onclick="launchsiteSelect(\'' + r.launchsite.name + '\')">' + r.launchsite.name + '</a>');
			//document.getElementById("radiosondeLaunchsiteName").onclick="launchsiteSelect(r.launchsite.name)";	
		}
		if(r.launchsite.hasOwnProperty("distance")){
			cellRefresh("radiosondeLaunchsiteDistance", r.launchsite.distance + "km");
		}
	}
	else{
		cellRefresh("radiosondeLaunchsiteOperator", "n/a");
		cellRefresh("radiosondeLaunchsiteName", "n/a");
		cellRefresh("radiosondeLaunchsiteDistance", "n/a");
	}

	//firstcontact
	if(r.hasOwnProperty("firstcontact")){
		if(r.firstcontact.hasOwnProperty("frame")){
			cellRefresh("radiosondeFirstcontactFrame", "#" + r.firstcontact.frame);
		}
		if(r.firstcontact.hasOwnProperty("timestamp")){
			document.getElementById("radiosondeFirstcontactTimestamp").innerHTML = tsToReadable(r.firstcontact.timestamp);
		}
		else{
			document.getElementById("radiosondeFirstcontactTimestamp").innerHTML = 'n/a';
		}
		if(r.firstcontact.hasOwnProperty("alt")){
			cellRefresh("radiosondeFirstcontactAltitude", Math.round(r.firstcontact.alt) + "m");
		}
		if(r.firstcontact.hasOwnProperty("station")){
			cellRefresh("radiosondeFirstcontactStation", '<a onclick="stationSelect(\'' + r.firstcontact.station + '\')">' + r.firstcontact.station + '</a>');
		}
	}	

	//burst
	if(r.hasOwnProperty("burst")){
		if(r.burst.hasOwnProperty("frame")){
			cellRefresh("radiosondeBurstFrame", "#" + r.burst.frame);
			document.getElementById("radiosondeBurstTimestamp").innerHTML = tsToReadable(r.burst.timestamp);
			cellRefresh("radiosondeBurstAltitude", r.burst.alt, 'm');

			if(typeof burstmarker === 'undefined' || !map.hasLayer(burstmarker)) {
				//burstmarker
				feature = {
					"geometry": {
						"type": "Point",
						"coordinates": [r.burst.lat, r.burst.lon]
					},
					"type": "Feature",
					"properties": {
						"altitude":r.burst.alt,
						"fillColor":landingpointToColor(0),
						"zIndexOffset":r.burst.alt-99990,
						"marker": "burst"
					}
				};
				burstmarker = radiosondeMarker(feature).addTo(map);
			} else {
				burstmarker.setLatLng([r.burst.lat, r.burst.lon]);
			}

		}
		else{
			cellRefresh("radiosondeBurstFrame", "n/a");
			cellRefresh("radiosondeBurstTimestamp", "n/a");
			cellRefresh("radiosondeBurstAltitude", "n/a");
			if(typeof burstmarker !== 'undefined') {
				burstmarker.remove();
			}
		}
	}
	else{
			cellRefresh("radiosondeBurstFrame", "n/a");
			cellRefresh("radiosondeBurstTimestamp", "n/a");
			cellRefresh("radiosondeBurstAltitude", "n/a");
			if(typeof burstmarker !== 'undefined') {
				burstmarker.remove();
			}
		}
	
	//temp
	if(r.hasOwnProperty("temp")){
		const tempMin = -80;
		const tempMax = 80;
		const tempRange = (tempMax-tempMin);
		var tempPerc = (r.temp-tempMin)/tempRange*100;
		var color = '#2b72d7';
		var text = 'white';
		document.getElementById("radiosondeTemperature").innerHTML = '<div id="radiosondeTemperatureBar" class="loadbar" style="background:linear-gradient(to right, ' + color + ' ' + tempPerc + '%, rgba(57, 63, 76, 0.82) ' + tempPerc + '%); color:' + text + '">' + r.temp + '°C</div>';
	}
	else{
		document.getElementById("radiosondeTemperature").innerHTML = '<div id="radiosondeTemperatureBar" class="loadbar">n/a</div>';
	}

	//humidity
	if(r.hasOwnProperty("humidity")){
		const humidityMin = 0;
		const humidityMax = 100;
		const humidityRange = (humidityMax-humidityMin);
		var humidityPerc = (r.humidity-humidityMin)/humidityRange*100;
		var color = '#2b72d7';
		var text = 'white';
		document.getElementById("radiosondeHumidity").innerHTML = '<div id="radiosondeHumidityBar" class="loadbar" style="background:linear-gradient(to right, ' + color + ' ' + humidityPerc + '%, rgba(57, 63, 76, 0.82) ' + humidityPerc + '%); color:' + text + '">' + r.humidity + '%</div>';
	}
	else{
		document.getElementById("radiosondeHumidity").innerHTML = '<div id="radiosondeHumidityBar" class="loadbar">n/a</div>';
	}

	//pressure
	if(r.hasOwnProperty("pressure")){
		const pressureMin = 0;
		const pressureMax = 1000;
		const pressureRange = (pressureMax-pressureMin);
		var pressurePerc = (r.pressure-pressureMin)/pressureRange*100;
		var color = '#2b72d7';
		var text = 'white';
		document.getElementById("radiosondePressure").innerHTML = '<div id="radiosondePressureBar" class="loadbar" style="background:linear-gradient(to right, ' + color + ' ' + pressurePerc + '%, rgba(57, 63, 76, 0.82) ' + pressurePerc + '%); color:' + text + '">' + r.pressure + 'hPa</div>';
	}
	else{
		document.getElementById("radiosondePressure").innerHTML = '<div id="radiosondePressureBar" class="loadbar">n/a</div>';
	}

	//voltage
	/*if(r.hasOwnProperty("batt_v")){
		const voltageMax = 4.0;
		const voltageWarn = 2.4;
		const voltageMin = 2.0;
		const voltageRange = (voltageMax-voltageMin);
		var voltagePerc = (r.batt_v-voltageMin)/voltageRange*100;
		if(r.batt_v > voltageWarn){
			var color = '#2b72d7';
			var text = 'white';
		}
		else{
			var color = 'orange';
			//var text = 'black';
		}
		document.getElementById("radiosondeVoltage").innerHTML = '<div id="radiosondeVoltageBar" class="loadbar" style="background:linear-gradient(to right, ' + color + ' ' + voltagePerc + '%, rgba(57, 63, 76, 0.82) ' + voltagePerc + '%); color:' + text + '">' + r.batt_v + 'V</div>';
	}
	else{
		document.getElementById("radiosondeVoltage").innerHTML = '<div id="radiosondeVoltageBar" class="loadbar">n/a</div>';
	}*/
	
	if(r.hasOwnProperty("batt")){
		//min
		if(r.batt.hasOwnProperty("voltageMin")){
			var voltageMin = r.batt.voltageMin;
		}
		else{
			var voltageMin = 2.0;
		}
		//warn
		if(r.batt.hasOwnProperty("voltageWarn")){
			var voltageWarn = r.batt.voltageWarn;
		}
		else{
			var voltageWarn = 2.4;
		}
		//max
		if(r.batt.hasOwnProperty("voltageMax")){
			var voltageMax = r.batt.voltageMax;
		}
		else{
			var voltageMax = 4.0;
		}
		
		var voltageRange = (voltageMax-voltageMin);
		var voltagePerc = (r.batt.voltage-voltageMin)/voltageRange*100;
		if(r.batt.voltage > voltageWarn){
			var color = '#2b72d7';
			var text = 'white';
		}
		else{
			var color = 'orange';
			//var text = 'black';
		}
		document.getElementById("radiosondeVoltage").innerHTML = '<div id="radiosondeVoltageBar" class="loadbar" style="background:linear-gradient(to right, ' + color + ' ' + voltagePerc + '%, rgba(57, 63, 76, 0.82) ' + voltagePerc + '%); color:' + text + '">' + r.batt.voltage + 'V</div>';
	}
	else{
		document.getElementById("radiosondeVoltage").innerHTML = '<div id="radiosondeVoltageBar" class="loadbar">n/a</div>';
	}

	//link
	document.getElementById("radiosondeLink").innerHTML = '<a href="?radiosonde=' + id + '">' + urlBase + '/?radiosonde=' + id + '</a>';
	
	
	//position
	if(typeof r.lat !== 'undefined'){
		document.getElementById("radiosondeLatLon").innerHTML = r.lat + ' / ' + r.lon;
	}
	else{
		document.getElementById("radiosondeLatLon").innerHTML = 'n/a';
	}

	if(radiosondeSelectedAltMax < r.alt){
		radiosondeSelectedAltMax=r.alt;
	}

	var radiosondeAltitudeIndicator = '';
	if(r.vel_v < 0){
		var radiosondeAltitudeIndicator = '<i class="fas fa-caret-down"></i> ';
	}
	if(r.vel_v > 0){
		var radiosondeAltitudeIndicator = '<i class="fas fa-caret-up"></i> ';
	}

	if(typeof r.alt !== 'undefined'){
		//cellRefresh("radiosondeAltitudeNow", radiosondeAltitudeIndicator + mToFt(r.alt), 'ft');
		cellRefresh("radiosondeAltitudeNowMetric", radiosondeAltitudeIndicator + r.alt, 'm');
	}
	else{
		//cellRefresh("radiosondeAltitudeNow");
		cellRefresh("radiosondeAltitudeNowMetric");
	}


	cellRefresh("radiosondeVertrateNowMetric", r.vel_v, 'm/s', 2);

	cellRefresh("radiosondeVertrateMinMetric", r.min_vel_v, 'm/s', 2);
	cellRefresh("radiosondeVertrateMaxMetric", r.max_vel_v, 'm/s', 2);
	
	//avg vel_v
	cellRefresh("radiosondeVertrateAvgMetric", r.avg_vel_v, 'm/s', 2);

	//vel_h
	cellRefresh("radiosondeSpeedNowMetric", msToKmh(r.vel_h), 'km/h');
	cellRefresh("radiosondeSpeedMinMetric", msToKmh(r.min_vel_h), 'km/h', 2);
	cellRefresh("radiosondeSpeedMaxMetric", msToKmh(r.max_vel_h), 'km/h', 2);
	//cellRefresh("radiosondeSpeedNow", kmhToKt(msToKmh(r.vel_h)), 'kt');

	cellRefresh("radiosondeHeading", r.heading, '°');

	cellRefresh("radiosondeSats", r.sats);

	//stations

	cellRefresh("radiosondeStationsCount", r.hasOwnProperty("stations") ? Object.keys(r.stations).length : undefined );

	//console.log(r.stations);
	document.getElementById("radiosondeStationsTableBody").innerHTML = '';

	if(r.hasOwnProperty("stations")) {
		Object.keys(r.stations).forEach(
			function station(sid){
				document.getElementById("radiosondeStationsTableBody").innerHTML += '<tr onclick="stationSelect(\''+ sid +'\')"><td>' + sid + '</td><td>' + secondsToReadable(timeFromNow(r.stations[sid]['timestamp'])) + '</td><td>' + r.stations[sid]['distance'] + 'km</td><td>' + r.stations[sid]['snr'] + 'dB</td></tr>';
				cellRefresh("radiosondeFrequency", Math.round(r['freq_mhz']*100)/100, 'Mhz');
			}
		)
	}

	//Load prediction from server

	//liveprediction
	if(!r.predictiontimestamp || !predictionTrack?.metadata?.timestamp || r.predictiontimestamp > predictionTrack?.metadata?.timestamp+1) {
		predictionTrackGroup.clearLayers();

		fetchController = new AbortController();
		fetch("https://radiosonde.api.sdrmap.org/liveprediction/"+ id +".json", { signal: fetchController.signal })
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			globalThis.predictionTrack = data;

			var meta = data.metadata;
			r.predictiontimestamp = meta.timestamp;
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
						"fillColor": landingpointToColor(0),
//						"fillColor": altitudeToColor(mToFt(meta.burst.alt)),
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
			if(typeof predictionTrack !== "undefined") {
				cellRefresh("radiosondePredictionSeen", secondsToReadable(Math.round(Date.now()/1000-predictionTrack.metadata.timestamp)));
				cellRefresh("radiosondePredictionLatLon", Math.round(predictionTrack.metadata.landingpoint.lat*100000)/100000 + '/' + Math.round(predictionTrack.metadata.landingpoint.lon*100000)/100000);
				cellRefresh("radiosondePredictionAltitude", metersToReadable(Math.round(predictionTrack.metadata.landingpoint.alt)));
				cellRefresh("radiosondePredictionTimestamp", tsToReadable(predictionTrack.metadata.landingpoint.timestamp));
				cellRefresh("radiosondePredictionTime", secondsToReadable(Math.round(predictionTrack.metadata.landingpoint.timestamp-Date.now()/1000)));
				cellRefresh("radiosondePredictionDistance", metersToReadable(map.distance([predictionTrack.metadata.landingpoint.lat,predictionTrack.metadata.landingpoint.lon],[r.lat,r.lon])));
				if(!r.hasOwnProperty("burst")){
					cellRefresh("radiosondeBurstPredictionTimestamp", tsToReadable(predictionTrack.metadata.burst.timestamp));
					cellRefresh("radiosondeBurstPredictionTime", secondsToReadable(Math.round(predictionTrack.metadata.burst.timestamp-Date.now()/1000)));
					cellRefresh("radiosondeBurstPredictionAltitude", Math.round(predictionTrack.metadata.burst.alt), "m");
				}
				else{
					cellRefresh("radiosondeBurstPredictionTimestamp");
					cellRefresh("radiosondeBurstPredictionTime");
					cellRefresh("radiosondeBurstPredictionAltitude");
				}
				
			}
			else {
				cellRefresh("radiosondePredictionSeen");
				cellRefresh("radiosondePredictionLatLon");
				cellRefresh("radiosondePredictionAltitude");
				cellRefresh("radiosondePredictionTimestamp");
				cellRefresh("radiosondePredictionTime");
				cellRefresh("radiosondePredictionDistance");
			}
		}).catch((error) => {  });
	}
	else{
		cellRefresh("radiosondePredictionSeen", secondsToReadable(Math.round(Date.now()/1000-predictionTrack.metadata.timestamp)));
	}

}

function radiosondeGraphsRefresh() {
	document.getElementById("radiosondeGraphRid").innerHTML = 'Radiosonde ' + id;

	var radiosondeGraphsData = [];

	if(Chart.getChart("radiosondeGraphAltitude") !== undefined) {
		Chart.getChart("radiosondeGraphAltitude").destroy();
	}

	if(Chart.getChart("radiosondeGraphTemperature") !== undefined) {
		Chart.getChart("radiosondeGraphTemperature").destroy();
	}

	if(Chart.getChart("radiosondeGraphVelocity") !== undefined) {
		Chart.getChart("radiosondeGraphVelocity").destroy();
	}

	if(Chart.getChart("radiosondeGraphSysinfo") !== undefined) {
		Chart.getChart("radiosondeGraphSysinfo").destroy();
	}

	//Load history from server
	//fetch(urlBase + '/data/radiosondeTrack.php?radiosonde=' + id)
	fetch('https://radiosonde.api.sdrmap.org/history/' + id + '.json')
		.then(function(response) {
			return response.json();
	})
	.then(function(data) {
		Object.values(data.geojson.features).forEach(
			function feature(feature){
				var d = new Date(feature.properties.timestamp*1000);
				var h = d.getHours()+1;
				if(h < 10){
					h = '0' + h;
				}
				var m = d.getMinutes();
				if(m < 10){
					m = '0' + m;
				};
				var temperature;
				if(feature.properties.temp > -100){
					temperature = feature.properties.temp;
				}
				/*else{
					temperature = 0;
				}*/
				var speed = feature.properties.vel_h*3600/1000;
				radiosondeGraphsData.push({
					//timestamp: d.getDate() + '.' + (d.getMonth()+1) + '. ' + h + ':' + m,
					timestamp: feature.properties.timestamp*1000,
					altitude: feature.properties.altitude,
					temperature: temperature,
					humidity: feature.properties.humidity,
					pressure: feature.properties.pressure,
					vel_v: feature.properties.vel_v,
					vel_h: speed,
					sats: feature.properties.sats,
					batt_v: feature.properties.batt_v
				});
			}
		);
		//radiosondeGraphsData.reverse();
//console.log(radiosondeGraphsData);

		let width, height, gradient;
		function getGradient(ctx, chartArea) {
			const chartWidth = chartArea.right - chartArea.left;
			const chartHeight = chartArea.bottom - chartArea.top;
			if (!gradient || width !== chartWidth || height !== chartHeight) {
				// Create the gradient because this is either the first render
				// or the size of the chart has changed
				width = chartWidth;
				height = chartHeight;
				gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);

				function ftToGradientStop(ft){
					return ft/3.28269/50000;
				}

				gradient.addColorStop(0, '#3388ff');
				gradient.addColorStop(0.000001, '#767676');
				gradient.addColorStop(ftToGradientStop(500), '#a52a2a');
				gradient.addColorStop(ftToGradientStop(1500), '#d97012');
				gradient.addColorStop(ftToGradientStop(2500), '#ffa500');
				gradient.addColorStop(ftToGradientStop(3750), '#ffcc00');
				gradient.addColorStop(ftToGradientStop(5250), '#ff0');
				gradient.addColorStop(ftToGradientStop(6750), '#afda21');
				gradient.addColorStop(ftToGradientStop(8250), '#45a94d');
				gradient.addColorStop(ftToGradientStop(9750), '#51b67b');
				gradient.addColorStop(ftToGradientStop(11250), '#61c7b8');
				gradient.addColorStop(ftToGradientStop(12750), '#4dacd6');	
				gradient.addColorStop(ftToGradientStop(14250), '#3388ff');
				gradient.addColorStop(ftToGradientStop(49240), '#5364ff');
				gradient.addColorStop(ftToGradientStop(65654), '#6a48ff');
				gradient.addColorStop(ftToGradientStop(82067), '#8b24ff');
				gradient.addColorStop(ftToGradientStop(98481), '#aa00ff');
				gradient.addColorStop(1, '#aa00ff');
			}
			
		return gradient;
		}

		new Chart(
			document.getElementById('radiosondeGraphAltitude'),
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
						altitude: {
							position: 'left',
							title: {
									display: true,
									text: 'Altitude m',
									color: 'white'
								},
							min: 0,
							max: 50000,
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
						pressure: {
							position: 'right',
							title: {
									display: true,
									text: 'Pressure hPa',
									color: 'white'
								},
							min: 0,
							max: 1000,
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
								},
								unit: 'minute',
//								stepSize: 3600000
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
							text: 'Radiosonde ' + id,
							color: 'white'
						},
						subtitle: {
							display: true,
							text: 'Altitude and Pressure',
							color: 'white'
						}
					}
				},
				plugins: [vLine],
				data: {
					labels: radiosondeGraphsData.map(row => row.timestamp),
					datasets: [
						{
							yAxisID: 'altitude',
							label: 'Altitude',
							data: radiosondeGraphsData.map(row => row.altitude),
							//borderColor: '#0f0',
							//backgroundColor: '#0f0'
							//borderColor: '#2b72d7',
							borderColor: function(context) {
								const chart = context.chart;
								const {ctx, chartArea} = chart;

								if (!chartArea) {
									// This case happens on initial chart load
									return;
								}
								return getGradient(ctx, chartArea);
							},
							//backgroundColor: '#2b72d7'
							backgroundColor: function(context) {
								const chart = context.chart;
								const {ctx, chartArea} = chart;

								if (!chartArea) {
									// This case happens on initial chart load
									return;
								}
								return getGradient(ctx, chartArea);
							}
						},
						{
							yAxisID: 'pressure',
							label: 'Pressure',
							data: radiosondeGraphsData.map(row => row.pressure),
							borderColor: 'white',
							backgroundColor: 'white'
						},
					]
				}
			}
		);

		new Chart(
			document.getElementById('radiosondeGraphTemperature'),
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
						temp: {
							position: 'left',
							min: -100,
							max: 100,
							title: {
									display: true,
									text: 'Temperature °C',
									color: 'white'
								},
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
						perc: {
							position: 'right',
							min: 0,
							max: 100,
							title: {
									display: true,
									text: 'Humidity %',
									color: 'white'
								},
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
								},
								unit: 'minute',
//								stepSize: 3600000
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
							text: 'Radiosonde ' + id,
							color: 'white'
						},
						subtitle: {
							display: true,
							text: 'Temperature and Humidity',
							color: 'white'
						}
					}
				},
				plugins: [vLine],
				data: {
					labels: radiosondeGraphsData.map(row => row.timestamp),
					datasets: [
						{
							yAxisID: 'temp',
							label: 'Temperature',
							data: radiosondeGraphsData.map(row => row.temperature),
							borderColor: '#2b72d7',
							backgroundColor: '#2b72d7'
						},
						{
							yAxisID: 'perc',
							label: 'Humidity',
							data: radiosondeGraphsData.map(row => row.humidity),
							borderColor: 'white',
							backgroundColor: 'white'
						}
					]
				}
			}
		);

		new Chart(
			document.getElementById('radiosondeGraphVelocity'),
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
						horizontal: {
							position: 'left',
							min: 0,
							max: 300,
							title: {
									display: true,
									text: 'Velocity horizontal km/h',
									color: 'white'
								},
							//min: 0,
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
						vertical: {
							min:-90,
							max: 30,
							position: 'right',
							title: {
									display: true,
									text: 'Velocity vertical m/s',
									color: 'white'
								},
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
							position: 'bottom',
							type: 'time',
							time: {
								tooltipFormat: 'D.M. HH:mm',
								displayFormats: {
									minute: 'D.M. HH:mm'
								},
								unit: 'minute',
//								stepSize: 3600000
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
							text: 'Radiosonde ' + id,
							color: 'white'
						},
						subtitle: {
							display: true,
							text: 'Velocity',
							color: 'white'
						}
					}
				},
				plugins: [vLine],
				data: {
					labels: radiosondeGraphsData.map(row => row.timestamp),
					datasets: [
						{
							yAxisID: 'horizontal',
							label: 'Horizontal',
							data: radiosondeGraphsData.map(row => row.vel_h),
							borderColor: '#2b72d7',
							backgroundColor: '#2b72d7'
						},
						{
							yAxisID: 'vertical',
							label: 'Vertical',
							data: radiosondeGraphsData.map(row => row.vel_v),
							borderColor: 'white',
							backgroundColor: 'white'
						}
					]
				}
			}
		);

		new Chart(
			document.getElementById('radiosondeGraphSysinfo'),
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
						satellites: {
							position: 'left',
							min: 0,
							max: 20,
							title: {
									display: true,
									text: 'Satellites',
									color: 'white'
								},
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
						voltage: {
							position: 'right',
							title: {
									display: true,
									text: 'Battery V',
									color: 'white'
								},
							min: 0,
							max: 10,
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
								},
								unit: 'minute',
//								stepSize: 3600000
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
							text: 'Radiosonde ' + id,
							color: 'white'
						},
						subtitle: {
							display: true,
							text: 'Satellites and Battery',
							color: 'white'
						}
					}
				},
				plugins: [vLine],
				data: {
					labels: radiosondeGraphsData.map(row => row.timestamp),
					datasets: [
						{
							yAxisID: 'satellites',
							label: 'Satellites',
							data: radiosondeGraphsData.map(row => row.sats),
							borderColor: '#2b72d7',
							backgroundColor: '#2b72d7'
						},
						{
							yAxisID: 'voltage',
							label: 'Battery',
							data: radiosondeGraphsData.map(row => row.batt_v),
							borderColor: 'white',
							backgroundColor: 'white'
						}
					]
				}
			}
		);

	});



}


function eta(e){
	if(typeof e === 'undefined'){
		return "n/a";
	}
	//05-27T20:00Z
	var split = e.split("-");
	var splitMonth = split[0];
	var split2 = split[1].split("T");
	var splitDay = split2[0];
	var split3 = split2[1].split("Z");
	var splitTime = split3[0];
	return splitDay + "." + splitMonth + " " + splitTime;
}
