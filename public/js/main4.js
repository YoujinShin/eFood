// var itemLists;

function makeList_date(data) {

	// byGroup(data);
	var currentData = byDate(data);
	currentData.forEach(function(d, i) {

		var currentItem = "item" + i;

		itemLists = d3.select("#viz3").append("div")
			.attr("id", currentItem)
			.attr("class", "item")
			.html( d.cdate +
				'<span class="strong">'+d.item +'</span>' +
				'<span class="value">'+ '  $' + d.value +'</span>');
	});
}

function makeList_group(data) {

	// byDate(data);
	var currentData = byGroup(data);
	currentData.forEach(function(d, i) {

		var currentItem = "item" + i;

		itemLists = d3.select("#viz3").append("div")
			.attr("id", currentItem)
			.attr("class", "item")
			.html( d.cdate +
				'<span class="strong">'+d.item +'</span>' +
				'<span class="value">'+ '  $' + d.value +'</span>');
	});
}

function byDate(data) {

	// var cData = data;
	return data.sort(function(a, b) { return a.date - b.date; });
}

function byGroup(data) {

	// var cData = data;
	return data.sort(function(a, b) { return a.group - b.group; });
}

function removeList() {

	allData.forEach(function(d, i) {
	    currentItem = "#item" + i;
	    d3.select(currentItem).remove();
	  });
}

