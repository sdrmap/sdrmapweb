var canvasPath2D = L.Canvas.extend({
	_updatePath2DMarker: function (layer) {
		if (!this._drawing || layer._empty()) { return; }
		
		/*if(layer.options.type == "scaledShipMarker") {
			return this._updateScaledShipMarker(layer);
		}*/

		var p = layer._point;
		var marker = layer.options.marker;
		ctx = this._ctx;
		//r = Math.max(Math.round(layer._radius), 1);

		// DEBUGGING
		/*ctx.save();
		ctx.beginPath();
		ctx.arc(p.x, p.y, marker.size[0]/2, 0, 2*Math.PI);
		ctx.fillStyle = 'rgba(255,12,0,0.4)';
		ctx.fill();
		ctx.closePath();
		ctx.restore();*/
		

		ctx.save();
		ctx.shadowBlur = layer.options.shadowBlur;
		ctx.shadowColor = layer.options.shadowColor;
		ctx.translate(p.x, p.y);
		ctx.rotate((layer.options.rotation * Math.PI) / 180);
		ctx.translate(-marker.center[0], -marker.center[1]);

		ctx.globalAlpha = layer.options.opacity;
		ctx.fillStyle = layer.options.fillColor;
		ctx.fill(marker.path);
		ctx.stroke(marker.path);
		ctx.restore();
	},
	
	_updateScaledShipMarker: function (layer) {
		to_stern = layer.options.dimensions.to_stern;
		to_bow = layer.options.dimensions.to_bow;
		to_star = layer.options.dimensions.to_star;
		to_port = layer.options.dimensions.to_port;
		rotation = layer.options.rotation;
	
	
		if (!this._drawing || layer._empty()) { return; }

		var p = layer._point;
		var marker = layer.options.marker;
		ctx = this._ctx;
		//r = Math.max(Math.round(layer._radius), 1);

		// DEBUGGING
		/*ctx.save();
		ctx.beginPath();
		ctx.arc(p.x, p.y, marker.size[0]/2, 0, 2*Math.PI);
		ctx.fillStyle = 'rgba(255,12,0,0.4)';
		ctx.fill();
		ctx.closePath();
		ctx.restore();*/
		
		ctx.globalAlpha = layer.options.opacity;
		ctx.fillStyle = layer.options.fillColor;

		ctx.save();
		ctx.translate(p.x, p.y);
		ctx.rotate((rotation-180) * Math.PI / 180);
		ctx.translate(to_port, -to_stern);
		ctx.beginPath();
		ctx.moveTo(0,0);
		//ctx.arc(0, 0, 30, 0, 2 * Math.PI);
		//ctx.lineTo(0, to_stern+to_bow-20);
		ctx.lineTo(0, (to_stern+to_bow)*5/6);
		ctx.lineTo(-(to_port+to_star)/2, to_stern+to_bow);
		//ctx.lineTo(-to_star-to_port, to_bow+to_stern-20);
		ctx.lineTo(-to_star-to_port, (to_bow+to_stern)*5/6);
		ctx.lineTo(-to_star-to_port, 0);
		ctx.lineTo(0,0);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
		ctx.save();
		ctx.translate(p.x, p.y);
		ctx.beginPath();
		//ctx.moveTo(0,0);
		ctx.arc(0, 0, 10, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
		if(layer.options.course != false) {
			ctx.save();
			ctx.translate(p.x, p.y);
			ctx.rotate((parseFloat(layer.options.course)-180.0) * Math.PI / 180);
			ctx.beginPath();
			ctx.moveTo(0,0);
			ctx.lineTo(0,layer.options.speedtrack);
			 /* var x225=p1.x+headLength*Math.cos(angle+degreesInRadians225);
  var y225=p1.y+headLength*Math.sin(angle+degreesInRadians225);
  var x135=p1.x+headLength*Math.cos(angle+degreesInRadians135);
  var y135=p1.y+headLength*Math.sin(angle+degreesInRadians135);*/
  			ctx.lineTo(layer.options.speedtrack/10.0*Math.cos((225+90)*Math.PI/180), layer.options.speedtrack+layer.options.speedtrack/10.0*Math.sin((225+90)*Math.PI/180));
  			ctx.moveTo(0,layer.options.speedtrack);
  			ctx.lineTo(layer.options.speedtrack/10.0*Math.cos((135+90)*Math.PI/180), layer.options.speedtrack+layer.options.speedtrack/10.0*Math.sin((135+90)*Math.PI/180));
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		}
	},

	// overwrite _updatePoly from Canvas, since it's not saving the context beforehand
	_updatePoly(layer, closed) {
		if (!this._drawing) { return; }

		let i, j, len2, p;
		const parts = layer._parts,
			len = parts.length,
			ctx = this._ctx;

		if (!len) { return; }
		ctx.save();
		ctx.beginPath();

		for (i = 0; i < len; i++) {
			for (j = 0, len2 = parts[i].length; j < len2; j++) {
				p = parts[i][j];
				ctx[j ? 'lineTo' : 'moveTo'](p.x, p.y);
			}
			if (closed) {
				ctx.closePath();
			}
		}
		this._fillStroke(ctx, layer);
		ctx.restore();
		// TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
	},
	
	
	
	_updateCircle(layer) {

		if (!this._drawing || layer._empty()) { return; }

		const p = layer._point,
		    ctx = this._ctx,
		    r = Math.max(Math.round(layer._radius), 1),
		    s = (Math.max(Math.round(layer._radiusY), 1) || r) / r;

		//if (s !== 1) {
			ctx.save();
			ctx.scale(1, s);
		//}

		ctx.beginPath();
		ctx.arc(p.x, p.y / s, r, 0, Math.PI * 2, false);
		ctx.closePath();
		
		//if (s !== 1) {
			//ctx.restore();
		//}

		this._fillStroke(ctx, layer);
		ctx.restore();
	},

	_draw() {
		let layer;
		const bounds = this._redrawBounds;
		this._ctx.save();
		if (bounds) {
			const size = bounds.getSize();
			this._ctx.beginPath();
			this._ctx.rect(bounds.min.x, bounds.min.y, size.x, size.y);
			this._ctx.clip();
		}

		this._drawing = true;

		toDraw = new Array();

		for (let order = this._drawFirst; order; order = order.next) {
			layer = order.layer;
			if (!bounds || (layer._pxBounds && layer._pxBounds.intersects(bounds))) {
				// only draw things with an zIndex
				//if(typeof layer.feature !== "undefined" && typeof layer.feature.properties !== "undefined" && typeof layer.feature.properties.zIndexOffset !== "undefined" || typeof layer.options.zIndexOffset !== "undefined") {
				if(typeof layer?.feature?.properties?.zIndexOffset !== "undefined" || typeof layer?.options?.zIndexOffset !== "undefined") {
					toDraw.push(layer);
				}
			}
		}

		/*toDraw.sort(function (a,b) {
	  		if(a.options.zIndexOffset < b.options.zIndexOffset) {
	  			return -1;
	  		} else if(a.options.zIndexOffset > b.options.zIndexOffset) {
	  			return 1;
	  		}
	  		return 0;
	  	});*/

//		console.log(toDraw);

		toDraw.sort(function (a, b) {
			if(typeof a === "undefined" || typeof b === "undefined") {
				return 0;
			}

			aZIndex = 0;
			bZIndex = 0;

			//if(typeof a.feature !== "undefined" && a.feature.hasOwnProperty("properties") && a.feature.properties.hasOwnProperty("zIndexOffset")) {
			if(a.feature?.properties?.hasOwnProperty("zIndexOffset")) {
				aZIndex = a.feature.properties.zIndexOffset;
			}
			//if(typeof b.feature !== "undefined" && b.feature.hasOwnProperty("properties") && b.feature.properties.hasOwnProperty("zIndexOffset")) {
			if(b.feature?.properties?.hasOwnProperty("zIndexOffset")) {
				bZIndex = b.feature.properties.zIndexOffset;
			}
			//if(typeof a.options !== "undefined" && a.options.hasOwnProperty("zIndexOffset")) {
			if(a.options?.hasOwnProperty("zIndexOffset")) { 
				aZIndex = a.options.zIndexOffset;
			}
			//if(typeof b.options !== "undefined" && b.options.hasOwnProperty("zIndexOffset")) {
			if(b.options?.hasOwnProperty("zIndexOffset")) { 
				bZIndex = b.options.zIndexOffset;
			}

			return aZIndex - bZIndex || a._leaflet_id - b._leaflet_id;
		});

		toDraw.forEach((layer) => {
			layer._updatePath();
		});

		this._drawing = false;

		this._ctx.restore();  // Restore state before clipping.
	}

});

var Path2DMarker = L.CircleMarker.extend({
	_updatePath: function () {
		this._renderer._updatePath2DMarker(this);
	},
	

/*	_updateBounds: function() {
		const r = this._radius,
		r2 = this._radiusY || r,
		w = this._clickTolerance(),
		p = [r + w, r2 + w];

		if(this.options.anchor) {
			p = [p[0] + this.options.anchor[0], p[1] + this.options.anchor[1]];
		}

		this._pxBounds = L.Bounds(this._point.subtract(p), this._point.add(p));
	}
	_updateBounds() {
		if(this.options.type == "scaledShipMarker") {
			to_stern = parseFloat(this.options.dimensions.to_stern);
			to_bow = parseFloat(this.options.dimensions.to_bow);
			to_star = parseFloat(this.options.dimensions.to_star);
			to_port = parseFloat(this.options.dimensions.to_port);
			rotation = parseFloat(this.options.rotation);
			//this._pxBounds = new L.Bounds(this._point, [this._point.x - this._clickTolerance() + Math.sqrt((to_stern+to_bow)*(to_stern+to_bow)+(to_star+to_port)*(to_star+to_port)) * Math.cos(Math.PI * (rotation+90) / 180.0), this._point.y + this._clickTolerance() + Math.sqrt((to_stern+to_bow)*(to_stern+to_bow)+(to_star+to_port)*(to_star+to_port)) * Math.sin(Math.PI * (rotation+90) / 180.0)]);
			this._pxBounds = new L.Bounds(this._point, [this._point.x + to_stern + Math.sqrt((to_stern+to_bow)*(to_stern+to_bow)+(to_star+to_port)*(to_star+to_port)) * Math.cos(Math.PI * (rotation-90) / 180.0), this._point.y + Math.sqrt((to_stern+to_bow)*(to_stern+to_bow)+(to_star+to_port)*(to_star+to_port)) * Math.sin(Math.PI * (rotation-90) / 180.0)]);
		} else {
			const r = this._radius,
			r2 = this._radiusY || r,
			w = this._clickTolerance(),
			p = [r + w, r2 + w];
			this._pxBounds = new L.Bounds(this._point.subtract(p), this._point.add(p));
		}
	},
	
	_containsPoint(p) {
		if(this.options.type == "scaledShipMarker") {
			return this._pxBounds.contains(p);
		} else {
			return p.distanceTo(this._point) <= this._radius + this._clickTolerance();
		}
	},*/
});
