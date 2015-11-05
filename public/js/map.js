L.mapbox.accessToken = 'pk.eyJ1Ijoib2pvbGFvIiwiYSI6IlVMbWRBRDAifQ.fGYcIjLhkNO5xFAUcXNtmw';
// L.mapbox.accessToken = 'pk.eyJ1IjoibWVnZ29uYWd1bCIsImEiOiI1cFpUOE5RIn0.jooCCIM584kmRt2nkSOcHw'; //니꺼

var map = L.map('map', {
	// zoomControl: false
}).setView([40.7741815,-73.971451], 13);

// color: mapbox.emerald
// colorful: mapbox.wheatpaste
// basic: mapbox.streets
// grey: mapbox.high-contrast     mapbox.light
// satellite: mapbox.streets-satellite

var base_layer = L.mapbox.tileLayer('mapbox.streets');
base_layer.setOpacity(1);
base_layer.addTo(map);


function initMap(data) {

	// data.forEach(function(d) {

	// 	// d

	// 	// var marker = L.marker([lat, lon], {

	// 	// 	icon: L.mapbox.marker.icon({
	// 	// 		'marker-color': "#3bb2d0",
	// 	// 		'marker-size': "large"
	// 	// 	})
	// 	// });
	// });

	// whole foods	40.7753623	-73.9620333
	// trader joe's	40.778613	-73.9998775

	var marker = L.marker([40.7753623,	-73.9620333], {

			icon: L.mapbox.marker.icon({
				'marker-color': "#ff8888",
				'marker-size': "large"
			})
		}).addTo(map);


	var marker2 = L.marker([40.7461815,-73.991451], {

			icon: L.mapbox.marker.icon({
				'marker-color': "#ff8888",
				'marker-size': "large"
			})
		}).addTo(map);
	// marker.addTo(base_layer);
}

