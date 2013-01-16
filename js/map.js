/*
 *  Project: Rokkan Bootstrap - Google Map
 *  Description: A plugin to asynchronously insert a Google map or maps into the DOM
 *  Author: Matt Lindeboom
 */

;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "geoMap",
        defaults = {
            mapZoom: undefined,
            latCoord: undefined,
            longCoord: undefined,
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

        this.init();
    }

    Plugin.prototype = {
      
        init: function() {
            self = this;
            /* Setting up the map
            *----------------------*/

           
            var mapOptions = {
                zoom: this.options.mapZoom,
                center: new google.maps.LatLng(this.options.latCoord, this.options.longCoord),
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