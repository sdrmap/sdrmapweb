//Tabulator Planelist
var table = new Tabulator("#planelist", {
	layout:"fitColumns",
	placeholder:"No Data Set",
	height:"100%",
	rowFormatter:function(row){
			row.getElement().classList.add("listType_" + row["_row"]["data"]["type"]);
		},
	columns:[
		{title:"Hex", field:"hex", sorter:"string"},
		{title:"Reg", field:"registration", sorter:"string", sorterParams: { alignEmptyValues:"bottom" }},
		{title:"Flight", field:"flight", sorter:"string", sorterParams: { alignEmptyValues:"bottom" }, widthGrow: 2 },
		{title:"Alt", field:"altitude", sorter:"number", sorterParams: { alignEmptyValues:"bottom", thousandSeparator:".", decimalSeparator:"," }},
		{title:"<i class='fas fa-tachometer-alt' title='Speed (km/h)'></i>", field:"speed", sorter:"number"},
//		{title:"<i class='fas fa-location-arrow' title='direction'></i>", field:"track", sorter:"number"},
		{title:"<i class='fas fa-map-marker' title='Fix'></i>", field:"fix", sorter:"string",formatter:"html", maxWidth: 1},
	],
	initialSort:[
		{column:"flight",dir:"asc"},
		{column:"fix",dir:"asc"},
	],
});

table.on(
	"rowClick", function(e, row){
		planeSelect(row["_row"]["data"]["hex"]);
	}
);

//Tabulator shiplist
var shipsTable = new Tabulator("#shiplist", {
	layout:"fitColumns",
	placeholder:"No Data Set",
	height:"100%",
	rowFormatter:function(row){
			row.getElement().classList.add("listType_" + row["_row"]["data"]["type"]);
		},
	initialSort:[
		{column:"name",dir:"asc"}
	],
	columns:[
		{title:"MMSI", field:"mmsi", sorter:"string", minWidth: 90},
		{title:"Name", field:"name", sorter:"string", sorterParams: { alignEmptyValues:"bottom" }, widthGrow: 2},
		{title:"Call", field:"callsign", sorter:"string", sorterParams: { alignEmptyValues:"bottom" }},
		//{title:"Speed", field:"speed", sorter:"number"},
		{title:"<i class='fas fa-map-marker' title='Fix'></i>", field:"fix", sorter:"string",formatter:"html", maxWidth: 1},
	],
});

shipsTable.on(
	"rowClick", function(e, row){
		shipSelect(row["_row"]["data"]["mmsi"]);
	}
);

//Tabulator PlaneHistoryList
var planesHistoryTable = new Tabulator("#planeHistoryList", {
	layout:"fitDataStretch",
	placeholder:"Loading...",
	height:"100%",
	initialSort:[
		{column:"flight",dir:"asc"}
	],
	columns:[
		{title:"Hex", field:"hex", sorter:"string"},
		{title:"Reg", field:"registration", sorter:"string", sorterParams: { alignEmptyValues:"bottom" }},
		{title:"Flight", field:"flight", sorter:"string", sorterParams: { alignEmptyValues:"bottom" }},
		{title:"Seen", field:"seen", sorter:"string"},
	],
});

planesHistoryTable.on(
	"rowClick", function(e, row){
		planeSelect(row["_row"]["data"]["hex"], true);
	}
);

function zeroFormatter(cell) {
	if(typeof cell.getValue() === "undefined") {
		return "0";
	} else {
		return cell.getValue();
	}
}

