/****************************************/
/************Helper functions************/
/****************************************/
//typeToColor
function typeToColor(alt, type){
	if(type == 'bos'){
		return '#f00';
	}else if(type == 'mil'){
		return '#0f0';
	}else if(type == 'int'){
		return '#ff00c3';
	}else if(type == 'his'){
		return '#00000000';
	}else{
		return altitudeToColor(alt);
	}
}

//altitudeToColor
function altitudeToColor(alt){
	//https://stackoverflow.com/questions/6665997/switch-statement-for-greater-than-less-than
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
	}else if(alt == 'ground'){
		return '#767676';
	}else if(alt == 'water'){
		return '#3388ff';
	}
	return '#3388ff';
}

//
function fixToIcon(f){
	var fix="<i class='fas fa-times-circle' title='None - no position available'></i>";
	if(f === 'true'){
		fix="<i class='fas fa-check-circle' title='Fix - aircraft position received'></i>";
	}
	if(f === 'mlat'){
		fix="<i class='fas fa-compass' title='MLAT - approximate aircraft position calculated via MLAT'></i>";
	}
	if(f === 'all'){
		fix="all";
	}
	return fix;
}

//
function ftToM(ft){
	return Math.round(ft/3.28269)
}

function mToKm(m){
	return Math.round(m*1.609)
}

function ktToKmh(kt){
	return Math.round(kt*1.85106)
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
function planeIcon(feature){

		//vars
		var model = feature.properties.model;
		var category = feature.properties.category

		//Check for 
		if(model in markers['models']){
			var path = markers['models'][model]['path'];
			var size = markers['models'][model]['size'];
			var resize = markers['models'][model]['resize'];
			var center = markers['models'][model]['center'];
		}
		else{
			if(category in markers['categorys']){
				var path = markers['categorys'][category]['path'];
				var size = markers['categorys'][category]['size'];
				var resize = markers['categorys'][category]['resize'];
			}
			else{
				var path = markers['models']['default']['path'];
				var size = markers['models']['default']['size'];
				var resize = markers['models']['default']['resize'];
			}
		}

	return L.icon({
		className: 'planeMarker',
		iconUrl: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" transform="scale(0.95) rotate(' + feature.properties.track + ')"><path stroke="#000" stroke-width="1" fill="' + typeToColor(feature.properties.altitude, feature.properties.type) + '" opacity="' + feature.properties.opacity + '" d="' + path + '"/>Sorry, your browser does not support inline SVG.</svg>'),
		iconSize: size,
		iconAnchor: center
	});
}

//shipIcon
function shipIcon(feature){

	var model = feature.properties.model;
	
	//console.log(model);

	p = feature.properties;
	var length = 32;
	var width = 32;
	anchor = null;
	if(feature.properties.track==511){
		//Default für Schiff ohne Ausrichtung
		var path = "M 8, 8 m -8, 0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0";
		var size = [16, 16];
	}else{
		//Default für Schiff mit Ausrichtung
		var path = "M 22.004795,31.956387 V 10.487927 L 16,0.08731742 9.995205,10.487927 v 21.46846 z";
		var size = [32, 32];
		if(model in markers['models']){
			var path = markers['models'][model]['path'];
			var size = markers['models'][model]['size'];
		}
		// Ab hier der Versuch, Schiffe zu scalen.
		/*
			Scaling funzt, aber rotation nicht.

			Ein paar Gedanken:
			1. generell: position != schiffsposition. es wird der standort der antenne uebertragen, nicht der "mittelpunkt" des schiffs. diesen muesste man errechnen.
			2. rotation: L.icon schraenkt hier ganz schoen ein. am besten(r) waere es, wenn man das svg ohne div drumherum reinbasteln koennte.
			3. da auch die flugzeugicons bei mir im mobilen firefox kaputt sind, werden wir da auf dauer eh eine besser loesung finden muessen...
		*/
		/*if(map.getZoom() >= 15 && p.to_bow > 0 && p.to_stern > 0 && p.to_port > 0 && p.to_starboard > 0){
			var path = "M 24,32 24,10 16,0 8,10 8,32z";

			var length = parseInt((parseInt(p.to_bow) + parseInt(p.to_stern))/getScale());
			var width = parseInt((parseInt(p.to_port) + parseInt(p.to_starboard))/getScale());
			if(length > 32) {

				// haus vom nikolaus, version mit anfang rechts unten :)
				var xleft = width/4;
				var xright = width*3/4;
				var xmiddle = width/2;

				var ybottom = length;
				var ytop = 0;

				var path = 'M '+ xright +',' + ybottom + ' ' + xright + ',10 ' + xmiddle + ',0 ' + xleft + ',10 ' + xleft + ',' + ybottom + 'z';
				//var size = [width, length];
				//console.log(p.id);
				//console.log(path);
				//console.log(feature.properties.to_bow + ' ' + feature.properties.to_stern + ' ' + getScale() + '=' + length);

				//feature.properties.track = 0;
				//console.log(getScale());
				//console.log(length);
				//feature.properties.track = 0;
				//	anchorx = 

				var size = [width*3, length*3];
			}
		}*/
	}

	//console.log(skewX + ' ' + skewY + ' ' + getScale() + ' ' + map.getZoom());
	var altitude = 'water';
	if(feature.properties.statusLong=='Moored'){
		altitude='ground';
	}

	return L.icon({
		className: 'shipMarker',
		iconUrl: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" transform="scale(0.95) rotate(' + feature.properties.track + ')" style="   transform-origin: center;"><path stroke="#000" stroke-width="1" fill="' + typeToColor(altitude, feature.properties.type) + '" opacity="' + feature.properties.opacity + '" d="' + path + '"/>Sorry, your browser does not support inline SVG.</svg>'),
		iconSize: size,
		iconAnchor: anchor
	});
}

function ucFirst(str) {
	if (!str) return str;
	return str[0].toUpperCase() + str.slice(1);
}

//timeFromNow
function timeFromNow(ts){
	var diff = Math.abs(parseInt(Date.now()/1000) - parseInt(ts));
	return diff;
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
