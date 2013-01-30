/* REQUIRED: =====================================
- plugins.base.js
- this plugin requires link to google maps api in the html page:
    <script src="//maps.googleapis.com/maps/api/js?sensor=false"></script>
================================================== */

// Check if Stat object exists, if so use it, if not create one as a new object
var Stat = Stat || {};

// Add an object property to the Stat object to hold the map data settings
Stat.map = {
    created: 0,
    object: '',
    lineObject: '',
    markerCount: 0,
    pinLocation: [],
    marker: [],
    infowindow: []
    };
/*  JQUERY EXTENSIONS
================================================== */
jQuery.fn.extend({

    /*  Get Geo Location
    ================================================== */
    
    geoLocate: function(options){

        // Default settings in case the developer didn't pass in arguments
        var defaults = {
            mapsData: {},
            gutter: null,
            minWidth: null
        };
        
        // Modifies any default properties with custom properties that were passed into this carousel method as an arguement object
        var options = $.extend(defaults, options);
    
        // Store DOM element as variable, also derive ID string to pass into google maps class
        var target = $(this);
        
            
        if(options.gutter != null){
            var windowWidth = $(window).width();
            if(windowWidth < options.minWidth){
                var canvasWidth = (windowWidth - (options.gutter - (options.minWidth - windowWidth))) + 'px';
            } else {
                var canvasWidth = (windowWidth - options.gutter) + 'px';
            }
            
            target.css('width', canvasWidth);
        }   

  
        
        // setup a callback function for geo location function
        function executeGoogleMaps(loc){
        
            // create an object to story lat, long to pass into google maps method
            var geoCoord = {};
                geoCoord.lat = loc.coords.latitude;
                geoCoord.long = loc.coords.longitude;
                //Geo location long and lat should be passed in with query string parameters 
            $.ajax({
                type: 'get',
                url: 'assets/ajax-data/map-data-set.js',
                success: function(data){
                    eval(data);
                    $('#map_canvas').genGoogleMap({
                        mapsData: returnedMapData
                   })   
                },
                error: function(){
                    if(window.console) console.log('Dah! There is an AJAX fetch error!')
                }
            })

        }
        
        // setup a error function for geo location function
        function handleError(){
            if(window.console) console.log('Hm, weirdness in Geo Location');
            //If Geo location denied, server side solution needed, eg, IP base location detection
            $.ajax({
                type: 'get',
                url: 'assets/ajax-data/map-data-set.js',
                success: function(data){
                    eval(data);
                    $('#map_canvas').genGoogleMap({
                        mapsData: returnedMapData    
                   })   
                    
                },
                error: function(){
                    if(window.console) console.log('Dah! There is an AJAX fetch error!')
                }
            })

        }
        
        // Check if Geolocation feature is supported by browser
        if(navigator.geolocation){
        
            navigator.geolocation.getCurrentPosition(executeGoogleMaps, handleError, {maximumAge:100});
            
        } else {
            if(window.console) console.log('No Geo');
            $.ajax({
                type: 'get',
                url: 'assets/ajax-data/map-data-set.js',
                success: function(data){
                    eval(data);
                    $('#map_canvas').genGoogleMap({
                        mapsData: returnedMapData        
                   })   
                    
                },
                error: function(){
                    if(window.console) console.log('Dah! There is an AJAX fetch error!')
                }
            })

        }
    
    },

    /*  Google Maps Generator
    ================================================== */
    genGoogleMap: function(options){
    
        // Default settings in case the developer didn't pass in arguments
        var defaults = {
            mapsData:{},
            gutter: null,
            minWidth: null,    //expects integer
            geoLocate: false,       // used only by the geolocate method
            liveCoord: {}      // object only passed in by geolocate method
            
        };
        
        // Modifies any default properties with custom properties that were passed into this carousel method as an arguement object
        var options = $.extend(defaults, options);
    
        // Store DOM element as variable, also derive ID string to pass into google maps class
        var target = $(this),
            targetIDString = target.id;
        
        
        if(options.gutter != null){
            var canvasWidth = ($(window).width() - options.gutter) + 'px';
            target.css('width', canvasWidth);
        }   
        
        //if(window.console){console.log(targetIDString)};  
        
        // Reassign the Map data object containing all the pin coordinates  
        var mapsData = options.mapsData;
        //if(window.console){console.log(mapsData);};   
        
        
        
        // Create map view
        var latlng = new google.maps.LatLng(0, 0);
        
        // Create options to pass in google maps
        var myOptions = {
            zoom: 8,
            center: latlng,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            keyboardShortcuts: false, 
            navigationControlOptions: {style: google.maps.NavigationControlStyle.LARGE},
            scaleControl: true
        };
        
        // Create the map object, but if one is already created use that instead
        var map; 
        
        if(Stat.map.created){
            map = Stat.map.object;
        } else {
            Stat.map.object = new google.maps.Map(document.getElementById('map_canvas'), myOptions);
            map = Stat.map.object;
            Stat.map.created = true;
        }
        
        // Clear out the previous markers
        for (i in Stat.map.marker) {
            Stat.map.marker[i].setMap(null);
        };
       Stat.map.marker.length = 0;
        
        // Create a bounds object use to auto center the map
        var mapbounds = new google.maps.LatLngBounds();
        
        // Create array to hold values associated with each pin, used in the "for" loop
        Stat.map.pinLocation = new Array();
        Stat.map.marker = new Array();
        Stat.map.infowindow = new Array();
        
        // if(window.console){console.log(mapsData.pinpoints.length)};
        
        // Iterate through the mapsData JSON object and generate location points
        
            for(var i = 0; i < mapsData.pinpoints.length; i++){
            
                var lat = mapsData.pinpoints[i].lat,
                    long = mapsData.pinpoints[i].long,
                    title = mapsData.pinpoints[i].title,
                    descript = mapsData.pinpoints[i].descript,
                    pin = mapsData.pinpoints[i].imgUrl;
                        
                // Assign location  
                Stat.map.pinLocation[i] = new google.maps.LatLng(lat, long);    
            
                // Create new pin and add it on to the map
                Stat.map.marker[i] = new google.maps.Marker({
                    position: Stat.map.pinLocation[i],
                    title: title,
                    map: map,
                    icon: pin,
                    arrayIndexLoc: i
                });
                
                // http://google-maps-utility-library-v3.googlecode.com/svn/tags/infobox/1.1.9/docs/reference.html
                // Create a div element that will contain the content within the infobox
                var contentString =  '<div class="infoWindow"><h3>' + title + '</h3>' +
                                     '<p>' + descript + '</p>' + 
                                     '<a href="#">Get Directions</a><br /><br />' +
                                     '<a href="#" id="visit"><img src="assets/imgs/buttons/visit-harrahs-btn.png" border="0"></a><span id="rates">Rates from</span><span id="promotion-price">$99</span></div>';
                
                Stat.map.infowindow[i] = new google.maps.InfoWindow({
                content: contentString
                    });
                    
                google.maps.event.addListener(Stat.map.marker[i], "click", function(e){
                    var j = this.arrayIndexLoc;
                    Stat.map.infowindow[j].open(map, this);
                });
                // Re-zoom the map to fit all the data points.
                mapbounds.extend(Stat.map.pinLocation[i]);

        }
        
        
        // center and set the zoom level of the map
        
        map.setCenter(mapbounds.getCenter());
        map.fitBounds(mapbounds);
        map.setZoom(8);
        
        
        // return the ID element for chainability
        return this;
    }
});


