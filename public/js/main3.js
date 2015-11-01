// var parseDate = d3.time.format("%Y-%m").parse;
var parseDate = d3.time.format("%m/%d/%y").parse;
    // formatYear = d3.format("02d");
    // formatDate = function(d) { return "Q" + ((d.getMonth() / 3 | 0) + 1) + formatYear(d.getFullYear() % 100); };

var margin = {top: 10, right: 40, bottom: 40, left: 40},
    width = parseInt(d3.select('#viz').style('width'), 10) - margin.left - margin.right,
    height = parseInt(d3.select('#viz').style('height'), 10) - margin.top - margin.bottom;

var tooltip = d3.select("body")
  .append("div").attr("id", "tooltip");

var y0 = d3.scale.ordinal()
    .rangeRoundBands([height, 0], .2);

var y1 = d3.scale.linear();

// var x = d3.scale.ordinal()
//     .rangeRoundBands([0, width], .2, 0);

var x = d3.time.scale()
  // .domain([ parseDate('2008-01'), parseDate('2009-07')])
  .domain([ parseDate('10/12/15'), parseDate('10/17/15') ])
  .range([120, width - 40]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    // .tickFormat(formatDate);
    .ticks(5)
    .tickFormat(d3.time.format("%m/%d/%y"));

var nest = d3.nest()
    .key(function(d) { return d.group; });

var stack = d3.layout.stack()
    .values(function(d) { return d.values; })
    .x(function(d) { return d.date; })
    .y(function(d) { return d.value; })
    .out(function(d, y0) { d.valueOffset = y0; });

var color = d3.scale.category10();

var svg = d3.select("#viz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.tsv("receipt_simple2.tsv", function(error, data) {

  data.forEach(function(d) {
    d.date = parseDate(d.date);
    d.value = +d.value;
  });


  console.log(data);
  var dataByGroup = nest.entries(data);

  stack(dataByGroup);

  // x.domain(dataByGroup[0].values.map(function(d) { return d.date; }));
  y0.domain(dataByGroup.map(function(d) { return d.key; }));
  y1.domain([0, d3.max(data, function(d) { return d.value; })]).range([y0.rangeBand(), 0]);

  var group = svg.selectAll(".group")
      .data(dataByGroup)
    .enter().append("g")
      .attr("class", "group")
      .attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });

  group.append("text")
      .attr("class", "group-label")
      .attr("x", 40)
      .attr("y", function(d) { return y1(d.values[0].value / 2); })
      .attr("dy", ".32em")
      .text(function(d) { return "Group " + d.key; });

  group.selectAll("rect")
      .data(function(d) { return d.values; })
    .enter().append("rect")
      .style("fill", function(d) { return color(d.group); })
      .attr("x", function(d) { return x(d.date) - 20; })
      .attr("y", function(d) { return y1(d.value); })
      .attr("width", 40)
      // .attr("width", x.rangeBand())
      .attr("height", function(d) { return y0.rangeBand() - y1(d.value); })
      .on("mouseover", function(d) {
        tooltip.text(d.item +" $ "+d.value);
        tooltip.style("visibility", "visible");
        // console.log(d.item);
        d3.select(this).style('opacity', 0.82);
      })
      .on("mousemove", function(){
        tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+12)+"px");
      })
      .on("mouseout", function(){
        tooltip.style("visibility", "hidden");
        d3.select(this).style('opacity', 1);
      });

  // group.filter(function(d, i) { return !i; }).append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + y0.rangeBand() + ")")
  //     // .attr("transform", "translate(0," + y0.rangeBand() + ")")
  //     .call(xAxis);

  group.filter(function(d, i) { return !i; }).append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + y0.rangeBand() + ")")
      // .attr("transform", "translate(0," + y0.rangeBand() + ")")
      .call(xAxis);

  d3.selectAll("input").on("change", change);

  var timeout = setTimeout(function() {
    d3.select("input[value=\"stacked\"]").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(timeout);
    if (this.value === "multiples") transitionMultiples();
    else transitionStacked();
  }

  function transitionMultiples() {
    var t = svg.transition().duration(750),
        g = t.selectAll(".group").attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });
    g.selectAll("rect").attr("y", function(d) { return y1(d.value); });
    g.select(".group-label").attr("y", function(d) { return y1(d.values[0].value / 2); })
  }

  function transitionStacked() {
    var t = svg.transition().duration(750),
        g = t.selectAll(".group").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
    g.selectAll("rect").attr("y", function(d) { return y1(d.value + d.valueOffset); });
    g.select(".group-label").attr("y", function(d) { return y1(d.values[0].value / 2 + d.values[0].valueOffset); })
  }
});
