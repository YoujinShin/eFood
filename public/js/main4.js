function makeList(data) {

	// console.log(data);
	data.forEach(function(d) {

		d3.select("#viz3").append("div")
			.attr("class", "item")
			.html( '<span class="strong">'+d.item +'</span>'
				+ ' $' + d.value
				+'        ' + d.cdate);
		// console.log(d.item);
	});
}