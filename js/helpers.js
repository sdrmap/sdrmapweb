/****************************************/
/************Helper functions************/
/****************************************/
//typeToColor
function typeToColor(alt = null, type = null){
	if(type == 'bos'){
		return '#f00';
	}else if(type == 'mil'){
		return '#0f0';
	}else if(type == 'int'){
		return '#ff00c3';
	}else if(type == 'his'){
		return '#00000000';
	} else if(type == 'sel') {
		return 'orange';
	}else if(alt == 'white'){
		return 'white';
	}else{
		return altitudeToColor(alt);
	}
}

//altitudeToColor
function altitudeToColor(alt){
	//https://stackoverflow.com/questions/6665997/switch-statement-for-greater-than-less-than
	if(alt == null) {
		return "#3388ff";
	}
	if(alt <= 0){
		return '#767676';
	}else if(alt <= 1000){
		return '#a52a2a';
	}else if(alt <= 2000){
		return '#d97012';
	}else if(alt <= 3000){
		return '#ffa500';
	}else if(alt <= 4500){
		return '#ffcc00';
	}else if(alt <= 6000){
		return '#ff0';
	}else if(alt <= 7500){
		return '#afda21';
	}else if(alt <= 9000){
		return '#45a94d';
	}else if(alt <= 10500){
		return '#51b67b';
	}else if(alt <= 12000){
		return '#61c7b8';
	}else if(alt <= 13500){
		return '#4dacd6';
	}else if(alt <= 49240){
		return '#3388ff';
	}else if(alt <= 65654){
		return '#5364ff';
	}else if(alt <= 82067){
		return '#6a48ff';
	}else if(alt <= 98481){
		return '#8b24ff';
	}else if(alt <= 164135){
		return '#aa00ff';
	}else if(alt == 'ground'){
		return '#767676';
	}else if(alt == 'water'){
		return '#3388ff';
	}
	return '#3388ff';
}
//landingpointToColor
function landingpointToColor(lp){
	if(lp == 0) {
		return '#a52a2a';
	}else if(lp == 1){
		return '#ffa500';
	}else if(lp == 2){
		return '#ff0';
	}else if(lp == 3){
		return '#45a94d';
	}else if(lp == 4){
		return '#61c7b8';
	}else if(lp == 5){
		return '#3388ff';
	}else if(lp == 6){
		return '#6a48ff';
	}else if(lp == 7){
		return '#aa00ff';
	}
	return '#fff';
}

//mlat sync to color
function syncToColor(syncs) {
	if(syncs < 5){
		return "#f00"
	}else if(syncs < 10){
		return "#ff8000"
	}else if(syncs < 15){
		return "#ff0"
	}else if(syncs >= 15){
		return "#0f0"
	}
}

//
function fixToIcon(f){
	var fix="<i class='fas fa-times-circle' title='None - no position available'></i>";
	if(f === 'true'){
		fix="<i class='fas fa-check-circle' title='Fix - position received'></i>";
	}
	if(f === 'mlat'){
		fix="<i class='fas fa-compass mlat-compass' title='MLAT - approximate position calculated via MLAT'></i>";
	}
	if(f === 'nomlat'){
		fix="<i class='fas fa-compass nomlat-compass' title='No MLAT - receiving station is MLAT enabled, but is not used for position calculation'></i>";
	}
	if(f === 'all'){
		fix="all";
	}
	return fix;
}

//
function uptimeToIcon(f){
	var icon="<i class='fas fa-clock' style='color:grey' title='None - no uptime available'></i>";
	if(f == 'now'){
		icon="<i class='fas fa-clock' style='color:#0f0' title='Station is online'></i>";
	} else {
		icon="<i class='fas fa-clock' style='color:red' title='Station is offline. Last seen " + f + "'></i>";
	}
	return icon;
}

