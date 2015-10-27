var width = $(window).width()*0.92,
    height = $(window).height()*0.78;

var tooltip = d3.select("body")
  .append("div").attr("id", "tooltip");

var svg = d3.select("#viz").append("svg")
    .attr("width", width).attr("height", height);

// var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

// var dateScale = d3.time.scale()
//     .domain([100, width-100])
//     .range([ parseDate('2015-08-05 0:0:0'), parseDate('2015-09-08 23:59:59') ]);

var parseDate = d3.time.format("%m/%d/%y").parse;

var dollarScale = d3.time.scale()
    .domain([0, 100])
    .range([ 0, 80 ]);

var dateScale = d3.time.scale()
	.domain([ parseDate('10/12/15'), parseDate('10/17/15') ])
    .range([220, width-100]);

var yScale = d3.time.scale()
	.domain([ 0, 6 ])
    .range([ 80, height-100]);
    

var xScale = d3.time.scale()
	.domain([ parseDate('10/12/15'), parseDate('10/17/15') ])
	// .domain([ parseDate('5/20/15'), parseDate('6/21/15') ])
	.range([220, width - 100]);

var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient('bottom')
	.ticks(7);

// var x = d3.scale.linear()
// 	.domain([parseDate('10/12/15'), 2]).range([0, ])

// Load Data
queue()
    // .defer(d3.json, 'ehsanvazifeh.json')
    // .defer(d3.json, 'poyahaghnegahdar.json')
    .defer(d3.csv, 'receipt.csv')
    .await(makeViz);


// Make Visualization
function makeViz(error, data) {

	var ty = height - 40;

	svg.append("g")            // Add the X Axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + ty + ")")
        .call(xAxis);


    for(var i = 0; i < 7; i++) {

    	svg.append("text")
    		.attr("class", "category")
    		.attr("x", 20).attr("y", yScale(i))
    		.text(getCategory(i));

    	if(i % 2 == 0) {
    		svg.append("rect")
    			.attr("x", 0)
    			.attr("y", yScale(i) - yScale(0)/2+ 5)
    			.attr("width", width)
    			.attr("height",yScale(0)-10)
    			.style("fill", 'rgba(0,0,0,0.03)');
    	}
    }

	data.forEach(function(d, i) {
	
		d.cdate = d.date;
		d.date = parseDate(d.date);
		d.id = +d.id;

		d.color = getColor( d.category );
		console.log(d);
	});

	circles = svg.selectAll("circles")
		.data(data).enter().append("circle")
			.attr("cx", function(d) { 
				return dateScale(d.date);
				// return Math.random()*width*0.6; 
			})
			.attr("cy", function(d) { 
				return yScale( getCPos(d.category) ); 
			})
			.attr("r", function(d) { return dollarScale(d.total_price); })
			.style("fill", function(d) {return "#41c4de";})
			.style("opacity", 1)
			.on("mouseover", function(d) {
				tooltip.text(d.item +" $ "+d.total_price);
				tooltip.style("visibility", "visible");
			})
			.on("mousemove", function(){
				tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+12)+"px");
			})
			.on("mouseout", function(){
				tooltip.style("visibility", "hidden");
			});

	// svg.append("line")
	// 	.attr("x1", 100).attr("y1", height/2)
	// 	.attr("x2", width -100).attr("y2", height/2)
	// 	.attr("stroke", "grey");
}

function getColor(category) {

	if(category == "dairy") { return "red"; }
	else if(category == "fruits") { return "blue"; }
	else if(category == "bakery") { return "green"; }
	else if(category == "boxed goods") { return "yellow"; }
	else if(category == "drink") { return "grey"; }
	else if(category == "meat") { return "purple"; }
	else if(category == "veggies") { return "orange"; }
}

function getCPos(category) {

	if(category == "dairy") { return 0; }
	else if(category == "fruits") { return 1; }
	else if(category == "bakery") { return 2; }
	else if(category == "boxed goods") { return 3; }
	else if(category == "drink") { return 4; }
	else if(category == "meat") { return 5; }
	else if(category == "veggies") { return 6; }
}

function getCategory(d) {

	if(d == 0) { return "dairy"; }
	else if(d == 1) { return "fruits"; }
	else if(d == 2) { return "bakery"; }
	else if(d == 3) { return "boxed goods"; }
	else if(d == 4) { return "drink"; }
	else if(d == 5) { return "meat"; }
	else if(d == 6) { return "veggies"; }
}




