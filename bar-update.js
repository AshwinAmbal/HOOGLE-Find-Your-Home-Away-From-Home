/*
The base code is borrowed from
https://bl.ocks.org/charlesdguthrie/11356441

*/

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const years = ["2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012"]


function delay() {
  return new Promise(resolve => setTimeout(resolve, 2500));
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



function HorizontalChart(id) {
  this.id = id;
  var self = this;
  this.shouldStopLooping = false;
  this.data = null;
  this.year = null;
  this.month = null;
  this.margin = { top: 0, right: 0, bottom: 0, left: 0 };
  this.width = 800 - this.margin.left - this.margin.right;
  this.height = 500 - this.margin.top - this.margin.bottom;
  this.categoryIndent = 100;
  this.defaultBarWidth = 2500;

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

  this.setData = (data, year, month) => {
    this.data = data
    this.year = year
    this.month = month
  }
  this.draw = function () {
    // var margin=settings.margin, width=settings.width, height=settings.height, categoryIndent=settings.categoryIndent,
    // svg=settings.svg, x=settings.x, y=settings.y;
    //Reset domains
    const data = this.data[this.year][this.month]

    this.y.domain(data.sort(function (a, b) {
      return b["Total Rating"] - a["Total Rating"];
    })
      .map(function (d) { return d["Hotel Name"]; }));

    var barmax = d3.max(data, function (e) {
      return e["Total Rating"];
    });

    this.x.domain([0, barmax]);

    /////////
    //ENTER//
    /////////

    //Bind new data to chart rows
    //Create chart row and move to below the bottom of the chart
    var chartRow = this.svg.selectAll("g.chartRow")
      .data(data, function (d) { return d["Hotel Name"] });

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
      .attr("class", "bar")
      .attr("x", 0)
      .attr("opacity", 0)
      .style("fill", function (d, i) { return self.color(d["Hotel Name"]) })
      .attr("height", this.y.rangeBand())
      .attr("width", function (d) { return self.x(d["Total Rating"]); })

    //Add value labels
    newRow.append("text")
      .attr("class", "label")
      .attr("y", this.y.rangeBand() / 2)
      .attr("x", 0)
      .attr("opacity", 0)
      .attr("dy", ".35em")
      .attr("dx", "0.5em")
      .text(function (d) { return d["Total Rating"]; });

    //Add Headlines
    newRow.append("text")
      .attr("class", "category")
      .attr("text-overflow", "ellipsis")
      .attr("y", this.y.rangeBand() / 2)
      .attr("x", this.categoryIndent)
      .attr("opacity", 0)
      .attr("dy", ".35em")
      .attr("dx", "0.5em")
      .text(function (d) { return d["Hotel Name"] });


    //////////
    //UPDATE//
    //////////

    //Update bar widths
    chartRow.select(".bar").transition()
      .duration(300)
      .attr("width", function (d) { return self.x(d["Total Rating"]); })
      .attr("height", this.y.rangeBand())
      .attr("opacity", 1);

    //Update data labels
    chartRow.select(".label").transition()
      .duration(300)
      .attr("opacity", 1)
      .attr("y", this.y.rangeBand() / 2)
      .tween("text", function (d) {
        var i = d3.interpolate(+this.textContent.replace(/\,/g, ''), +d["Total Rating"]);
        return function (t) {
          this.textContent = i(t).toFixed(2);
        };
      });
    //Fade in categories
    chartRow.select(".category").transition()
      .duration(300)
      .attr("y", this.y.rangeBand() / 2)
      .attr("opacity", 1);

    ////////
    //EXIT//
    ////////

    //Fade out and remove exit elements
    chartRow.exit().transition()
      .style("opacity", "0")
      .attr("transform", "translate(0," + (this.height + this.margin.top + this.margin.bottom) + ")")
      .remove();


    ////////////////
    //REORDER ROWS//
    ////////////////

    var delay = function (d, i) { return 200 + i * 30; };

    chartRow.transition()
      .delay(delay)
      .duration(900)
      .attr("transform", function (d) { return "translate(0," + self.y(d["Hotel Name"]) + ")"; });

  }
}
let currentState = null


// startShowingData
//   .promise
//   .then(() => console.log('resolved'))
//   .catch((reason) => console.log('isCanceled', reason.isCanceled));

// cancelablePromise.cancel();

const setHeading = (s, y, m) => {
  stateElement.innerText = s
  yearElement.innerText = y
  monthElement.innerText = m
}


async function showData(data, state) {
  for (let year of years) {
    for (let month of months) {
      if (chart.shouldStopLooping) {
        return
      }
      setHeading(state, year, month)
      chart.setData(data, year, month)
      chart.draw()
      await delay()
    }
  }
}

//  setInterval(function(){
//    chart.draw(getData());
//  }, 3000);

const pause = document.querySelector('#pause');
const back = document.querySelector('#back');
const forward = document.querySelector('#forward');

const drawChartForButton =  (month, year = yearElement.innerText) => {
  setTimeout(() => {
    chart.shouldStopLooping = false
    chart.year = year
    chart.month = month
    chart.draw()
  }, 100)
}


pause.addEventListener('click', () =>  {
  chart.shouldStopLooping = true
})

forward.addEventListener('click', () => {
  chart.shouldStopLooping = true
  const currentMonth = months.indexOf(monthElement.innerText)
  if(currentMonth === months.length - 1) {
    // last month
    monthElement.innerText = 'January'
    const currentYear = years.indexOf(yearElement.innerText)
    if(currentYear < years.length) {
      yearElement.innerText = years[currentYear + 1]
      drawChartForButton(months[currentMonth + 1], years[currentYear + 1])
    }
  } else {
    monthElement.innerText = months[currentMonth + 1]
    drawChartForButton(months[currentMonth + 1])
  }
})

back.addEventListener('click', () => {
  chart.shouldStopLooping = true
  const currentMonth = months.indexOf(monthElement.innerText)
  if(currentMonth === 0) {
    // last month
    const currentYear = years.indexOf(yearElement.innerText)
    if(currentYear > 0) {
      yearElement.innerText = years[currentYear - 1]
      drawChartForButton(months[currentMonth - 1], years[currentYear - 1])
      monthElement.innerText = 'December'
    }
  } else {
    monthElement.innerText = months[currentMonth - 1]
    drawChartForButton(months[currentMonth - 1])
  }
})

async function drawChart({ AB: state, NAME }) {
  currentState = NAME
  chart.shouldStopLooping = true
  await d3.json(`data/${state}.json`, (err, d) => {
    if (err) {
      console.log(err)
    }
    setTimeout(() => {
      chart.shouldStopLooping = false
      showData(d, state)
    }, 2000);
  })
}

export default drawChart