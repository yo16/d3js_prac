
var data1 = [
    10, 20, 30
];


var svg = d3.select("svg");
var svgg = svg.append("g");

svgg.selectAll("circle")
    .data(data1)
    .enter()
    .append("circle")
    .attr("r", d => d)
    .attr("cx", d => d*10)
    .attr("cy", d => d*10)
    .attr("fill", "#f00")
;

