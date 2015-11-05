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
				'<span class="value">'+ '  $' + d.value +'</span>')
			.on("mouseover", function() {
				var currentId = d.item + ' ' + d.cdate;

				rects.each(function(e) {
					var eId = e.item  + ' ' +  e.cdate;
					if(currentId == eId) {
						d3.select(this).style('stroke', 'black');
						d3.select(this).moveToFront();
						// d3.select(this).attr("stroke-width", 1);
					}
				});

				// d3.select(this).style('background-color', '#eeeeee');
				d3.select(this).style('font-weight', 600);
			})
			.on("mouseout", function() {
				var currentId = d.item + ' ' + d.cdate;

				rects.each(function(e) {
					var eId = e.item  + ' ' +  e.cdate;
					if(currentId == eId) {
						d3.select(this).style('stroke', d.color);
						// d3.select(this).attr("stroke-width", 1);
					}
				});
				// d3.select(this).style('background-color', 'white');
				d3.select(this).style('font-weight', 400);
			});
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
				'<span class="value">'+ '  $' + d.value +'</span>')
			.on("mouseover", function() {
				var currentId = d.item + ' ' + d.cdate;

				rects.each(function(e) {
					var eId = e.item  + ' ' +  e.cdate;
					if(currentId == eId) {
						d3.select(this).style('stroke', 'black');
						d3.select(this).moveToFront();
						// d3.select(this).attr("stroke-width", 2);
					}
				});

				// d3.select(this).style('background-color', '#eeeeee');
				d3.select(this).style('font-weight', 600);
			})
			.on("mouseout", function() {
				var currentId = d.item + ' ' + d.cdate;

				rects.each(function(e) {
					var eId = e.item  + ' ' +  e.cdate;
					if(currentId == eId) {
						d3.select(this).style('stroke', d.color);
						// d3.select(this).attr("stroke-width", 1);
					}
				});
				// d3.select(this).style('background-color', 'white');
				d3.select(this).style('font-weight', 400);
			});
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

