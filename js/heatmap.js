//Heatmap
//heatmapLayerToggle
function heatmapLayerToggle(){
	if(!heatmapLayerActive){
		heatmapLayerAdd();
	}
	else{
		heatmapLayerRemove();
	}
}

//heatmapStationToggle
function heatmapStationToggle(s){
	if(!heatmapLayerActive){
		filterStationSet(s);
		heatmapLayerAdd();
	}
	else{
		heatmapLayerRemove();
		filterStationSet('all');
	}
}

//heatmapLayerAdd
function heatmapLayerAdd(){
	document.getElementById("heatmapLayerToggle").className = 'buttonWait';
	document.getElementById("activityIndicator").style.display = 'block';
	heatmapLayerActive=true;
	var radius = 75;
	if(filterSource=='ais'){
		radius = 25;
	}
	heatmapLayer = L.heatLayer([[0,0,0]],{
		radius: radius,
		maxZoom: 17,
		max: 1,
	}).addTo(map);
	var fs='';
	if(filterStation!='all'){
		fs = filterStation;
	}
	fetch(urlBase + '/data/heatmap.php?name=' + fs + '&altmin=' + filterAltitudeMin + '&altmax=' + filterAltitudeMax + '&fix=' + filterFix + '&source=' + filterSource)
		.then(response => response.json())
		.then(data => heatmapMangle(data))
		.catch(err => console.log(err));

	function heatmapMangle(data) {
		Object.entries(data).forEach(function xy(i){
			heatmapLayer.addLatLng([i[1].lat,i[1].lon]);
		});
		document.getElementById("heatmapLayerToggle").className = 'buttonActive';
		document.getElementById("activityIndicator").style.display = 'none';
	}

	//station rangerings
	if(stationSelectedLat != undefined && stationSelectedLon != undefined){
		const rangerings = [100000, 200000, 300000, 400000, 500000];
		rangerings.forEach(draw);

		function draw(i){
		var rangering = L.circle([stationSelectedLat, stationSelectedLon], {
			color: '#2b72d7',
			fillOpacity: 0,
			radius: i,
			zIndexOffset: -200000
		}).addTo(stationRangerings)
		}
		stationRangerings.addTo(map);
	}
}

//heatmapLayerRemove
function heatmapLayerRemove(){
	document.getElementById("heatmapLayerToggle").className = 'button';
	if(heatmapLayerActive){
		heatmapLayerActive=false;
		heatmapLayer.remove();
		stationRangerings.remove();
		stationRangerings = L.layerGroup();
		stationSelectedLat=undefined;
		stationSelectedLon=undefined;
	}
}