//Tabulator stationlist
var stationTable = new Tabulator("#stationlist", {
	layout:"fitColumns",
	placeholder:"No Data Set",
	height:"100%",
	//ajaxURL:"data/station.json",
	initialSort:[
		{column:"name",dir:"asc"}
	],
	columns:[
		{title:"Station", field:"name", sorter:"string", widthGrow: 5},
		{title:"<i class='fas fa-plane'></i>", field:"planes", sorter:"number", sorterParams: { alignEmptyValues:"bottom" }, headerSortStartingDir:"desc", formatter: (cell) => this.zeroFormatter(cell), hozAlign:"right" },
		{title:"<i class='fas fa-map-pin'></i>", field:"positions", sorter:"number", sorterParams: { alignEmptyValues:"bottom" }, headerSortStartingDir:"desc", formatter: (cell) => this.zeroFormatter(cell), hozAlign:"right"},
		{title:"<i class='fas fa-compass', style='color: white !important'></i>", field:"mlat", sorter:"number", sorterParams: { alignEmptyValues:"bottom" }, headerSortStartingDir:"desc", formatter: (cell) => this.zeroFormatter(cell), hozAlign:"right"},
		{title:"<i class='fas fa-ship'></i>", field:"ships", sorter:"number", sorterParams: { alignEmptyValues:"bottom" }, headerSortStartingDir:"desc", formatter: (cell) => this.zeroFormatter(cell), hozAlign:"right"},
		{title:"<i class='fas fa-clock'></i>", field:"seen", sorter:"string", formatter:"html", maxWidth: 1, hozAlign:"right"},
	],
});

stationTable.on(
	"rowClick", function(e, row){
		stationSelect(row["_row"]["data"]["name"]);
	}
);

//Tabulator stats fixes
var statsPositionsTable = new Tabulator("#statsPositionsTable", {
	layout:"fitDataStretch",
	placeholder:"Loading...",
	//height:"133px",
	initialSort:[
		{column:"pos",dir:"asc"}
	],
	columns:[
		{title:"Fix", field:"pos", formatter:"html", sorter:"string"},
		{title:"<i class='fas fa-plane'></i>", field:"adsb", sorter:"number"},
		{title:"<i class='fas fa-ship'></i>", field:"ais", sorter:"number"}
		/*{title:"<i class='fas fa-chart-bar'></i>", field:"rel", formatter:"progress", formatterParams:{
			min:0,
			max:100,
			color: "#2b72d7"
		}*/
	],
});

//Tabulator stats types
var statsTypesTable = new Tabulator("#statsTypesTable", {
	layout:"fitDataStretch",
	placeholder:"Loading...",
	rowFormatter:function(row){
		row.getElement().classList.add("listType_" + row["_row"]["data"]["type"]);
	},
	initialSort:[
		{column:"type",dir:"asc"}
	],
	columns:[
		{title:"TS", field:"type", visible:false, sorter:"string"},
		{title:"Type", field:"typeLong", sorter:"string"},
		{title:"<i class='fas fa-plane'></i>", field:"adsb", sorter:"number"},
		{title:"<i class='fas fa-ship'></i>", field:"ais", sorter:"number"}
		/*{title:"<i class='fas fa-chart-bar'></i>", field:"rel", formatter:"progress", formatterParams:{
			min:0,
			max:100,
			color: "#2b72d7"
		}
		}*/
	],
});

//Tabulator stations types
var statsStationsTable = new Tabulator("#statsStationsTable", {
	layout:"fitDataStretch",
	placeholder:"Loading...",
	/*rowFormatter:function(row){
		row.getElement().classList.add("listType_" + row["_row"]["data"]["type"]);
	},*/
	/*initialSort:[
		{column:"Type",dir:"asc"}
	],*/
	columns:[
		{title:"Stations", field:"online", sorter:"number"},
		{title:"<i class='fas fa-plane' title='ADSB'></i>", field:"adsb", sorter:"number"},
		{title:"<i class='fas fa-compass' title='MLAT'></i>", field:"mlat", sorter:"number"},
		{title:"<i class='fas fa-ship' title='AIS'></i>", field:"ais", sorter:"number"}
	],
});

//Tabulator stats models
var statsModelsTable = new Tabulator("#statsModelsTable", {
	layout:"fitDataStretch",
	placeholder:"Loading...",
	initialSort:[
		{column:"count",dir:"desc"}
	],
	columns:[
		{title:"Model", field:"model", sorter:"string"},
		{title:"<i class='fas fa-calculator'></i>", field:"count", sorter:"number"},
		{title:"<i class='fas fa-chart-bar'></i>", field:"rel", formatter:"progress", formatterParams:{
			min:0,
			max:100,
			color: "#2b72d7"
		}
		}
	],
});