function timestampsToIcon(t){
	//console.log(t);
	var icon="<i class='fas fa-clock' style='color:red' title='Station is offline'></i>";
	var status = '';
	if(typeof t.feeder !== 'undefined' && t.feeder > 0){
		if(timeFromNow(t.feeder) < 90) {
			status += 'online';
		}
		else{
			status += 'offline';
		}
	}

	if(typeof t.adsb !== 'undefined' && t.adsb > 0){
		if(timeFromNow(t.adsb) < 30) {
			status += 'online';
		}
		else{
			status += 'offline';
		}
	}

	if(typeof t.mlat !== 'undefined' && t.mlat > 0){
		if(timeFromNow(t.mlat) < 90) {
			status += 'online';
		}
		else{
			status += 'offline';
		}
	}

	if(typeof t.ais !== 'undefined' && t.ais > 0){
		if(timeFromNow(t.ais) < 3600) {
			status += 'online';
		}
		else{
			status += 'offline';
		}
	}

	if(typeof t.radiosonde !== 'undefined' && t.radiosonde > 0){
		if(timeFromNow(t.radiosonde) < 86400) {
			status += 'online';
		}
		else{
			status += 'offline';
		}
	}

	//console.log(status);
	if(status.includes('online')){
		icon="<i class='fas fa-clock' style='color:#0f0' title='Station is online'></i>";
		if(status.includes('offline')){
			icon="<i class='fas fa-clock' style='color:yellow' title='Station is partially online'></i>";
		}
	}
	return icon;
}

//
function ftToM(ft){
	if(isNaN(ft)){
		return ft;
	}
	return Math.round(ft/3.28269)
}

function mToFt(m){
	if(isNaN(m)){
		return m;
	}
	return Math.round(m*3.28269)
}

function msToKmh(ms){
	if(isNaN(ms)){
		return ms;
	}
	return Math.round(ms*3.6)
}

function mToKm(m){
	if(isNaN(m)){
		return m;
	}
	return Math.round(m*1.609)
}

function ktToKmh(kt){
	if(isNaN(kt)){
		return kt;
	}
	return Math.round(kt*1.85106)
}

function kmhToKt(kmh){
	if(isNaN(kmh)){
		return kmh;
	}
	return Math.round(kmh/1.85106)
}

function typeToLong(type){
	if(type == 'mil'){
		return 'military';
	}else if(type == 'int'){
		return 'interesting';
	}else if(type == 'bos'){
		return 'police and rescue';
	}else
	return 'unknown';
}

//planeIcon
function planeMarker(feature, instance = true){

	//vars
	var model = feature.properties.model;
	var category = feature.properties.category;
	var marker = markers['aircrafts']['default'];

	//Check for 
	if(model in markers['aircrafts']){
		marker = markers['aircrafts'][model];
	}
	else{
		if(category in markers['categorys']){
			marker = markers['categorys'][category];
		}
	}

	//stroke selected
	var stroke = "#000";
	var strokeWidth = 1;
	var filter = '';
	//console.log(feature);
	
	var options = {
				radius: marker.size[0]/2,
				zIndexOffset: feature.properties.altitude == "ground" ? 0 : feature.properties.altitude,
				fillColor: typeToColor(feature.properties.altitude, feature.properties.type),
				rotation: feature.properties.track,
				marker: marker,
				renderer: vehicleRenderer,
				bubblingMouseEvents: true,
				shadowColor: (feature.properties.id == id ? "black" : null),
				shadowBlur: (feature.properties.id == id ? 15 : 0),
				opacity: feature.properties.opacity
	};

	const coords = feature.geometry.coordinates;

	if(instance) {
		return new Path2DMarker([coords[1], coords[0]], options);
	} else {
		return options;
	}
}

