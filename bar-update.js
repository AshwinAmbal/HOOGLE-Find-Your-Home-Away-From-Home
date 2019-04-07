/*
The base code is borrowed from
https://bl.ocks.org/charlesdguthrie/11356441

*/

const months = ["January", "February", "March","April", "May", "June", "July", "August", "September", "October", "November","December"]
const years = ["2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012"]


function delay() {
  return new Promise(resolve => setTimeout(resolve, 3000));
}

 // Create new chart
var chart = new HorizontalChart('#chart');
const yearElement = document.querySelector('#bar-chart-year');
const stateElement = document.querySelector('#bar-chart-state');
const monthElement = document.querySelector('#bar-chart-month');

 // Draw the chart
//  chart.draw(getData());
//  setInterval(function(){
//    chart.draw(getData());
//  }, 3000);	// every 3 seconds



 function HorizontalChart(id){
   this.id = id;
   var self = this;

   this.margin = {top: 0, right: 0, bottom: 0, left: 0};
   this.width = 600 - this.margin.left - this.margin.right;
   this.height = 500 - this.margin.top - this.margin.bottom;
   this.categoryIndent = 100;
   this.defaultBarWidth = 2000;

   this.color = d3.scale.ordinal()
     .range(["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"]);

   //Set up scales
   this.x = d3.scale.linear()
     .domain([0, this.defaultBarWidth])
     .range([0, this.width]);

   this.y = d3.scale.ordinal()
     .rangeRoundBands([0, this.height], 0.1, 0);

   //Create SVG element
   d3.select(this.id).selectAll("svg").remove();

   this.svg = d3.select(this.id).append("svg")
     .attr("width", this.width + this.margin.left + this.margin.right)
     .attr("height", this.height + this.margin.top + this.margin.bottom)
     .append("g")
     .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


   this.draw = function(data){
     // var margin=settings.margin, width=settings.width, height=settings.height, categoryIndent=settings.categoryIndent,
     // svg=settings.svg, x=settings.x, y=settings.y;
     //Reset domains
     this.y.domain(data.sort(function(a,b){
       return b["Total Rating"] - a["Total Rating"];
     })
       .map(function(d) { return d["Hotel Name"]; }));

     var barmax = d3.max(data, function(e) {
       return e["Total Rating"];
     });

     this.x.domain([0,barmax]);

     /////////
     //ENTER//
     /////////

     //Bind new data to chart rows
     //Create chart row and move to below the bottom of the chart
     var chartRow = this.svg.selectAll("g.chartRow")
       .data(data, function(d){ return d["Hotel Name"]});

     chartRow.transition()
       .duration(300)
       .remove();

     var newRow = chartRow
       .enter()
       .append("g")
       .attr("class", "chartRow")
       .attr("transform", "translate(0," + this.height + this.margin.top + this.margin.bottom + ")");

     //Add rectangles
     newRow.insert("rect")
       .attr("class","bar")
       .attr("x", 0)
       .attr("opacity",0)
       .style("fill", function (d, i) { return self.color(d["Hotel Name"])})
       .attr("height", this.y.rangeBand())
       .attr("width", function(d) { return self.x(d["Total Rating"]);})

     //Add value labels
     newRow.append("text")
       .attr("class","label")
       .attr("y", this.y.rangeBand()/2)
       .attr("x",0)
       .attr("opacity",0)
       .attr("dy",".35em")
       .attr("dx","0.5em")
       .text(function(d){return d["Total Rating"];});

     //Add Headlines
     newRow.append("text")
       .attr("class","category")
       .attr("text-overflow","ellipsis")
       .attr("y", this.y.rangeBand()/2)
       .attr("x", this.categoryIndent)
       .attr("opacity",0)
       .attr("dy",".35em")
       .attr("dx","0.5em")
       .text(function(d){return d["Hotel Name"]});


     //////////
     //UPDATE//
     //////////

     //Update bar widths
     chartRow.select(".bar").transition()
       .duration(300)
       .attr("width", function(d) { return self.x(d["Total Rating"]);})
       .attr("height", this.y.rangeBand())
       .attr("opacity",1);

     //Update data labels
     chartRow.select(".label").transition()
       .duration(300)
       .attr("opacity",1)
       .attr("y", this.y.rangeBand()/2)
       .tween("text", function(d) {
         var i = d3.interpolate(+this.textContent.replace(/\,/g,''), +d["Total Rating"]);
         return function(t) {
           this.textContent = i(t).toFixed(2);
         };
       });
     //Fade in categories
     chartRow.select(".category").transition()
       .duration(300)
       .attr("y", this.y.rangeBand()/2)
       .attr("opacity",1);

     ////////
     //EXIT//
     ////////

     //Fade out and remove exit elements
     chartRow.exit().transition()
       .style("opacity","0")
       .attr("transform", "translate(0," + (this.height + this.margin.top + this.margin.bottom) + ")")
       .remove();


     ////////////////
     //REORDER ROWS//
     ////////////////

     var delay = function(d, i) { return 200 + i * 30; };

     chartRow.transition()
       .delay(delay)
       .duration(900)
       .attr("transform", function(d){ return "translate(0," + self.y(d["Hotel Name"]) + ")"; });

   }
 }

//  setInterval(function(){
//    chart.draw(getData());
//  }, 3000);
let intervalYear = null
let intervalMonth = null
function drawChart({AB: state, NAME}) {

 d3.json(`data/${state}.json`, async (err, data) => {
    if(err) {
      console.log(err)
    }

    for (let year of years) {
      for (let month of months) {
        console.log(year, month)
        yearElement.innerText = year
        monthElement.innerText = month
        stateElement.innerText = NAME
        chart.draw(data[year][month])
        await delay()
      }
    }
  })
}

export default drawChart