//Tabulator stats airlines
var statsAirlinesTable = new Tabulator("#statsAirlinesTable", {
	layout:"fitDataStretch",
	placeholder:"Loading...",
	initialSort:[
		{column:"count",dir:"desc"}
	],
	columns:[
		{title:"Airline", field:"airline", sorter:"string"},
		{title:"<i class='fas fa-calculator'></i>", field:"count", sorter:"number"},
		{title:"<i class='fas fa-chart-bar'></i>", field:"rel", formatter:"progress", formatterParams:{
			min:0,
			max:100,
			color: "#2b72d7"
		}
		}
	],
});

//Eigene Dynamische Tabellenlogik
//hier könnte man das array sortieren nach festgelegtem sorter

function radiosondeListTableRefresh(){

	var tableBody = 'radiosondeListTableBody';
	var tableSorter = 'altitude';
	var tableSorterDirection = 'asc';

	//sort
	if(tableSorterDirection!='desc'){
		radiosondeListTableData.sort((a,b) => {
			return a[tableSorter] - b[tableSorter];
		});
	}
	else{
		radiosondeListTableData.sort((a,b) => {
			return b[tableSorter] - a[tableSorter];
		});
	}

	document.getElementById(tableBody).innerHTML='';
	Object.values(radiosondeListTableData).forEach(
		function tableRows(r){
			var trclass = "";
			if(typeof r.launchsite?.type !== "undefined"){
				var trclass = 'tr_' + r.launchsite.type;
			}
			document.getElementById(tableBody).innerHTML+='<tr class="' + trclass + '" onclick="radiosondeSelect(\'' + r.id + '\')"><td>' + r.id + '</td><td>' + r.model + '</td><td>' + valueRefresh(Math.round(r.altitude), 'm') + '</td><td>' + valueRefresh(r.temperature, '°C') + '</td><td>' + valueRefresh(timeFromNow(r.timestamp), 's') + '</td></tr>';
			//console.log(r.temperature);
		}
	);
};

function radiosondeSearchTableInit(){
	console.log('fetch');
	fetch('https://radiosonde.api.sdrmap.org/archive.json')
	.catch((error) => {
		if(alertNetworkOnce == 0){
			corneroverlayShow('crit', 'No connection to Server, this application does not work offine!');
			alertNetworkOnce = 1;
		}
	})
	.then(function(response) { return response.json(); })
	.then(function(r) {
		if(alertNetworkOnce != 0){
			alertNetworkOnce = 0;
			corneroverlayClose();
		}
		console.log('fetchcomplete');
		radiosondeSearchTableData=r;
		
		//radiosondeSearchTableRefresh()
	})
}

function radiosondeSearchTableRefresh(){
	var tableBody = 'radiosondeSearchTableBody';
	
	var output = '';
	Object.entries(radiosondeSearchTableData).forEach(
		function personde(e){
			var r = e[1];
			var include = true;
			
			if(typeof document.getElementById('radiosondeSearchId').value !== 'undefined' || document.getElementById('radiosondeSearchId').value != ''){
				if(!e[0].includes(document.getElementById('radiosondeSearchId').value)){
					include=false;
					console.log('se');
				}
			}
			
			//filters
			if(include == true){
				var trclass = "";
				if(typeof r.launchsite?.type !== "undefined"){
					var trclass = 'tr_' + r.launchsite.type;
				}
				output+='<tr class="' + trclass + '" onclick="radiosondeSelect(\'' + e[0] + '\')"><td>' + e[0] + '</td><td>' + r.freq_mhz + '</td><td>' + r.model + '</td><td>' + valueRefresh(r.launchsite) + '</td><td>' + tsToReadable(r.timestamp) + '</td></tr>';
			}
		}
	)
	console.log('ready');
	document.getElementById(tableBody).innerHTML=output;
	console.log('ready2');
}
