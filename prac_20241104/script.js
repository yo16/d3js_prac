// データの準備
const data = [
    { "name": "岡本", "homerun": 41 },
    { "name": "村上", "homerun": 31 },
    { "name": "牧", "homerun": 29 }
];

// SVG要素の設定
const svg = d3.select("svg"),
    margin = { top: 20, right: 30, bottom: 50, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

// x軸とy軸のスケールを設定
const x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, width])
    .padding(0.1)
    ;

const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.homerun)])
    .nice()
    .range([height, 0]);

// x軸とy軸をSVGに追加
g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", margin.bottom - 10)
    .attr("fill", "#000")
    .text("選手名");

g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(10))
    .append("text")
    .attr("class", "axis-label")
    .attr("x", -margin.left)
    .attr("y", -10)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .text("ホームラン数");

// 棒グラフを描画
g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.name))
    .attr("y", d => y(d.homerun))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.homerun));

