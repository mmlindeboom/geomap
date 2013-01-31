/*
 *  Project: Rokkan Bootstrap - Google Map
 *  Description: A plugin to insert a Google map or maps into the DOM
 *  Author: Matt Lindeboom
 */

;(function ( $, window, document, undefined ) {
		var map;
		var markers = {pinpoints: []}; //archive for all pinpoints on the map
		var newMarkers = {pinpoints: []}; //array to add new pinpoints on map
		var mapData;
		var generatedMarker = [];
		var pluginName = "geoMap",
				defaults = {
						mapZoom: undefined,
						mapData: undefined,
						geoLocate: true,
						fitWindow: false
				};

		// The actual plugin constructor
		function Plugin( element, options) {
				this.element = element;
				$element = $(element);
				canvas = $element.attr('id');
				this.options = $.extend( {}, defaults, options );
				self = this;
				this._defaults = defaults;
				this._name = pluginName;
				this.init(self);

				$('.addMarker').on({
					click: function() {
						console.log(self);
						self.addLocations(self);
					}
				});
		}

		Plugin.prototype = {
				init: function(self) {
						var opts = this.options; //hand off top level options to lower functions
						if (opts.mapData !== undefined) {
							self.generateMap(opts);
						}
						if (opts.geoLocate) {
							if(navigator.geolocation) {
								navigator.geolocation.getCurrentPosition(function(position) {
										lat = position.coords.latitude;
										lng = position.coords.longitude;
										markers = { pinpoints: [{ text: 'Your location', lat: lat, long: lng }] };
										self.generateMap(opts);
									});
									} else {
											handleError();
									}
						} else {
								self.generateMap(opts);
						}
						
				},
				addLocations : function(self, opts) {
						self.generateMap({
						mapData: 'data/map-data-set.js'
					});
				},
				
				generateMap : function(opts) {

							var defaults = {
								mapData: opts.mapData
							};
							var options = $.extend(defaults, options);

							var mapOptions = {
									zoom:6,
									center: new google.maps.LatLng(markers.pinpoints[0].lat, markers.pinpoints[0].long),
									mapTypeId: google.maps.MapTypeId.ROADMAP
								};
							map = new google.maps.Map(document.getElementById(canvas), mapOptions);
							
							var infowindow = new google.maps.InfoWindow(), marker, i;
								console.log('The markers are ',markers.pinpoints);

							getMarkers(markers);

							function updateMap(markers) {
								console.log('Updating map.');
								var parseArray;
								i = generatedMarker.length;
								console.log(i);
								for (i ;i < markers.pinpoints.length; i++) {
									console.log('Inside the loop', i, map);
									generatedMarker[i] = new google.maps.Marker({
											position: new google.maps.LatLng(markers.pinpoints[i].lat, markers.pinpoints[i].long),
											map: map
											//animation: google.maps.Animation.DROP
									});
									newMarker = generatedMarker[i];
									google.maps.event.addListener(generatedMarker[i], 'click', (function(generatedMarker, i) {
												return function() {
														infowindow.setContent(markers.pinpoints[i].text);
														infowindow.open(map, generatedMarker);
												};
										})(generatedMarker[i], i));
								}
							}
							function getMarkers(markers) {
								if (options.mapData !== undefined) {
									$.ajax({
										type: 'get',
										url: options.mapData,
										success: function(data){
											//eval(data);
											options.mapsData = returnedMapData;
											addMarkers(options.mapsData);
										}
									});
								} else {
									console.log('We got to the else condition');
									updateMap(markers);
								}
							}
							function addMarkers(data) {
								for (j=0; j < options.mapsData.pinpoints.length; j++) {
									newMarkers.pinpoints.push(options.mapsData.pinpoints[j]);
								} 
								updateMarkers(newMarkers);
							}
							function updateMarkers(newMarkers) {
								for (k=0; k < newMarkers.pinpoints.length; k++) {
										markers.pinpoints.push(newMarkers.pinpoints[k]);
								}
								updateMap(markers);
							}
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