//shipIcon
function shipMarker(feature, instance = true){

	var model = feature.properties.model;
	const coords = feature.geometry.coordinates;
	
	if(typeof model === "undefined") {
		if(feature.properties.track==511){
			//Default für Schiff ohne Ausrichtung
			model = "shipnotrack";
		}else{
			//Default für Schiff mit Ausrichtung
			model = "ship";
		}
	}

	var altitude = 'water';
	if(feature.properties.statusLong=='Moored' || feature.properties.statusLong=='At anchor'){
		altitude='ground';
	}

	var scaled = false;
	const length = parseInt(feature.properties.to_bow)+parseInt(feature.properties.to_stern);

	if(map.getZoom() >= 15 && length >= 100  && model == "ship" && feature.properties.track !== 511) {
		scaled = true;
	}
	if(map.getZoom() >= 16 && length >= 25  && model == "ship" && feature.properties.track !== 511) {
		scaled = true;
	}
	if(map.getZoom() >= 18 && model == "ship" && feature.properties.track !== 511) {
		scaled = true;
	}

	let options = { type: scaled ? "scaledShipMarker" : "shipMarker",
			radius: markers['marine'][model].size[0]/2,
			zIndexOffset: parseInt(feature.properties.altitude),
			fillColor: typeToColor(altitude, feature.properties.type),
			color: "#000",
			weight: 0,
			opacity: feature.properties.opacity,
			fillOpacity: 0.9,
			rotation: (feature.properties.track != 511 ? feature.properties.track : 0),
			marker: markers['marine'][model],
			renderer: vehicleRenderer,
			bubblingMouseEvents: false,
			shadowColor: (feature.properties.id == id ? "black" : null),
			shadowBlur: (feature.properties.id == id ? 15 : 0),
			dimensions: scaled ? { to_bow: metersInPixel(coords[1],feature.properties.to_bow,map.getZoom()), to_stern: metersInPixel(coords[1],feature.properties.to_stern,map.getZoom()), to_port: metersInPixel(coords[1],feature.properties.to_port,map.getZoom()), to_star: metersInPixel(coords[1],feature.properties.to_starboard,map.getZoom()) } : null,
			speedtrack: scaled ? metersInPixel(coords[1],feature.properties.speed*0.514444*30.0,map.getZoom()) : null,
			heading: feature.properties.heading,
			course: feature.properties.course
	};

	/*if(scaled) {
		rotation = (feature.properties.track != 511 ? parseFloat(feature.properties.track) : 0);
		to_bow = parseFloat(feature.properties.to_bow);
		to_stern = parseFloat(feature.properties.to_stern);
		to_port = parseFloat(feature.properties.to_port);
		to_star = parseFloat(feature.properties.to_starboard);
		p = L.GeoJSON.coordsToLatLng(coords);
		//console.log({rotation, to_bow,to_stern,to_port,to_star,p});
		a = destination(p, rotation-180.0, to_bow);
		//console.log("a: "+ a);
		e = destination(a, rotation+90.0, to_star);
		b = destination(a, rotation-90.0, to_port);
		c = destination(b, rotation, (to_bow+to_stern)*5.0/6.0);
		d = destination(p, rotation, to_stern);
		e = destination(a, rotation+90.0, to_star);
		f = destination(e, rotation, (to_bow+to_stern)*5.0/6.0);
		L.polygon([a,b,c,d,e,f], { color: "red", renderer: vehicleRenderer }).addTo(map);
	}*/

	if(instance) {
		return new Path2DMarker([coords[1], coords[0]], options);
	} else {
		return options;
	}
}

//radiosondeIcon
function radiosondeMarker(feature, instance = true){

	p = feature.properties;
	marker = markers['hab']['hab'];
	fillColor = typeToColor(mToFt(feature.properties.altitude), feature.properties.type);

	if(feature.properties.marker == "burst") {
		marker = markers['hab']['burst'];
		if(typeof p.fillColor !== "undefined") {
			fillColor = p.fillColor;
		}
	}
	if(feature.properties.marker == "landingpoint") {
		marker = markers['hab']['landingpoint'];
		fillColor = p.fillColor;
	}
	if(feature.properties.marker == "chute") {
		marker = markers['hab']['chute'];
	}

	var options = {
				radius: marker.size[0]/2,
				zIndexOffset: feature.properties.altitude == "ground" ? 0 : mToFt(feature.properties.altitude),
				fillColor: fillColor,
				rotation: 0,
				marker: marker,
				renderer: vehicleRenderer,
				bubblingMouseEvents: false,
				opacity: feature.properties.opacity,
				shadowColor: (feature.properties.id == id ? "black" : null),
				shadowBlur: (feature.properties.id == id ? 15 : 0)
	};

	const coords = feature.geometry.coordinates;

	if(instance) {
		return new Path2DMarker([coords[1], coords[0]], options);
	} else {
		return options;
	}
}

