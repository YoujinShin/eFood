L.mapbox.accessToken = 'pk.eyJ1Ijoib2pvbGFvIiwiYSI6IlVMbWRBRDAifQ.fGYcIjLhkNO5xFAUcXNtmw';

var map = L.map('map', {
	// zoomControl: false
}).setView([40.7741815,-73.971451], 13);

////// Various Maps 
// color: mapbox.emerald
// colorful: mapbox.wheatpaste
// basic: mapbox.streets
// grey: mapbox.high-contrast     mapbox.light
// satellite: mapbox.streets-satellite

var base_layer = L.mapbox.tileLayer('mapbox.streets');
base_layer.setOpacity(1);
base_layer.addTo(map);


function initMap(data) {

	// whole foods
	var marker = L.marker([40.7753623,	-73.9620333], {

			icon: L.mapbox.marker.icon({
				'marker-color': "#ff8888",
				'marker-size': "large"
			})
		}).addTo(map);

	marker.bindPopup("<b>Whole Foods</b>").openPopup();

	// trader joe's
	var marker2 = L.marker([40.7461815,-73.991451], {

			icon: L.mapbox.marker.icon({
				'marker-color': "#ff8888",
				'marker-size': "large"
			})
		}).addTo(map);
	
	marker2.bindPopup("<b>Trader Joe's</b>").openPopup();
}

function showViz() {

	d3.select("#mode_viz").style("background-color", 'rgba(0,0,0,1)');
	d3.select("#mode_map").style("background-color", 'rgba(0,0,0,0.2)');

	d3.select("#viz").style("visibility", "visible");
	d3.select("#map").style("visibility", "hidden");
}

function showMap() {

	d3.select("#mode_viz").style("background-color", 'rgba(0,0,0,0.2)');
	d3.select("#mode_map").style("background-color", 'rgba(0,0,0,1)');

	d3.select("#viz").style("visibility", "hidden");
	d3.select("#map").style("visibility", "visible");
}


