function layerToggle(layer, button){
	if(!map.hasLayer(layer)){
		layerOn(layer, button);
	}
	else{
		//planeLayerOff();
		layerOff(layer, button);
	}
}

function layerOn(layer, button){
	map.addLayer(layer);
	var ele = layer;
	//element += "Toggle";
	console.log('ele');
	console.log(button);
	document.getElementById(button).className = 'buttonActive';
}

function layerOff(layer, button){
	map.removeLayer(layer);
	document.getElementById(button).className = 'button';
}

//Airports
function airportLayerAdd() {
	document.getElementById("airportLayerToggle").className = 'buttonWait';
	fetch(urlBase + '/data/airports.json')
		.then(function(response) {
			return response.json();
	})
	.then(function(data) {
		globalThis.airportLayer = L.geoJSON(data, {
			pointToLayer: function(feature, latlng){
				return L.marker(latlng, {
					icon: L.divIcon({
						className: 'airportMarker',
						html:'<i class="fas fa-plane-departure"></i>',
						iconSize: [32, 32]
					}),
					title: feature.properties.icao + "/" + feature.properties.iata + "\n" + feature.properties.name,
					zIndexOffset: -1000,
				});
			}
		}).addTo(map)
	})
	document.getElementById("airportLayerToggle").className = 'buttonActive';
}

var osmLayer = L.tileLayer.wms("https://tiles.sdrmap.org/service", {
	layers: 'osm',
	format: 'image/png',
	styles: '',
	transparent: false,
	opacity: 1,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors (<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>)'
});

/*DWD WMS Geraffel*/
var precipitationLayer = L.tileLayer.wms("https://tiles.sdrmap.org/service", {
	layers: 'dwd:Niederschlagsradar',
	format: 'image/png',
	styles: '',
	transparent: true,
	opacity: 0.6,
	attribution: '<a href="https://www.dwd.de/">Deutscher Wetterdienst</a>'
});

var weatherWarningLayer = L.tileLayer.wms("https://tiles.sdrmap.org/service", {
	layers: 'Warnungen_Gemeinden',
	format: 'image/png',
	styles: '',
	transparent: true,
	opacity: 0.6,
	attribution: 'Geobasisdaten Gemeinden: &copy; <a href="https://www.bkg.bund.de">BKG</a> 2015 (Daten verändert)'
});

var openSeaMapLayer = L.tileLayer.wms("https://tiles.sdrmap.org/service", {
	layers: 'seamark',
	format: 'image/png',
	styles: '',
	transparent: true,
	attribution: '&copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
});

var pegelOnlineLayer = L.tileLayer.wms("https://tiles.sdrmap.org/service", {
	layers: 'PegelOnline',
	format: 'image/png',
	styles: '',
	transparent: true,
	attribution: '&copy; <a href="https://www.pegelonline.wsv.de/">WSV</a> (CC-BY 4.0)'
});

var windLayer = L.tileLayer.wms("https://tiles.sdrmap.org/service", {
	layers: 'wind',
	format: 'image/png',
	styles: '',
	transparent: true,
	attribution: '&copy; <a href="https://www.dwd.de/">Deutscher Wetterdienst</a>',
	pane: 'popupPane'
});
