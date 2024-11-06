const data = [
    0,
    45,
    98,
    103,
    110,
    150,
    175,
    200,
];

function calcTedori(syuunyuu) {
    const syotoku_zei
        = (syuunyuu > 103)
            ? ((syuunyuu - 103) * 0.05)
            : 0;
    const juumin_zei
        = (syuunyuu > 45)
            ? (0.43 + (syuunyuu - 45) * 0.10025)
            : 0;
    
    const tedori = syuunyuu - syotoku_zei - juumin_zei;
    return tedori;
}
function calcTedori2(syuunyuu) {
    const syotoku_zei
        = (syuunyuu > 103)
            ? ((syuunyuu - 103) * 0.05)
            : 0;
    const juumin_zei
        = (syuunyuu > 103)
            ? (0.43 + (syuunyuu - 103) * 0.10025)
            : 0;
    
    const tedori = syuunyuu - syotoku_zei - juumin_zei;
    return tedori;
}

const svg = d3.select("svg");
// グラフを描画する領域
const margin = {
    top: 20,
    right: 30,
    bottom: 50,
    left: 40,
};
const width = Number(svg.attr("width")) - margin.left - margin.right;
const height = Number(svg.attr("height")) - margin.top - margin.bottom;
const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
const xScale = d3.scaleLinear()
    .domain([0, Math.max(...data)])
    .nice()
    .range([0, width]);

const maxYValue = d3.max(data, d => calcTedori(d-0));
console.log(maxYValue);
const yScale = d3.scaleLinear()
    .domain([0, maxYValue])
    .nice()
    .range([height, 0]);


// x軸
g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).ticks(10))
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", margin.bottom - 10)
    .attr("fill", "#000")
    .text("収入(万円)")
;
// y軸
g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(yScale).ticks(10))
    .append("text")
    .attr("class", "axis-label")
    .attr("x", -margin.left)
    .attr("y", -10)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .text("手取り(万円)")
;


// 折れ線グラフ
/*
g.append("path")
    .datum(data)
    .attr("d", d3.line()
        .x(d => xScale(d))
        .y(d => yScale(calcTedori(d)))
    )
    .attr("id", "graphPath")
    .attr("stroke", "#00f")
    .attr("stroke-width", "2")
    .attr("fill", "none")
;*/
g.append("path")
    .datum(data)
    .attr("d", d3.line()
        .x(d => xScale(d))
        .y(d => yScale(calcTedori2(d)))
    )
    .attr("id", "graphPath")
    .attr("stroke", "#00f")
    .attr("stroke-width", "2")
    .attr("fill", "none")
;

