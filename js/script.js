
(function($){
	//Initiate Map
	$('#map_canvas').geoMap();

	$('.addMarker').click(function(){
		console.log('addMarker has been clicked');
		$('#map_canvas').geoMap({
			mapData : 'data/map-data-set.js'
		});
	});
}(jQuery));