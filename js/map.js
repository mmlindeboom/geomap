/*
 *  Project: Rokkan Bootstrap - Google Map
 *  Description: A plugin to asynchronously insert a Google map or maps into the DOM
 *  Author: Matt Lindeboom
 */

;(function ( $, window, document, undefined ) {

		//var mapData = {};
		var map;
		var markers = {pinpoints: []};

		var pluginName = "geoMap",
				defaults = {
						mapZoom: undefined,
						mapData: {},
						geoLocate: true,
						fitWindow: false
				};

		// The actual plugin constructor
		function Plugin( element, options) {
				this.element = element;
				$element = $(element);
				canvas = $element.attr('id');

				this.options = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.geoLocate();
		}

		Plugin.prototype = {
				geoLocate: function() {
						if (this.options.geoLocate) {
							if(navigator.geolocation) {
								navigator.geolocation.getCurrentPosition(function(position) {
										lat = position.coords.latitude;
										lng = position.coords.longitude;
										markers = { pinpoints: [{ text: 'Your location', lat: lat, long: lng }] };
										generateMap();
									});
									} else {
											handleError();
									}
						} else {
								generateMap();
						}
						var generateMap = function() {
							var defaults = {
								mapsData: {}
							};
							//markers = { pinpoints : [{text:"Philadelphia", lat:39.998012, long: -75.144793},{text: "boston", lat:42.321597, long: -71.089115 }]};
							var options = $.extend(defaults, options);
								$.ajax({
									type: 'get',
									url: 'data/map-data-set.js',
									success: function(data){
										//eval(data);
										options.mapsData = returnedMapData;
										addMarkers(options.mapsData);
									}
							});
								function addMarkers(data) {
									for (j=0; j < options.mapsData.pinpoints.length; j++) {
										markers.pinpoints.push(options.mapsData.pinpoints[j]);
									}
									updateMap(markers);
								}
							var mapOptions = {
									zoom:6,
									center: new google.maps.LatLng(markers.pinpoints[0].lat, markers.pinpoints[0].long),
									mapTypeId: google.maps.MapTypeId.ROADMAP
								};
							map = new google.maps.Map(document.getElementById(canvas), mapOptions);
							var infowindow = new google.maps.InfoWindow(), marker, i;
								console.log('The markers are ',markers.pinpoints);
							
							function updateMap(markers) {
								for (i = 0; i < markers.pinpoints.length; i++) {
									marker = new google.maps.Marker({
											position: new google.maps.LatLng(markers.pinpoints[i].lat, markers.pinpoints[i].long),
											map: map,
											animation: google.maps.Animation.DROP
									});
									google.maps.event.addListener(marker, 'click', (function(marker, i) {
												return function() {
														infowindow.setContent(markers.pinpoints[i].text);
														infowindow.open(map, marker);
												};
										})(marker, i));
								}
							}
							
						};
				},

				fitWindow: function() {
						console.log('Fitting');
						$element.css({width: $(window).width(), height: $(window).height(), position: 'absolute', 'z-index': 1, top:0, left:0, margin:0});
				}
		};


		$.fn[pluginName] = function ( options ) {
				return this.each(function () {
						if (!$.data(this, "plugin_" + pluginName)) {
								$.data(this, "plugin_" + pluginName, new Plugin( this, options ));
						}
				});
		};

})( jQuery, window, document );