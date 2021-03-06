// Generated by Web Inormatics and Mapping on <%= (new Date).toISOString().split('T')[0] %> using <%= generatorInfo.name %> <%= generatorInfo.version %>

$( document ).ready(function() {

	var mapCenter = [29.76, -95.38];

	//create map
	app.map = L.map('mapDiv', {
		defaultExtentControl: true,
  		center: mapCenter,
	});

	//basemap
	app.baseMapLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
		maxZoom: 16
	}).addTo(app.map);

	//set initial view
	app.map.setView([app.mapY, app.mapX], app.zoomLevel);

	//set app version
	$('#aboutModalTitle').append(' <small>v' + app.version + '</small>');

	// USGS Search
	search_api.create( "geosearch", {
			on_result: function(o) {
				// what to do when a location is found
				// o.result is geojson point feature of location with properties
				app.map
					.fitBounds([ // zoom to location
						[ o.result.properties.LatMin, o.result.properties.LonMin ],
						[ o.result.properties.LatMax, o.result.properties.LonMax ]
					])
					$("#geosearchModal").modal('hide');
		},
		
			"include_usgs_sw": true,
			"include_usgs_gw": true,
			"include_usgs_sp": true,
			"include_usgs_at": true,
			"include_usgs_ot": true,
			"include_huc2": true,
			"include_huc4": true,
			"include_huc6": true,
			"include_huc8": true,
			"include_huc10": true,
			"include_huc12": true,
		});

	// START LAT/LONG INDICATOR
	
	//displays map scale on map load
	app.map.on('load', function() {
		var mapScale =  scaleLookup(app.map.getZoom());
		$('#scale')[0].innerHTML = mapScale;
		console.log('Initial Map scale registered as ' + mapScale, map.getZoom());

		var initMapCenter = app.map.getCenter();
		$('#latitude').html(initMapCenter.lat.toFixed(4));
		$('#longitude').html(initMapCenter.lng.toFixed(4));
	});

	//displays map scale on scale change (i.e. zoom level)
	app.map.on( 'zoomend', function () {
		var mapZoom = app.map.getZoom();
		var mapScale = scaleLookup(mapZoom);
		$('#scale')[0].innerHTML = mapScale;
		$('#zoomLevel')[0].innerHTML = mapZoom;
	});

	//updates lat/lng indicator on mouse move. does not apply on devices w/out mouse. removes 'map center' label
	app.map.on( 'mousemove', function (cursorPosition) {
		$('#mapCenterLabel').css('display', 'none');
		if (cursorPosition.latlng !== null) {
			$('#latitude').html(cursorPosition.latlng.lat.toFixed(4));
			$('#longitude').html(cursorPosition.latlng.lng.toFixed(4));
		}
	});
	
	//updates lat/lng indicator to map center after pan and shows 'map center' label.
	app.map.on( 'dragend', function () {
		//displays latitude and longitude of map center
		$('#mapCenterLabel').css('display', 'inline');
		var geographicMapCenter = app.map.getCenter();
		$('#latitude').html(geographicMapCenter.lat.toFixed(4));
		$('#longitude').html(geographicMapCenter.lng.toFixed(4));
	});

		function scaleLookup(mapZoom) {
			switch (mapZoom) {
				case 19: return '1,128';
				case 18: return '2,256';
				case 17: return '4,513';
				case 16: return '9,027';
				case 15: return '18,055';
				case 14: return '36,111';
				case 13: return '72,223';
				case 12: return '144,447';
				case 11: return '288,895';
				case 10: return '577,790';
				case 9: return '1,155,581';
				case 8: return '2,311,162';
				case 7: return '4,622,324';
				case 6: return '9,244,649';
				case 5: return '18,489,298';
				case 4: return '36,978,596';
				case 3: return '73,957,193';
				case 2: return '147,914,387';
				case 1: return '295,828,775';
				case 0: return '591,657,550';
			}
		}

	// END LAT/LONG INDICATOR
	
	/*  START EVENT HANDLERS */
	$('#mobile-main-menu').click(function() {
		$('body').toggleClass('isOpenMenu');
	});

	$('.basemapBtn').click(function() {
		$('.basemapBtn').removeClass('slick-btn-selection');
		$(this).addClass('slick-btn-selection');
		var baseMap = this.id.replace('btn','');
		setBasemap(baseMap);
	});

	// geosearch modal
    $('#geosearchButton').click(function() {
		$('#geosearchModal').modal('show');
	});

	// about modal
	$('#aboutButton').click(function() {
		$('#aboutModal').modal('show');
	});	

	/*  END EVENT HANDLERS */
});

function setBasemap(baseMap) {

	switch (baseMap) {
		case 'Streets': baseMap = 'Streets'; break;
		case 'Satellite': baseMap = 'Imagery'; break;
		case 'Topo': baseMap = 'Topographic'; break;
		case 'Terrain': baseMap = 'Terrain'; break;
		case 'Gray': baseMap = 'Gray'; break;
		case 'NatGeo': baseMap = 'NationalGeographic'; break;
	}

	if (app.baseMapLayer) app.map.removeLayer(app.baseMapLayer);
	app.baseMapLayer = L.esri.basemapLayer(baseMap);
	app.map.addLayer(app.baseMapLayer);
	if (app.baseMapLayerLabels) app.map.removeLayer(app.baseMapLayerLabels);
	if (baseMap === 'Gray' || baseMap === 'Imagery' || baseMap === 'Terrain') {
		app.baseMapLayerLabels = L.esri.basemapLayer(baseMap + 'Labels');
		app.map.addLayer(app.baseMapLayerLabels);
	}
}

// Home Button (Default Extent)

(function () {
	'use strict';
	L.Control.DefaultExtent = L.Control.extend({
	options: {
		position: 'topleft',
		title: 'Zoom to default extent',
		className: 'leaflet-control-defaultextent'
	},

	onAdd: function (map) {
		this._map = map;
		return this._initLayout();
	},
	
	setCenter: function (center) {
		this._center = center;
		return this;
	},
	
	setZoom: function (zoom) {
		this._zoom = zoom;
		return this;
	},

	_initLayout: function () {
		var container = L.DomUtil.create('div', 'leaflet-bar ' +
		this.options.className);
		this._container = container;
		this._fullExtentButton = this._createExtentButton(container);

	L.DomEvent.disableClickPropagation(container);

	this._map.whenReady(this._whenReady, this);

	return this._container;
},
	_createExtentButton: function () {
		var link = L.DomUtil.create('a', this.options.className + '-toggle',
		this._container);
		link.href = '#';
		link.innerHTML = this.options.text;
		link.title = this.options.title;

		L.DomEvent
		.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
		.on(link, 'click', L.DomEvent.stop)
		.on(link, 'click', this._zoomToDefault, this);
		return link;
	},
	
	_whenReady: function () {
		if (!this._center) {
			this._center = this._map.getCenter();
		}
		if (!this._zoom) {
			this._zoom = this._map.getZoom();
		}
		return this;
	},
	
	_zoomToDefault: function () {
		this._map.setView(this._center, this._zoom);
		}
	});

	L.Map.addInitHook(function () {
		if (this.options.defaultExtentControl) {
			this.addControl(new L.Control.DefaultExtent());
		}
	});

	L.control.defaultExtent = function (options) {
		return new L.Control.DefaultExtent(options);
	};

	return L.Control.DefaultExtent;

}());

// End Home Button
