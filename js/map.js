/*
 *  Project: Rokkan Bootstrap - Google Map
 *  Description: A plugin to insert a Google map or maps into the DOM
 *  Author: Matt Lindeboom
 */

;(function ( $, window, document, undefined ) {
		var GeoMap = GeoMap || {};
		var map;
		GeoMap.markers = {locations: []}; //archive for all locations on the map
		var mapData;
		GeoMap.generatedMarker = [];
		var pluginName = "geoMap",
				defaults = {
						mapZoom: undefined,
						mapData: undefined,
						geoLocate: true,
						fitWindow: false,
						clickEl: undefined,
						navigation: false
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

				$(this.options.clickEl).on({
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
							self.generateMap();
						}
						if (opts.geoLocate) {
							if(navigator.geolocation) {
								navigator.geolocation.getCurrentPosition(function(position) {
										lat = position.coords.latitude;
										lng = position.coords.longitude;
										GeoMap.markers = { locations: [{ text: 'Your location', lat: lat, long: lng }] };
										self.generateMap(opts);
									});
									} else {
											handleError();
									}
						} else {
								self.generateMap();
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

				generateMap: function(opts) {
					var mapOptions = {
									zoom:6,
									center: new google.maps.LatLng(GeoMap.markers.locations[0].lat, GeoMap.markers.locations[0].long),
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
							getMarkers();


							function updateMap() {
								var latlng;
								var mapbounds;
								var bounds = new google.maps.LatLngBounds();
								i = GeoMap.generatedMarker.length;
								for (i ;i < GeoMap.markers.locations.length; i++) {
									
									latlng = new google.maps.LatLng(GeoMap.markers.locations[i].lat, GeoMap.markers.locations[i].long);

									GeoMap.generatedMarker[i] = new google.maps.Marker({
											position: latlng,
											map: map,
											animation: google.maps.Animation.DROP,
											zoom: 6
									});
										if (window.console) {console.log('Above build call', +i);}
										

									count = GeoMap.generatedMarker;

										buildNav(i);
									
									google.maps.event.addListener(count[i], 'click', (function(count, i) {
												return function() {
														infowindow.setContent(GeoMap.markers.locations[i].text);
														infowindow.open(map, count);
												};
										})(GeoMap.generatedMarker[i], i));
									mapbounds = new google.maps.LatLng(GeoMap.markers.locations[i].lat, GeoMap.markers.locations[i].long);
									bounds.extend(mapbounds);
								}
								map.fitBounds(bounds);
							}
							function getMarkers() {
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
									updateMap();
								}
							}
							function addMarkers(data) {

								for (j=0; j < options.mapsData.locations.length; j++) {
									GeoMap.markers.locations.push(options.mapsData.locations[j]);
								}
								updateMap();
							}
							function locationExists(position) {
								var _i, markerExists, _len, currentMarker;
								_i = 0;
								_len = GeoMap.markers.locations.length;
								markerExists = false;
								currentMarker = GeoMap.markers.locations[position];
								connect = GeoMap.generatedMarker.length;
								console.log(connect, currentMarker);
							}
							function buildNav(position) {
									if (window.console) {console.log('built '+ position);}
										$('#nav').append('<li class="'+GeoMap.markers.locations[position].id+'"><span></span><a href="">'+GeoMap.markers.locations[position].text+'</html></li>');
							}
							//buildNav();
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