function stationMarker(feature, instance = true){
	p = feature.properties;
	marker = markers['stations']['station'];

	var options = {
				radius: marker.size[0]/2,
				zIndexOffset: -20,
				fillColor: (feature.properties.id == stationSelected ? "orange": typeToColor()),
				rotation: 0,
				marker: marker,
				renderer: vehicleRenderer,
				bubblingMouseEvents: false,
				shadowColor: (feature.properties.id == stationSelected ? "black" : null),
				shadowBlur: (feature.properties.id == stationSelected ? 15 : 0)
	};
	const coords = feature.geometry.coordinates;

	if(instance) {
		return new Path2DMarker([coords[1], coords[0]], options);
	} else {
		return options;
	}
}

function launchsiteMarker(feature, instance = true){
	marker = markers['launchsites']['launchsite'];
	var options = {
				radius: marker.size[0]/2,
				zIndexOffset: -20,
				fillColor: (feature.properties.id == launchsiteSelected ? "orange": typeToColor(null, feature.properties.type)),
				rotation: 0,
				marker: marker,
				renderer: vehicleRenderer,
				bubblingMouseEvents: false,
				shadowColor: (feature.properties.id == launchsiteSelected ? "black" : null),
				shadowBlur: (feature.properties.id == launchsiteSelected ? 15 : 0)
	};
	const coords = feature.geometry.coordinates;

	if(instance) {
		return new Path2DMarker([coords[1], coords[0]], options);
	} else {
		return options;
	}
}

function stationIcon(feature){
	//selected
	if(feature.properties.id == stationSelected){
		return L.divIcon({
			className: 'stationMarkerActive',
			html:'<i class="fas fa-broadcast-tower"></i>',
			iconSize: [32, 32]
		});
	}
	else{
		return L.divIcon({
			className: 'stationMarker',
			html:'<i class="fas fa-broadcast-tower"></i>',
			iconSize: [32, 32]
		});
	}
}

function ucFirst(str) {
	if (!str) return str;
	return str[0].toUpperCase() + str.slice(1);
}

//timeFromNow
function timeFromNow(ts){
	if(isNaN(ts)){
		return ts;
	}
//	console.log("now: " + Date.now() + " tsn:" + ts);
//	console.log(new Date().getTimezoneOffset());
	var diff = Math.abs(parseInt((Date.now()-new Date(ts*1000))/1000));
//	var diff = Math.abs(parseInt(Date.now()/1000) - new Date().getTimezoneOffset()*60 - parseInt(ts));
//	var diff = Math.abs(parseInt(Date.now()/1000) - parseInt(ts));
	return diff;
}

//tsToReadable
function tsToReadable(ts){
	if(isNaN(ts)){
		return ts;
	}
	const d = new Date(ts*1000);
	//getXYZ nimmt nicht UTC!
	return d.getUTCDate() + '.' + (d.getUTCMonth()+1) + '.' + d.getUTCFullYear() + ' ' + oneToTwoDigits(d.getUTCHours()) + ':' + oneToTwoDigits(d.getUTCMinutes());
}

//secondsToReadable
function secondsToReadable(s){
	if(isNaN(s)){
		return s;
	}

	negative = "";
	if(s < 0){
		negative = "-";
	}
	s = Math.abs(s);
	if(s < 60){
		return negative + Math.floor(s) + 's';
	}
	if(s < 3600){
		var m = Math.floor(s/60);
		return negative + '00:' + oneToTwoDigits(m) + ':' + oneToTwoDigits(s-m*60);
	}
	if(s < 172800){
		var h = Math.floor(s/3600);
		var m = Math.floor((s-h*3600)/60);
		return negative + oneToTwoDigits(h) + ':' + oneToTwoDigits(m) + ':' + oneToTwoDigits(s-h*3600-m*60);
	}
	var d = Math.floor(s/86400);
	return negative + d + ' days';

}

