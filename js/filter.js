//filter
function filterInit(){
	//Station Filter
	document.getElementById("filterStationList").innerHTML = '<div id="filterStationAll" class="filterActive" onclick="filterStationSet(\'all\')">All</div>';
	fetch(urlBase + '/data/station.json')
	.then(response => response.json())
	.then(data => stfu(data))
	.catch(err => console.log(err));

	function stfu(data) {
		Object.values(data).forEach(function acs(s){
			document.getElementById("filterStationList").innerHTML += '<div id="filterStation' + s.name + '" onclick="filterStationSet(\'' + s.name + '\')">' + s.name + '</div>';
		})
	}

	filterUpdate();

	filterSpeedApply(0, 2000);
};

var filterAltitudeSliderSpace = 2000;

function filterAltitudeInput(){
	filterAltitudeApply(filterAltitudeSliderMin.value, filterAltitudeSliderMax.value)
}

function filterAltitudeSliderMinInput(){
	if(parseInt(document.getElementById("filterAltitudeSliderMax").value) - parseInt(document.getElementById("filterAltitudeSliderMin").value) <= filterAltitudeSliderSpace){
		document.getElementById("filterAltitudeSliderMin").value = parseInt(document.getElementById("filterAltitudeSliderMax").value) - filterAltitudeSliderSpace;
	}
	filterAltitudeInput();
}
function filterAltitudeSliderMaxInput(){
	if(parseInt(document.getElementById("filterAltitudeSliderMax").value) - parseInt(document.getElementById("filterAltitudeSliderMin").value) <= filterAltitudeSliderSpace){
		document.getElementById("filterAltitudeSliderMax").value = parseInt(document.getElementById("filterAltitudeSliderMin").value) + filterAltitudeSliderSpace;
	}
	filterAltitudeInput();
}

function filterAltitudeApply(sMin, sMax){
	filterAltitudeSliderMin.value = sMin;
	filterAltitudeSliderMax.value = sMax;
	document.getElementById("filterAltitudeGauge").innerHTML = ftToM(sMin) + ' - ' + ftToM(sMax) + 'm / ' + sMin + ' - ' + sMax + 'ft';
	filterAltitudeMin = sMin;
	filterAltitudeMax = sMax;
	filterAltitudeSliderMinPerc = sMin / 120000 * 100;
	filterAltitudeSliderMaxPerc = sMax / 120000 * 100;
	filterUpdate();
}

var filterSpeedSliderSpace = 10;

function  filterSpeedSet(s){
	if(s == 'all'){
		filterSpeedApply(0, 2000);
	}
}

function filterSpeedInput(){
	filterSpeedApply(filterSpeedSliderMin.value, filterSpeedSliderMax.value)
}

function filterSpeedApply(sMin, sMax){
	filterSpeedSliderMin.value = sMin;
	filterSpeedSliderMax.value = sMax;
	document.getElementById("filterSpeedGauge").innerHTML = sMin + ' - ' + sMax + 'km/h';
	filterSpeedMin = sMin;
	filterSpeedMax = sMax;
	filterSpeedSliderMinPerc = sMin / 2000 * 100;
	filterSpeedSliderMaxPerc = sMax / 2000 * 100;
	document.getElementById("filterSpeedTrack").style.background = `linear-gradient(to right, #393f4cd1 ${filterSpeedSliderMinPerc}%, orange ${filterSpeedSliderMinPerc}% , orange ${filterSpeedSliderMaxPerc}%, #393f4cd1 ${filterSpeedSliderMaxPerc}%)`;
	filterUpdate();
}

