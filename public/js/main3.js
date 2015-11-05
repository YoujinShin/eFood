// var parseDate = d3.time.format("%Y-%m").parse;
var parseDate = d3.time.format("%m/%d/%y").parse;
    // formatYear = d3.format("02d");
    // formatDate = function(d) { return "Q" + ((d.getMonth() / 3 | 0) + 1) + formatYear(d.getFullYear() % 100); };

var margin = {top: 10, right: 0, bottom: 20, left: 0},
    width = parseInt(d3.select('#viz').style('width'), 10) - margin.left - margin.right,
    height = parseInt(d3.select('#viz').style('height'), 10) - margin.top - margin.bottom;

var tooltip = d3.select("body")
  .append("div").attr("id", "tooltip");

var y0 = d3.scale.ordinal()
    .rangeRoundBands([height, 0], .1);

var y1 = d3.scale.linear();

var totalSpending = 0;
var dairySpending = 0;
var fruitSpending = 0;
var bakerySpending = 0;
var meatSpending = 0;
var drinkSpending = 0;

var allData;

// var x = d3.scale.ordinal()
//     .rangeRoundBands([0, width], .2, 0);

var x = d3.time.scale()
  .domain([ parseDate('10/12/15'), parseDate('10/17/15') ])
  .range([140, width - 60]);

var xWidth = x(parseDate('10/13/15')) - x(parseDate('10/12/15')) - 0.6;

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


////
d3.tsv("receipt_simple2.tsv", function(error, data) {


  data.forEach(function(d) {
    d.cdate = d.date;
    d.date = parseDate(d.date);
    d.value = +d.value;
    d.color = getColor(d.group);
    totalSpending = totalSpending + d.value;

    if(d.group == 1) { dairySpending = dairySpending + d.value; }
    else if(d.group == 2) { fruitSpending = fruitSpending + d.value; }
    else if(d.group == 3) { bakerySpending = bakerySpending + d.value; }
    else if(d.group == 4) { meatSpending = meatSpending + d.value; }
    else if(d.group == 5) { drinkSpending = drinkSpending + d.value; }
  });

  initMap(data);

  allData = data;

  d3.select("#total").text('$' + totalSpending);

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

  rects = group.selectAll("rect")
      .data(function(d) { return d.values; })
    .enter().append("rect")
      .style("fill", function(d) { return getColor(d.group); })
      .attr("x", function(d) { return x(d.date) - xWidth/2; })
      .attr("y", function(d) { return y1(d.value); })
      .attr("width", xWidth)
      .attr("stroke", function(d) { return getColor(d.group); })
      // .attr("width", x.rangeBand())
      .attr("height", function(d) { return y0.rangeBand() - y1(d.value); })
      .on("mouseover", function(d) {
        tooltip.text(d.item +" $ "+d.value);
        tooltip.style("visibility", "visible");
        d3.select(this).moveToFront();
        d3.select(this).style('stroke', 'black');
      })
      .on("mousemove", function(){
        tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+12)+"px");
      })
      .on("mouseout", function(){
        tooltip.style("visibility", "hidden");
        d3.select(this).style('opacity', 1);
        d3.select(this).style('stroke', function(d) { return getColor(d.group); });
      });

    labels = group.append("text")
      .attr("class", "group-label")
      .attr("x", 0)
      .attr("y", function(d) { return y1(d.values[0].value / 2); })
      .attr("text-anchor", "start")
      .style('cursor','pointer')
      .on("click", function(d) {
      
        var c = d3.select(this).style('fill');
        unselectLabels();

        if(c == "rgb(0, 0, 0)") {
          d3.select(this).style('fill', '#469438');
          selectItems(d.key);

          var currentText = getText(d.key);
          d3.select("#subTotal").style("visibility", "visible");
          d3.select("#subTotal").text(currentText);

        } else {
          d3.select(this).style('fill', '#000000');
          unselectItems(d.key);
          d3.select("#subTotal").style("visibility", "hidden");
        }
      })
      .text(function(d) { return getGroup(d.key); });


  function selectItems(key) {

    removeList();

    allData.forEach(function(d, i) {
      var currentItem = "item" + i;

      if(d.group == key) {

        d3.select("#viz3").append("div")
            .attr("id", currentItem)
            .attr("class", "item")
            // .style('background-color', '#def1da')
            .style('background-color', '#eeeeee')
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
                  }
                });

                d3.select(this).style('font-weight', 600);
              })
              .on("mouseout", function() {
                var currentId = d.item + ' ' + d.cdate;

                rects.each(function(e) {
                  var eId = e.item  + ' ' +  e.cdate;
                  if(currentId == eId) {
                    d3.select(this).style('stroke', d.color);
                  }
                });
                d3.select(this).style('font-weight', 400);
              });

        } else {

          d3.select("#viz3").append("div")
            .attr("id", currentItem)
            .attr("class", "item")
            .style('background-color', 'white')
            .html( d.cdate +
              '<span class="strong">'+d.item +'</span>' +
              '<span class="value">'+ '  $' + d.value +'</span>')
            .on("mouseover", function() {
              var currentId = d.item + ' ' + d.cdate;

              rects.each(function(e) {
                var eId = e.item  + ' ' +  e.cdate;
                if(currentId == eId) {
                  d3.select(this).moveToFront();
                  d3.select(this).style('stroke', 'black');
                }
              });

              d3.select(this).style('font-weight', 600);
            })
            .on("mouseout", function() {
              var currentId = d.item + ' ' + d.cdate;

              rects.each(function(e) {
                var eId = e.item  + ' ' +  e.cdate;
                if(currentId == eId) {
                  d3.select(this).style('stroke', d.color);
                }
              });
              d3.select(this).style('font-weight', 400);
            });
        }
    });
  }


  function unselectItems(key) {

    removeList();

    allData.forEach(function(d, i) {
      var currentItem = "item" + i;

          d3.select("#viz3").append("div")
            .attr("id", currentItem)
            .attr("class", "item")
            .style('background-color', 'white')
            .html( d.cdate +
              '<span class="strong">'+d.item +'</span>' +
              '<span class="value">'+ '  $' + d.value +'</span>')
            .on("mouseover", function() {
              var currentId = d.item + ' ' + d.cdate;

              rects.each(function(e) {
                var eId = e.item  + ' ' +  e.cdate;
                if(currentId == eId) {
                  d3.select(this).moveToFront();
                  d3.select(this).style('stroke', 'black');
                }
              });

              d3.select(this).style('font-weight', 600);
            })
            .on("mouseout", function() {
              var currentId = d.item + ' ' + d.cdate;

              rects.each(function(e) {
                var eId = e.item  + ' ' +  e.cdate;
                if(currentId == eId) {
                  d3.select(this).style('stroke', d.color);
                }
              });
              d3.select(this).style('font-weight', 400);
            });
    });
  }

  // group.filter(function(d, i) { return !i; }).append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + y0.rangeBand() + ")")
  //     // .attr("transform", "translate(0," + y0.rangeBand() + ")")
  //     .call(xAxis);

  var ty = y0.rangeBand() + 10;

  group.filter(function(d, i) { return !i; }).append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + ty + ")")
      // .attr("transform", "translate(0," + y0.rangeBand() + ")")
      .call(xAxis);

  // d3.selectAll("input").on("change", change);

  var timeout = setTimeout(function() {
    d3.select("input[value=\"stacked\"]").property("checked", true).each(change);
  }, 2000);

  function change() {
    console.log(this.value);
    clearTimeout(timeout);
    if (this.value === "multiples") transitionMultiples();
    else transitionStacked();
  }

  // function transitionMultiples() {
  //   var t = svg.transition().duration(750),
  //       g = t.selectAll(".group").attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });
  //   g.selectAll("rect").attr("y", function(d) { return y1(d.value); });
  //   g.select(".group-label").attr("y", function(d) { return y1(d.values[0].value / 2); })
  // }

  // function transitionStacked() {
  //   var t = svg.transition().duration(750),
  //       g = t.selectAll(".group").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
  //   g.selectAll("rect").attr("y", function(d) { return y1(d.value + d.valueOffset); });
  //   g.select(".group-label").attr("y", function(d) { return y1(d.values[0].value / 2 + d.values[0].valueOffset); })
  // }

  transitionStacked();
});


