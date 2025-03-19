/*******************************/
/********MLAT MESH**************/
/*******************************/
meshLayer = L.realtime(function(success, error) {
	fetch('https://sdrmap.org/data/mesh.json')
	.then(function(response) { return response.json(); })
	.then(function(dataIn) {
		var dataOut = {
			type: 'FeatureCollection',
			features: []
		}
		Object.entries(dataIn).forEach(

			function(f){
				//Push the plane to GeoJson
				var splitter = f[0].split("-");
				if(filterStation=='all' || splitter[0]==filterStation || splitter[1]==filterStation ){
					dataOut.features.push({
						"geometry": {
							"type": "LineString",
							"coordinates": [[f[1]['start']['lon'], f[1]['start']['lat']],[f[1]['end']['lon'], f[1]['end']['lat']]]
						},
						"type": "Feature",
						"properties": {
							"id":f[0],
							"syncs":f[1]['syncs'],
							"zIndexOffset": -200000
						}
					})
				}
			}
		)
		success(dataOut);
	})
}, {
	//Ever so often
	interval: 1 * 10000,
	style:function(feature) {
		/*if(feature.properties.syncs < 5){
			return {color: '#f00'}
		}else if(feature.properties.syncs < 10){
			return {color: '#ff8000'}
		}else if(feature.properties.syncs < 15){
			return {color: '#ff0'}
		}else if(feature.properties.syncs > 15){
			return {color: '#0f0'}
		}*/
		return {color: syncToColor(feature.properties.syncs)}
	}/*,
	updateFeature: function(feature) {
		bindPopup("hallo");
	}*/
})/*.bindPopup('h')*/;

/*meshLayer.on('update', function(e){
	bindFeaturePopup = function(fId){
		realtime.getLayer(fId).bindPopup('hhh');
	},
        updateFeaturePopup = function(fId) {
            realtime.getLayer(fId).getPopup().setContent('xxx');
        }
});*/