function metersToReadable(m) {
	if(m < 2500) {
		return Math.round(m)+"m";
	}
	return Math.round(m/100)/10+"km";
}

//
function oneToTwoDigits(i){
	if(i < 10 && i >= 0){
		i = "0" + i;
	}
	return i;
}

//
function numToWeekday(n){
	const w = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
	return w[n];
}

function getScale() {
	// Get the y,x dimensions of the map
	y = map.getSize().y,
	x = map.getSize().x;
	// calculate the distance the one side of the map to the other using the haversine formula
	maxMeters = map.containerPointToLatLng([0, y]).distanceTo( map.containerPointToLatLng([x,y]));
	// calculate how many meters each pixel represents
	MeterPerPixel = maxMeters/x ;

	return MeterPerPixel;
}

//tableCollapseToggle
function tableCollapseToggle(id){
	if(document.getElementById(id + 'Body').style.display == "none"){
		document.getElementById(id + 'Body').style.display = "";
		document.getElementById(id + 'Toggle').className = "fas fa-minus-square";
	}
	else{
		document.getElementById(id + 'Body').style.display = "none";
		document.getElementById(id + 'Toggle').className = "fas fa-plus-square";
	}
}

//tableAutohide
//hides empty tables, shows full tables
function tableAutohide(id){
	if(document.getElementById(id + 'Body').innerHTML!=''){
		document.getElementById(id).style.display='';
	}
	else{
		document.getElementById(id).style.display='none';
	}
}

function valueRefresh(value, text){
	if(typeof(value) !== 'undefined'){
		if(typeof text !== 'undefined'){
			return value + text;
		}
		else{
			return value;
		}
	}
}

function metersPerPixel(latitude, zoomLevel) {
	var earthCircumference = 40075017;
	var latitudeRadians = latitude * (Math.PI/180);
	return earthCircumference * Math.cos(latitudeRadians) / Math.pow(2, zoomLevel + 8);
}

function metersInPixel(latitude, meters, zoomLevel) {
	return meters / metersPerPixel(latitude, zoomLevel);
}

// taken from http://makinacorpus.github.io/Leaflet.GeometryUtil/leaflet.geometryutil.js.html#line713 (BSD New)
function destination(latlng, heading, distance) {
        heading = (heading + 360) % 360;
        //console.log(latlng);
        //console.log((latlng.lat));
        var rad = Math.PI / 180,
            radInv = 180 / Math.PI,
            R = L.CRS.Earth.R, // approximation of Earth's radius
            lon1 = latlng.lng * rad,
            lat1 = latlng.lat * rad,
            rheading = heading * rad,
            sinLat1 = Math.sin(lat1),
            cosLat1 = Math.cos(lat1),
            cosDistR = Math.cos(distance / R),
            sinDistR = Math.sin(distance / R),
            lat2 = Math.asin(sinLat1 * cosDistR + cosLat1 *
                sinDistR * Math.cos(rheading)),
            lon2 = lon1 + Math.atan2(Math.sin(rheading) * sinDistR *
                cosLat1, cosDistR - sinLat1 * Math.sin(lat2));
        lon2 = lon2 * radInv;
        lon2 = lon2 > 180 ? lon2 - 360 : lon2 < -180 ? lon2 + 360 : lon2;
        //console.log({ lon1, lat1, rheading, sinLat1, cosLat1, cosDistR, sinDistR, lat2, lon2, LR: L.CRS.Earth.R });
        return new L.latLng([lat2 * radInv, lon2]);
    }

const vLine = {
	id: 'vLine',
	afterDraw: chart => {
		if(chart.tooltip._active && chart.tooltip._active.length){
			const ctx = chart.ctx;
			ctx.save();
			ctx.beginPath();
			ctx.setLineDash([5, 7]);
			ctx.moveTo(chart.tooltip._active[0].element.x, chart.chartArea.top);
			ctx.lineTo(chart.tooltip._active[0].element.x, chart.chartArea.bottom);
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'white';
			ctx.stroke();
			ctx.restore();
			console.log('ctx');
		}
	}
};
