var margin = {top: 25, right: 30, bottom: 0, left: 92},
    width = 595 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom,
    numberFormat = d3.format(".0f");

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .2);

var x = d3.scale.linear()
    .range([0, width]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top")
    .tickSize(height);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var y0;
var y99;

var selectedIndicator;
var selectedVariable;
var selectedYear = 2016;
var selectedCountry;
var zeroLine;
var minValue;
var transition;

var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden");

d3.csv("int_data.csv", function(error, data) {

  data.forEach(function(d) {

    d.but1_2010 = +d.total_2010;
    d.stack1_2010 = +d.crony_2010;
    d.stack2_2010 = +d.clean_2010;
    d.stack3_2010 = +d.clean_2010;
    d.but2_2010 = +d.crony_2010;
    d.but3_2010 = +d.clean_2010;
    //d.but4_2010 = +d.clean_2010;
    d.but5_2010 = +d.wealth;

    d.but1_2016 = +d.total_2016;
    d.stack1_2016 = +d.crony_2016;
    d.stack2_2016 = +d.clean_2016;
    d.stack3_2016 = +d.clean_2016;
    d.but2_2016 = +d.crony_2016;
    d.but3_2016 = +d.clean_2016;
    //d.but4_2016 = +d.clean_2016;
    d.but5_2016 = +d.wealth;

  });

  y.domain(data.map(function(d) { return d.country; }));
  x.domain([0, d3.max(data, function(d) { return  d.but1_2016; })]).nice();

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  var countries = svg.selectAll(".bar")
    .data(data);

  countries
    .enter().append("rect")
    .attr("class", function(d) { return "bar bar1 " + d.country; })
    .attr("y", function(d) { return y(d.country); })
    .attr("height", y.rangeBand())
    .attr("x", function(d) {return 1;})
    .attr("width", function(d) {return Math.abs(x(d.but1_2016) - x(0)); - 1 });
    //.attr("x", function(d) {return Math.abs(x(eval("d.but1_" + selectedYear)) - x(eval("d.stack1_" + selectedYear)));})
    //.attr("width", function(d) {return Math.abs(x(eval("d.but2_" + selectedYear))); });

  countries
    .enter().append("rect")
    .attr("class", function(d) { return "bar bar2 " + d.country; })
    .attr("y", function(d) { return y(d.country); })
    .attr("height", y.rangeBand())
    .attr("x", function(d) {return 1;})
    .attr("width", function(d) {return Math.abs(x(d.but1_2016) - x(d.but3_2016)); - 1});
    //.attr("x", function(d) {return Math.abs(x(eval("d.but1_" + selectedYear)) - x(eval("d.stack1_" + selectedYear)) -
    //  x(eval("d.stack2_" + selectedYear)));})
    //.attr("width", function(d) {return Math.abs(x(eval("d.but3_" + selectedYear))); });

/*
  countries
    .enter().append("rect")
    .attr("class", function(d) { return "bar bar3 " + d.country; })
    .attr("y", function(d) { return y(d.country); })
    .attr("height", y.rangeBand())
    .attr("x", function(d) {return 1;})
    .attr("width", function(d) {return Math.abs(x(d.but1_y2) - x(d.stack1_y2) - x(d.stack2_y2)); - 1 });
*/

  zeroLine = d3.select(".x.axis")
    .append("line")
    .attr("class", "zeroLine");

  d3.select(".zeroLine")
    .attr("x1", x(0))
    .attr("y1", 0)
    .attr("x2", x(0))
    .attr("y2", -height)
    .style("stroke", "#0a0906")
    .style("stroke-width", "1px");


  d3.selectAll(".y.axis .tick text")
    .data(data)
    .attr("id", function(d) {return d.country.split(' ').join('_');});

  d3.selectAll("#indicators .button").on("click", changeIndicator);
  d3.selectAll("#years .button").on("click", changeYear);



  d3.selectAll(".bar")
    .on("mouseover", function(d){

      tooltip
        .html(
          "<h2><strong>" + "Total wealth:</strong> " + (selectedYear) + "</h2>" +
          "<p><strong>" + "Crony sector wealth:</strong> " + numberFormat(eval("d.but2_" + selectedYear)) + "</p>" +
          "<p><strong>" + "Non-crony sector wealth:</strong> " + numberFormat(eval("d.but3_" + selectedYear)) + "</p>" +
          "<p><strong>" + "To come:</strong> " + numberFormat(eval("d.stack3_" + selectedYear)) + "</p>"
          );

    return tooltip.style("visibility", "visible");

  })
  .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
  .on("mouseout", function(){return tooltip.style("visibility", "hidden");});




  function changeIndicator() {
          d3.selectAll("#indicators .button")
            .classed("selected",false);

          d3.select(this)
            .classed("selected",true);

          d3.selectAll("#indicators .button")
            .style("opacity",0.4);

          d3.select(this)
            .style("opacity",1);

          updateChart();
  }

//change years button function
  function changeYear() {
    d3.selectAll("#years .button")
      .classed("selected",false);
    d3.select(this)
      .classed("selected",true);
    updateChart();
  }


//functions to call in individual bars
  function updateChart() {

    selectedIndicator = d3.select("#indicators .selected").property("id");
    selectedYear = d3.select("#years .selected").property("id");
    selectedVariable = selectedIndicator + "_" + selectedYear


    if (selectedIndicator=="but1") {
        console.log("button1")

        d3.selectAll(".bar1 ")
        .attr("y", function(d) { return y(d.country); })
        .attr("height", y.rangeBand())
        .attr("x", function(d) {return 1;})
        .attr("width", function(d) {return Math.abs(x(d.but1_2016) - x(0)); - 1 })
        .style("fill","#00ACDD");

          d3.selectAll(".bar2 ")
          .attr("y", function(d) { return y(d.country); })
          .attr("height", y.rangeBand())
          .attr("x", function(d) {return 1;})
          .attr("width", function(d) {return Math.abs(x(d.but1_2016) - x(d.but3_2016)); - 1})
          .style("fill","#003D58");
    }
    else if (selectedIndicator=="but2") {
        d3.select("#header h2")
          .text("Crony sector wealth as a % of GDP");

        d3.selectAll(".bar")
          .style("fill","#003D58");

    } else if (selectedIndicator=="but3") {
          d3.select("#header h2")
            .text("Non crony sector wealth as a % of GDP");
          d3.selectAll(".bar")
            .style("fill","#00ACDD");
        /*} else if (selectedIndicator=="but4") {
          d3.select("#header h2")
            .text("Descp to come");
          d3.selectAll(".bar")
            .style("fill","#0078B2"); */
    } else if (selectedIndicator=="but5") {
          d3.select("#header h2")
            .text("Crony sector wealth, $bn");
          d3.selectAll(".bar")
            .style("fill","#d95f0e");
    }


    // y0 = y.domain(data.sort(function(a, b) {return eval("b." + selectedVariable) - eval("a." + selectedVariable);})
    //   .map(function(d) { return d.country; }));

    minValue = d3.min(data, function(d) { return eval("d." + selectedVariable); });

    //y99 = y.domain(data.sort(function(i, j) {return eval("i." + selectedVariable);})
    //  .map(function(k) { return k.country; }));

    x = d3.scale.linear()
      .range([0, width]);

    if (minValue < 0) {
      x.domain([d3.min(data, function(d) { return eval("d." + selectedVariable);}), d3.max(data, function(d) { return eval("d." + selectedVariable); })]).nice();
    } else {
      x.domain([0, d3.max(data, function(d) { return eval("d." + selectedVariable); })]).nice();
    }

    xAxis = d3.svg.axis()
      .scale(x)
      .orient("top")
      .tickSize(height);

    d3.select(".x.axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    d3.select(".zeroLine")
      .attr("x1", x(0))
      .attr("y1", 0)
      .attr("x2", x(0))
      .attr("y2", -height)
      .style("stroke", "#0a0906")
      .style("stroke-width", "1px");

    if (minValue < 0) {
      d3.select(".zeroLine")
        .style("stroke", "#e11b17")
    }



    if (selectedIndicator=="but1") {

    d3.selectAll("#indicators .button")
      .style("opacity",1);

    d3.select("#header h2")
        .text("Billionaire wealth as a % of GDP");

    d3.selectAll(".bar")
      //.sort(function(a, b) { return y0(a.country) - y0(b.country); });
      .sort(function(a, b) { return y0(a.country); });

    d3.selectAll(".bar1")
      .transition()
      .duration(300)
      .attr("x", function(d) {return Math.abs(x(eval("d.but1_" + selectedYear)) - x(eval("d.stack1_" + selectedYear))
        - x(eval("d.stack2_" + selectedYear)));})
      .style("fill","#003D58")
      .attr("width", function(d) {return Math.abs(x(eval("d.but2_" + selectedYear))); });

    d3.selectAll(".bar2")
      .transition()
      .duration(300)
      .attr("x", function(d) {return Math.abs(x(eval("d.but1_" + selectedYear)) - x(eval("d.stack2_" + selectedYear)));})
      .style("fill","#00ACDD")
      .attr("width", function(d) {return Math.abs(x(eval("d.but3_" + selectedYear))); });

/*
    d3.selectAll(".bar3")
      .transition()
      .duration(300)
      .attr("x", function(d) {return 1;})
      .style("fill","#0078B2")
      .attr("width", function(d) {return Math.abs(x(eval("d.but4_" + selectedYear))); });
*/

    transition = svg.transition().duration(700),
      delay = 350;

    transition.selectAll(".bar")
      .delay(delay)
      .attr("y", function(d) { return y0(d.country); });

    transition.select(".y.axis")
      .call(yAxis)
      .selectAll("g")
        .delay(delay);


  d3.selectAll(".bar")
    .on("mouseover", function(d){

      tooltip
        .html(
          "<h2><strong>" + "Billionaire wealth:</strong> " + numberFormat(eval("d.but1_" + selectedYear)) + "</h2>" +
          "<p><strong>" + "Crony sector wealth:</strong> " + numberFormat(eval("d.stack_" + selectedYear)) + "</p>" +
          "<p><strong>" + "Non-crony sector:</strong> " + numberFormat(eval("d.stack_" + selectedYear)) + "</p>"
          //"<p><strong>" + "Foreign debt:</strong> " + numberFormat(eval("d.freeze_debt_" + selectedYear)) + "</p>"
          );

    return tooltip.style("visibility", "visible");
  })
  .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
  .on("mouseout", function(){return tooltip.style("visibility", "hidden");});


    } else {

    minValue = d3.min(data, function(d) { return eval("d." + selectedVariable); });

    d3.selectAll(".bar")
      // .sort(function(a, b) { return y0(a.country) - y0(b.country); });

    d3.selectAll(".bar")
      .transition()
      .duration(300)
      .attr("x", function(d) { return x(Math.min(0, eval("d." + selectedVariable))) + 1; })
      .attr("width", function(d) { return Math.abs(x(eval("d." + selectedVariable)) - x(0)) - 1;});

    transition = svg.transition().duration(700),
      delay = 350;

    transition.selectAll(".bar")
      .delay(delay)
      .attr("y", function(d) { return y0(d.country); });

    transition.select(".y.axis")
      .call(yAxis)
      .selectAll("g")
        .delay(delay);

    d3.selectAll(".bar")
      .on("mouseover", function(d){})
      .on("mousemove", function(){})
      .on("mouseout", function(){});



    }

  }


d3.selectAll(".y.axis .tick text").on("click", function() {
  if (d3.select(this).attr("class")=="selected") {
    d3.select(this)
      .classed("selected",false);
} else {
    d3.select(this)
      .classed("selected",true);
}


});


});
