chart = () => {
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("stroke-width", 2)                    // 何のstroke-widthなのか不明
        .attr("style", "border: 1px solid #666")
    ;

    // データを作る
    //const circles = d3.range(20).map(i => ({  // わかりづらいのでdataへ変更
    const data = d3.range(20).map(i => ({
        x: Math.random() * (width - radius * 2) + radius,
        y: Math.random() * (height - radius * 2) + radius,
    }));

    // dataの点をつなぐ図をドロネー図という
    // https://d3js.org/d3-delaunay
    // [Voronoi diagram - Wikipedia](https://en.wikipedia.org/wiki/Voronoi_diagram)
    // つなぐ線の中点で垂線を引いて分割したものが、ボロノイ図
    let voronoi = d3.Delaunay
        .from(
            data,
            d => d.x,
            d => d.y
        )
        .voronoi([0, 0, width, height])     // これが何かよくわからない
    ;

    // 点の位置に円
    const circle = svg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", radius)
            .attr("fill", (d, i) => d3.schemeCategory10[i % 10])
    ;

    // ボロノイの境界線１本
    const mesh = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 10)
        .attr("d", voronoi.render())    // ここでは、path要素１つで、境界線を全部描く
    ;

    // セル
    // セルをドラッグするための情報
    const cell = svg.append("g")
        //.attr("fill", "none")
        .attr("pointer-events", "all")
        .selectAll("path")
        .data(data)
        .join("path")
            .attr("fill", (d, i) => d3.schemeCategory10[i % 10])
            .attr("opacity", "0.3")
            .attr("d", (d, i) => voronoi.renderCell(i))
            .call(d3.drag()
                .on("start",    // 手前に出して、境界線をblackに
                    (event, d) => circle.filter(p => p === d).raise().attr("stroke", "black")
                )
                .on("drag",     // d.x、d.yの更新
                    (event, d) => (d.x = event.x, d.y = event.y)
                )
                .on("end",      // 境界線を消す
                    (event, d) => circle.filter(p => p === d).attr("stroke", null)
                )
                .on("start.update drag.update end.update", update)  // ？
            )
    ;

    // update？
    function update() {
        //console.log("いつくる？");
        // ↑ start、drag、endのいずれのタイミングでもきた

        // voronoiを再作成
        // 最新の値を使うわけではない？？よくわからない
        voronoi = d3.Delaunay
            .from(
                data,
                d => d.x,
                d => d.y
            )
            .voronoi([0, 0, width, height])
        ;
        // DragZoomでは、"end"のときにだけやってたこと
        circle
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
        ;

        // セルのpath（全部）のdを再作成
        cell
            .attr("d",
                (d, i) => voronoi.renderCell(i)
            )
        ;
        // ボロノイの境界線１本も、dを再作成
        mesh
            .attr("d",
                voronoi.render()
            )
        ;
    }

    return svg.node();
}

const height = 600;
const width = 700;
const radius = 16;

svg = chart();
document.getElementById("div1")
    .append(svg);
