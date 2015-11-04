function makeList(data) {

	var currentData = byDate(data);
	// var currentData = byGroup(data);
	console.log(currentData);

	// console.log(data);
	currentData.forEach(function(d) {

		// d3.select("#viz3").append("div")
		// 	.attr("class", "item")
		// 	.html( '<span class="strong">'+d.item +'</span>'
		// 		+ ' $' + d.value
		// 		+'        ' + d.cdate);
		// console.log(d.item);

		d3.select("#viz3").append("div")
			.attr("class", "item")
			.html( d.cdate +
				'<span class="strong">'+d.item +'</span>' +
				'<span class="value">'+ '  $' + d.value +'</span>');
	});
}

function byDate(data) {

	return data.sort(function(a, b) { return a.date - b.date; });
}

function byGroup(data) {

	// var cData = byDate(data);

	return data.sort(function(a, b) { return a.group - b.group; });
}