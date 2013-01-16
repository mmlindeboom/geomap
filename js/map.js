/*
 *  Project: Rokkan Bootstrap - Google Map
 *  Description: A plugin to asynchronously insert a Google map or maps into the DOM
 *  Author: Matt Lindeboom
 */

;(function ( $, window, document, undefined ) {

    var mapData = {};

    var pluginName = "geoMap",
        defaults = {
            mapZoom: undefined,
            mapData: {},
            geoLocate: true,
            fitWindow: false
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        $element = $(element);
        canvas = $element.attr('id');

        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this.geoLocate();
        //this.init();
    }

    Plugin.prototype = {

        geoLocate: function() {
            var pos;
            var map;
            if(navigator.geolocation) {
                 navigator.geolocation.getCurrentPosition(function(position) {
                    pos = new google.maps.LatLng(position.coords.latitude,
                                                 position.coords.longitude);
                    generateMap(pos);
                  });

                  var generateMap = function() {
                     var defaults = {
                        mapsData:{}
                     };

                     var options = $.extend(defaults, options);
                     var mapOptions = {
                        zoom: 8,
                        center: pos,//new google.maps.LatLng(mapData.lat, mapData.long),
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                      };

                    map = new google.maps.Map(document.getElementById(canvas), mapOptions);

                     var contentString = "Your current location";
                        var infowindow = new google.maps.InfoWindow({
                          content: contentString
                       });

                    var marker = new google.maps.Marker({
                            position: map.getCenter(),
                            map: map,
                            title: 'Click to zoom',
                            animation: google.maps.Animation.DROP
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                      infowindow.open(map,marker);
                     });
                };
            } else {
                handleError();
            }
        },
        init: function(pos) {
            self = this;
            /* Setting up the map
            *----------------------*/
            
            console.log(pos);

            mapData =  { 'lat': this.options.latCoord, 'long': this.options.longCoord};
           
            var mapOptions = {
                zoom: this.options.mapZoom,
                center: pos,//new google.maps.LatLng(mapData.lat, mapData.long),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById(canvas), mapOptions);

          

        

            var contentString = document.title;
            var infowindow = new google.maps.InfoWindow({
              content: contentString
           });
            var marker = new google.maps.Marker({
                position: map.getCenter(),
                map: map,
                title: 'Click to zoom'
            });

            /* Listeners
            *-------------*/
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map,marker);
            });
             

            $('.addMarker').on({
                click: function(){

                 self.addNewMarker([-25.363882,131.044922], {
                    mapZoom:14
                    //fitWindow: this.fitWindow
                 });
                }
            });
            /* Options
            *----------*/

            if (this.options.fitWindow) {
                    $element.css({width: $(window).width(), height: $(window).height(), position: 'absolute', 'z-index': 1, top:0, left:0, margin:0});
            }
        },

        addNewMarker: function(el, options) {
            var newLatLng = new google.maps.LatLng(el[0], el[1]);
             var mapOptions = {
                zoom: options.mapZoom,
                center: newLatLng,
                mapTypeId: google.maps.MapTypeId.SATELLITE
            };
            var map = new google.maps.Map(document.getElementById(canvas), mapOptions);
            var newMarker = new google.maps.Marker({
                position: newLatLng,
                map: map,
                animation: google.maps.Animation.DROP
            });
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