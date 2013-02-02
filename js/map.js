/*
 *  Project: Rokkan Bootstrap - Google Map
 *  Description: A plugin to insert a Google map or maps into the DOM
 *  Author: Matt Lindeboom
 */

;(function ( $, window, document, undefined ) {
		var map;
		var markers = {pinpoints: []}; //archive for all pinpoints on the map
		var mapData;
		var generatedMarker = [];
		var pluginName = "geoMap",
				defaults = {
						mapZoom: undefined,
						mapData: undefined,
						geoLocate: true,
						fitWindow: false,
						clickEl: undefined
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
							self.generateMap(markers);
						}
						if (opts.geoLocate) {
							if(navigator.geolocation) {
								navigator.geolocation.getCurrentPosition(function(position) {
										lat = position.coords.latitude;
										lng = position.coords.longitude;
										markers = { pinpoints: [{ text: 'Your location', lat: lat, long: lng }] };
										self.generateMap(markers, opts);
									});
									} else {
											handleError();
									}
						} else {
								self.generateMap(markers);
						}
						
				},

				/*  addLocations method sets default mapData
				*  @desc: on el click, opts.mapData gets passed to generateMap
				*-------------------------------------------------------------*/
				addLocations : function(self, opts) {
						self.handleMarkers({
						mapData: 'data/map-data-set.js'
					});
				},

				generateMap: function(markers, opts) {
					var mapOptions = {
									zoom:6,
									center: new google.maps.LatLng(markers.pinpoints[0].lat, markers.pinpoints[0].long),
									mapTypeId: google.maps.MapTypeId.ROADMAP
								};
							map = new google.maps.Map(document.getElementById(canvas), mapOptions);
							self.handleMarkers(opts);
				},
				handleMarkers : function(opts) {

							var defaults = {
								mapData: opts.mapData
							};
							var options = $.extend(defaults, options);

							var infowindow = new google.maps.InfoWindow(), marker, i;

							// retrieve new markers via ajax
							getMarkers(markers);


							function updateMap(markers) {
								var latlng;
								var mapbounds;
								var bounds = new google.maps.LatLngBounds();
								i = generatedMarker.length;
								for (i ;i < markers.pinpoints.length; i++) {
									latlng = new google.maps.LatLng(markers.pinpoints[i].lat, markers.pinpoints[i].long);
									if (markers.pinpoints[i].lat === latlng.lat) {
										console.log(true);
										return true;
									}
									generatedMarker[i] = new google.maps.Marker({
											position: latlng,
											map: map,
											animation: google.maps.Animation.DROP,
											zoom: 6
									});
									
									google.maps.event.addListener(generatedMarker[i], 'click', (function(generatedMarker, i) {
												return function() {
														infowindow.setContent(markers.pinpoints[i].text);
														infowindow.open(map, generatedMarker);
												};
										})(generatedMarker[i], i));
									mapbounds = new google.maps.LatLng(markers.pinpoints[i].lat, markers.pinpoints[i].long);
									bounds.extend(mapbounds);
								}
								map.fitBounds(bounds);
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
									updateMap(markers);
								}
							}
							function addMarkers(data) {

								for (j=0; j < options.mapsData.pinpoints.length; j++) {
									markers.pinpoints.push(options.mapsData.pinpoints[j]);
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