////
function transitionMultiples() {

  var t = svg.transition().duration(750),
      g = t.selectAll(".group").attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });

  g.selectAll("rect").attr("y", function(d) { return y1(d.value); });
  g.select(".group-label").attr("y", function(d) { return y1(d.values[0].value / 2); });

  d3.select('#mode_stack').style('border-color','rgba(0,0,0,0.34)');
  d3.select('#mode_multiples').style('border-color','rgba(0,0,0,1)');

  // update list
  unselectLabels();
  removeList();
  makeList_group(allData);

  d3.select("#subTotal").style("visibility", "hidden");
}

function transitionStacked() {

  var t = svg.transition().duration(750),
      g = t.selectAll(".group").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");

  g.selectAll("rect").attr("y", function(d) { return y1(d.value + d.valueOffset); });
  g.select(".group-label").attr("y", function(d) { return y1(d.values[0].value / 2 + d.values[0].valueOffset); });

  d3.select('#mode_stack').style('border-color','rgba(0,0,0,1)');
  d3.select('#mode_multiples').style('border-color','rgba(0,0,0,0.34)');

  // update list
  unselectLabels();
  removeList();
  makeList_date(allData);

  d3.select("#subTotal").style("visibility", "hidden");
}

function getColor(d) {

  // green
  if(d == 1) { return '#346f2a'; }
  else if(d == 2) { return '#469438'; }
  else if(d == 3) { return '#58b946'; }
  else if(d == 4) { return '#79c76a'; }
  else if(d == 5) { return '#9ad590'; }
}

function getGroup(d) {

  if(d == 1) { return 'Dairy'; }
  else if(d == 2) { return 'Fruits'; }
  else if(d == 3) { return 'Bakery'; }
  else if(d == 4) { return 'Meat'; }
  else if(d == 5) { return 'Drink'; }
}

d3.selection.prototype.moveToFront = function() {

  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

function unselectLabels() {

  labels.each(function(e) {
      d3.select(this).style("fill", "black");
  });
}

function getText(key) {

  if(key == 1) { return '$' + dairySpending +' - Dairy'; }
  else if(key == 2) { return '$' + fruitSpending +' - Fruits';  }
  else if(key == 3) { return '$' + bakerySpending +' - Bakery';  }
  else if(key == 4) { return '$' + meatSpending +' - Meat';  }
  else if(key == 5) { return '$' + drinkSpending +' - Drink';  }
}