function filterSpeedSliderMinInput(){
	if(parseInt(document.getElementById("filterSpeedSliderMax").value) - parseInt(document.getElementById("filterSpeedSliderMin").value) <= filterSpeedSliderSpace){
		document.getElementById("filterSpeedSliderMin").value = parseInt(document.getElementById("filterSpeedSliderMax").value) - filterSpeedSliderSpace;
	}
	filterSpeedInput();
}
function filterSpeedSliderMaxInput(){
	if(parseInt(document.getElementById("filterSpeedSliderMax").value) - parseInt(document.getElementById("filterSpeedSliderMin").value) <= filterSpeedSliderSpace){
		document.getElementById("filterSpeedSliderMax").value = parseInt(document.getElementById("filterSpeedSliderMin").value) + filterSpeedSliderSpace;
	}
	filterSpeedInput();
}

function filterTypeSet(t){
	document.getElementById("filterType" + ucFirst(filterType)).className = 'filter';
	document.getElementById("filterType" + ucFirst(t)).className = 'filterActive';
	filterType = t;
	filterUpdate();
}

function filterFixSet(t){
	document.getElementById("filterFix" + ucFirst(filterFix)).className = 'filter';
	document.getElementById("filterFix" + ucFirst(t)).className = 'filterActive';
	filterFix = t;
	if(heatmapLayerActive){
		heatmapLayerRemove();
		heatmapLayerAdd();
	}
	filterUpdate();
}

function filterStationSet(s){
	document.getElementById("filterStation" + ucFirst(filterStation)).className = 'filter';
	document.getElementById("filterStation" + ucFirst(s)).className = 'filterActive';
	filterStation = s;
	if(heatmapLayerActive){
		heatmapLayerRemove();
		heatmapLayerAdd();
	}
	filterUpdate();
}

function filterStationToggle(s){
	if(filterStation != s){
		filterStationSet(s);
	}
	else{
		if(heatmapLayerActive){
			heatmapLayerRemove();
		}
		filterStationSet('all');
	}
}

function filterAltitudeSet(a){
	document.getElementById("filterAltitude" + filterAltitude).className = 'filterAltitude';
	document.getElementById("filterAltitude" + a).className = 'filterAltitudeActive';
	filterAltitude = a;
	if(heatmapLayerActive){
		heatmapLayerRemove();
		heatmapLayerAdd();
	}
	filterUpdate();
}

function filterSourceSet(s){
	document.getElementById("filterSource" + ucFirst(filterSource)).className = 'filter';
	document.getElementById("filterSource" + ucFirst(s)).className = 'filterActive';
	filterSource = s;
	if(heatmapLayerActive){
		heatmapLayerRemove();
		heatmapLayerAdd();
	}
	filterUpdate();
}

function filterNavSet(n){
	document.getElementById("filterNav" + ucFirst(filterNav)).className = 'filter';
	document.getElementById("filterNav" + ucFirst(n)).className = 'filterActive';
	filterNav = n;
	filterUpdate();
	if(n!='all'){
		filterSourceSet('adsb')
	}
}

function filterSelectedSet(m){
	document.getElementById("filterSelected" + ucFirst(filterSelected)).className = 'filter';
	document.getElementById("filterSelected" + ucFirst(m)).className = 'filterActive';
	filterSelected = m;
	filterUpdate();
}

//Filter update wrapper
function filterUpdate(){
	//layersRefresh()
	worker({ ships: true, planes: true, radiosondes: true, stations: true, stop: true  });

	//indicator
	if(document.getElementById("filterSelectedAll").className == 'filterActive' && document.getElementById("filterNavAll").className == 'filterActive' && document.getElementById("filterSourceAll").className == 'filterActive' && document.getElementById("filterStationAll").className == 'filterActive' && document.getElementById("filterTypeAll").className == 'filterActive' && document.getElementById("filterFixAll").className == 'filterActive' && /*document.getElementById("filterAltitude999999").className == 'filterAltitudeActive' && */filterAltitudeMin == 0 && filterAltitudeMax == 120000 && filterSpeedSliderMin.value == 0 && filterSpeedSliderMax.value ==2000){
		document.getElementById("filterShow").className = 'button';
	}
	else{
		document.getElementById("filterShow").className = 'buttonWait';
	}
	if(heatmapLayerActive){
		heatmapLayerRemove();
		heatmapLayerAdd();
	}
}
