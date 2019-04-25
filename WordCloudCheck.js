function WordCloud(state){
    d3.json("./data/Processed_Hotel_Names.json", function(error, Processed_Hotel_Names) {
        d3.json("./data/Word_Cloud_State_Data/" + state + ".json", function(error, data) {
            d3.csv("./data/Top_10_Best_Hotels/" + state + ".csv", function(error, hotels) {
                d3.json('./data/Radar_chart/'+ state +'.json',  (err, json) => {
                    var global = 0
                    var previousglobalcount = 0

                    pos0 = "translate(245, 310)"
                    pos1 = "translate(125, 310)"
                    pos2 = "translate(350, 310)"
                    pos3 = "translate(245, 110)"
                    pos4 = "translate(245, 510)"

                    x0 = 0
                    x1 = 0
                    x2 = 0
                    x3 = 0
                    x4 = 0

                    var flag = Array()
                    for(var i = 0; i < 11; i++){
                        flag.push(0);
                    }

                    var def_color = 'rgb(192, 192, 192)'
                    var default_color = '#C0C0C0'
                    var colors = [default_color, '#3366CC', '#E67300', '#66AA00', '#B82E2E']
                    var rgbcolors = [def_color, 'rgb(51, 102, 204)' , 'rgb(230, 115, 0)', 'rgb(102, 170, 0)', 'rgb(184, 46, 46)']

                    color_to_value_dict = {}

                    available_colors = Array()
                    for(var i = colors.length - 1; i > 0; i--){
                        available_colors.push(i);
                        color_to_value_dict[rgbcolors[i]] = i
                    }

                    var curWordCloud = null;
                    var myWordCloud1 = null;
                    var myWordCloud2 = null;
                    var myWordCloud3 = null;
                    var myWordCloud4 = null;

                    //var elements = [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012]
                    var hotel_names = ['']
                    for(h in hotels) {
                        hotel_names.push(hotels[h]['Hotel Name']);
                    }
                    //console.log(hotel_names);
                    var radar_hotel = [];
                    var curYear = 2005


                    var b1 = d3.select("#b1").append("button")
                    .attr("class", "btn")
                    .attr("id", "button1")
                    .attr("type", "button")
                    .style("background", default_color)
                    .style("color","black")
                    .text(hotel_names[1])
                    .on("click", function(){changeLayout(Processed_Hotel_Names[hotel_names[1]], 1)});

                    var b2 = d3.select("#b2").append("button")
                    .attr("class", "btn")
                    .attr("id", "button2")
                    .attr("type", "button")
                    .style("background", default_color)
                    .style("color","black")
                    .text(hotel_names[2])
                    .on("click", function(){changeLayout(Processed_Hotel_Names[hotel_names[2]], 2)});

                    var b3 = d3.select("#b3").append("button")
                    .attr("class", "btn")
                    .attr("id", "button3")
                    .attr("type", "button")
                    .style("background", default_color)
                    .style("color","black")
                    .text(hotel_names[3])
                    .on("click",function(){changeLayout(Processed_Hotel_Names[hotel_names[3]], 3)});

                    var b4 = d3.select("#b4").append("button")
                    .attr("class", "btn")
                    .attr("id", "button4")
                    .attr("type", "button")
                    .style("background", default_color)
                    .style("color","black")
                    .text(hotel_names[4])
                    .on("click", function(){changeLayout(Processed_Hotel_Names[hotel_names[4]], 4)});

                    var b5 = d3.select("#b5").append("button")
                    .attr("class", "btn")
                    .attr("id", "button5")
                    .attr("type", "button")
                    .style("background", default_color)
                    .style("color","black")
                    .text(hotel_names[5])
                    .on("click", function(){changeLayout(Processed_Hotel_Names[hotel_names[5]], 5)});

                    var b6 = d3.select("#b6").append("button")
                    .attr("class", "btn")
                    .attr("id", "button6")
                    .attr("type", "button")
                    .style("background", default_color)
                    .style("color","black")
                    .text(hotel_names[6])
                    .on("click", function(){changeLayout(Processed_Hotel_Names[hotel_names[6]], 6)});

                    var b7 = d3.select("#b7").append("button")
                    .attr("class", "btn")
                    .attr("id", "button7")
                    .attr("type", "button")
                    .style("background", default_color)
                    .style("color","black")
                    .text(hotel_names[7])
                    .on("click",function(){changeLayout(Processed_Hotel_Names[hotel_names[7]], 7)});

                    var b8 = d3.select("#b8").append("button")
                    .attr("class", "btn")
                    .attr("id", "button8")
                    .attr("type", "button")
                    .style("background", default_color)
                    .style("color","black")
                    .text(hotel_names[8])
                    .on("click", function(){changeLayout(Processed_Hotel_Names[hotel_names[8]], 8)});

                    var b9 = d3.select("#b9").append("button")
                    .attr("class", "btn")
                    .attr("id", "button9")
                    .attr("type", "button")
                    .style("background", default_color)
                    .style("color","black")
                    .text(hotel_names[9])
                    .on("click",function(){changeLayout(Processed_Hotel_Names[hotel_names[9]], 9)});

                    var b10 = d3.select("#b10").append("button")
                    .attr("class", "btn")
                    .attr("id", "button10")
                    .attr("type", "button")
                    .style("background", default_color)
                    .style("color","black")
                    .text(hotel_names[10])
                    .on("click", function(){changeLayout(Processed_Hotel_Names[hotel_names[10]], 10)});

                    /*
                    var sel = d3.select("#drop").append("select")
                                .attr("class", "custom-select")
                                .style("background-color", "#e5f5f9")
                                .style("color", "black")
                                .style("font-size", "15px")
                                .style("font-weight", "bold")
                                .style("text-anchor", "middle")
                                .attr("id","dropdown")
                                .on("change", function(d){
                                    selection = document.getElementById("dropdown");
                                    updateYear(selection.options[selection.selectedIndex].value)
                                })

                    sel.selectAll("option")
                        .data(elements)
                        .enter().append("option")
                                  .attr("value", function(d){
                                    return d;
                              })
                              .text(function(d){
                                return d;
                              })

                    */
                    d3.select('#slider').call(d3.slider().axis(true).min(2005).max(2012).step(1).on("slide", function(evt, value){updateYear(value);}));

                    function changeLayout(hotel_name, index){
                        console.log(global)
                            if( flag[index] == 0){
                                if(global != 4){
                                color_index = colorchange("button" + index);
                                layout(++global, hotel_name, color_index);
                                flag[index] = 1;
                                drawRadar(hotel_name, curYear, 1, color_index);
                                }
                                else{
                                    alert("Maximum Four Hotels Clickable!!! Please Un-Click and Retry...")
                                }
                            }
                            else {
                                if(global != 0){
                                    color_index = colorchange("button" + index);
                                    layout(--global, hotel_name, color_index);
                                    flag[index] = 0;
                                    drawRadar(hotel_name, curYear, 0, color_index);
                                }
                            }
                    }

                    function colorchange(id) {
                        var background = document.getElementById(id).style.background;
                        //console.log(background);
                        if (background == def_color) {
                            color_index = available_colors.pop()
                            new_color = rgbcolors[color_index];
                            document.getElementById(id).style.background = new_color;
                        }
                        else {
                            color_index = 0
                            available_colors.push(color_to_value_dict[background])
                            document.getElementById(id).style.background = default_color;
                        }
                        return color_index;

                    }

                    function drawRadar(hotel, year, flag, color){
                        if(flag == 1){
                          var data = {};
                          data['axes'] = []
                          data['color'] = colors[color_index]
                          data['group'] = hotel
                          for(d in json[hotel][year])
                            data['axes'].push({axis: d, value: json[hotel][year][d]});
                          radar_hotel.push(data);
                        }
                        else{
                          for( var i = 0; i < radar_hotel.length; i++){ 
                             if ( radar_hotel[i].group == hotel) {
                               radar_hotel.splice(i, 1); 
                             }
                          }
                        }
                        RadarChart.draw("#radar-chart", radar_hotel)
                    }

                    function wordCloud(selector, translate, color, hotel) {
                    //var fill = d3.scale.category20();
                    //translate = "translate(300,300)"
                    //Construct the word cloud's SVG element
                    var svg = d3.select(selector).append("svg")
                        .attr("width", 1200)
                        .attr("height", 1200)
                        .append("g")
                        .attr("transform", translate)
                        .attr("id", hotel)
                    //Draw the word cloud
                    function draw(words) {
                        var cloud = svg.selectAll("g text")
                                        .data(words, function(d) { return d.text; })

                        //Entering words
                        cloud.enter()
                            .append("text")
                            .style("font-family", "Impact")
                            .style("fill", color)
                            .attr("text-anchor", "middle")
                            .attr('font-size', 1)
                            .text(function(d) { return d.text; });

                        //Entering and existing words
                        cloud
                            .transition()
                                .duration(500)
                                .style("font-size", function(d) { return d.size + "px"; })
                                .attr("transform", function(d) {
                                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                                })
                                .style("fill-opacity", 1);

                        //Exiting words
                        cloud.exit()
                            .transition()
                                .duration(10)
                                .style('fill-opacity', 1e-6)
                                .attr('font-size', 1)
                                .remove();
                    }


                    //Use the module pattern to encapsulate the visualisation code. We'll
                    // expose only the parts that need to be public.
                    return {
                        //Recompute the word cloud for a new set of words. This method will
                        // asycnhronously call draw when the layout has been computed.
                        //The outside world will need to call this function, so make it part
                        // of the wordCloud return value.
                        update: function(words, x, y) {
                            d3.layout.cloud().size([x, y])
                                .words(words)
                                .padding(2)
                                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                                .font("Impact")
                                .fontSize(function(d) { return d.size; })
                                .on("end", draw)
                                .start();
                        }
                    }

                }

                //This method tells the word cloud to redraw with a new set of words.
                function getWords(hotel, year){
                    var arr = new Array();
                    var req = data[hotel][year];
                    for(d in req)
                        arr.push({text: d, size: data[hotel][year][d]});
                    return arr;
                }
                //In reality the new words would probably come from a server request,
                // user input or some other source.

                function showNewWords(hotel, vis, year, x, y) {
                    if(vis != null ){
                        year = year > 2012 ? 2012 : year;
                        year = year < 2005 ? 2005 : year;
                        vis.update(getWords(hotel, year), x, y);
                    }
                }

                function updateRadarWithDiffYear(year){
                  for(index in radar_hotel){
                    radar_hotel[index].axes = []
                    for(d in json[radar_hotel[index].group][year])
                        radar_hotel[index]['axes'].push({axis: d, value: json[radar_hotel[index].group][year][d]});
                  }
                  RadarChart.draw("#radar-chart", radar_hotel)
                }

                function updateYear(year){
                    curYear = parseInt(year);
                    updateRadarWithDiffYear(curYear);
                    if(x0 != 0)
                        showNewWords(x0, myWordCloud1, curYear, 245, 255)
                    if(x1 != 0)
                        showNewWords(x1, myWordCloud1, curYear, 245, 255)
                    if(x2 != 0)
                        showNewWords(x2, myWordCloud2, curYear, 245, 255)
                    if(x3 != 0)
                        showNewWords(x3, myWordCloud3, curYear, 490, 145)
                    if(x4 != 0)
                        showNewWords(x4, myWordCloud4, curYear, 490, 145)
                }

                function layout(globalcount, hotel, color_index){
                    if(globalcount < 0){
                        
                    }

                    else if(globalcount > 4){
                        console.log(globalcount);
                        document.getElementById('#button1').disabled = true;
                        global = previousglobalcount
                    }

                    else{
                        hotel_id = hotel.replace(/\s/g,'')
                        if(globalcount == 0){
                            if(previousglobalcount == 1){
                                var pathTransition = d3.select("#" + x0).transition().duration(1000)
                                    .style('fill-opacity', 1e-6)
                                    .attr('font-size', 1)
                                    .remove();
                                x0 = 0
                                myWordCloud1 = null;
                            }
                            previousglobalcount = 0
                        }

                        else if(globalcount == 1){
                            if(previousglobalcount == 0){
                                myWordCloud1 = wordCloud('#wordCloudSVG', pos0, colors[color_index], hotel_id);
                                showNewWords(hotel_id, myWordCloud1, curYear, 245, 255);
                                x0 = hotel_id
                            }
                            else{
                                var pathTransition = d3.select('#' + hotel_id).transition().duration(1000)
                                        .style('fill-opacity', 1e-6)
                                        .attr('font-size', 1)
                                        .remove();
                                if(x1 != hotel_id){
                                    x0 = x1;
                                    x1 = 0
                                    myWordCloud2 = null;
                                }
                                else{
                                    x0 = x2;
                                    x2 = 0;
                                    myWordCloud1 = myWordCloud2;
                                    myWordCloud2 = null;
                                }
                                var pathTransition = d3.select('#' + x0).transition()
                                        .attr('transform', pos0)
                                        .duration(1000);
                            }
                            previousglobalcount = globalcount
                        }

                        else if(globalcount == 2){
                            if(previousglobalcount == 1){
                                var pathTransition = d3.select("#" + x0).transition();
                                pathTransition.attr("transform", pos1).duration(1000);
                                myWordCloud2 = wordCloud('#wordCloudSVG', pos2, colors[color_index], hotel_id);
                                showNewWords(hotel_id, myWordCloud2, curYear, 245, 255);
                                x1 = x0;
                                x2 = hotel_id;
                                x0 = 0;
                            }
                            else{
                                var pathTransition = d3.select('#' + hotel_id).transition().duration(1000)
                                        .style('fill-opacity', 1e-6)
                                        .attr('font-size', 1)
                                        .remove();
                               if(x1 == hotel_id){
                                    x1 = x3;
                                    x3 = 0;
                                    showNewWords(x1, curWordCloud, curYear, 245, 255);
                                    var pathTransition = d3.select("#" + x1).transition();
                                    pathTransition.attr("transform", pos1).duration(1000);
                                    myWordCloud1 = myWordCloud3;
                                    curWordCloud = myWordCloud2;
                                    myWordCloud3 = null;

                               }
                               else if(x2 == hotel_id){
                                    x2 = x3;
                                    x3 = 0;
                                    showNewWords(x2, curWordCloud, curYear, 245, 255);
                                    var pathTransition = d3.select("#" + x2).transition();
                                    pathTransition.attr("transform", pos2).duration(1000);
                                    myWordCloud2 = myWordCloud3;
                                    curWordCloud = myWordCloud2;
                                    myWordCloud3 = null;
                               }
                               else{
                                    x3 = 0
                                    curWordCloud = myWordCloud2;
                                    myWordCloud3 = null;
                               }
                            }
                            previousglobalcount = globalcount
                        }

                        else if(globalcount == 3){
                            if(previousglobalcount == 2){
                                myWordCloud3 = wordCloud('#wordCloudSVG', pos3, colors[color_index], hotel_id);
                                showNewWords(hotel_id, myWordCloud3, curYear, 490, 145);
                                curWordCloud = myWordCloud3;
                                x3 = hotel_id
                            }
                            else{
                                var pathTransition = d3.select('#' + hotel_id).transition().duration(1000)
                                        .style('fill-opacity', 1e-6)
                                        .attr('font-size', 1)
                                        .remove();
                               if(x1 == hotel_id){
                                    x1 = x4
                                    x4 = 0
                                    showNewWords(x1, curWordCloud, curYear, 245, 255);
                                    var pathTransition = d3.select("#" + x1).transition();
                                    pathTransition.attr("transform", pos1).duration(1000);
                                    curWordCloud = myWordCloud3;
                                    myWordCloud1 = myWordCloud4;
                                    myWordCloud4 = null;
                               }
                               else if(x2 == hotel_id){
                                    x2 = x4;
                                    x4 = 0;
                                    showNewWords(x2, curWordCloud, curYear, 245, 255);
                                    var pathTransition = d3.select("#" + x2).transition();
                                    pathTransition.attr("transform", pos2).duration(1000);
                                    curWordCloud = myWordCloud3;
                                    myWordCloud2 = myWordCloud4;
                                    myWordCloud4 = null;
                               }
                                else if(x3 == hotel_id){
                                    x3 = x4;
                                    x4 = 0;
                                    var pathTransition = d3.select("#" + x3).transition();
                                    pathTransition.attr("transform", pos3).duration(750);
                                    myWordCloud3 = myWordCloud4;
                                    curWordCloud = myWordCloud3;
                                    myWordCloud4 = null;
                               }
                               else{
                                    x4 = 0
                                    curWordCloud = myWordCloud3;
                                    myWordCloud4 = null;
                               }
                            }
                            previousglobalcount = globalcount
                        }
                        else if(globalcount == 4){
                            myWordCloud4 = wordCloud('#wordCloudSVG', pos4, colors[color_index], hotel_id);
                            showNewWords(hotel_id, myWordCloud4, curYear, 490, 145);
                            curWordCloud = myWordCloud4;
                            x4 = hotel_id;
                        }
                    }

                }
                });
            });
        });
    });
}