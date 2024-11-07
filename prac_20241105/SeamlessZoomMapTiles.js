map = () => {
    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", 400)
        .attr("height", 400)
    ;

    // tileを作成
    const tile = d3.tile()
        .extent([[0, 0], [width, height]])  // この範囲のタイルを返す、左上座標、右下座標
        .tileSize(512)      // サイズは512
        .clampX(false)      // クランプ？
    ;

    // Zoomの設定
    const zoom = d3.zoom()
        .scaleExtent([1 << 8, 1 << 22])     // 1<<8 = 256、1<<22 = 4194304
                                            // ズーム範囲、ずいぶん大きい
        .extent([[0, 0], [width, height]])  // この範囲をズームするという意味
        .on("zoom", (event) => zoomed(event.transform))     // zoomしたら、zoomed()を呼ぶ、パンでも呼ばれる
    ;

    // deltasの要素分の、gができる
    // deltasってなんだろう・・・
    const levels = svg.append("g")
        .attr("pointer-events", "none")
        .selectAll("g")
        .data(deltas)
        .join("g")
            .style("opacity", showlayers ? 0.3 : null);     // 何かを下に表示する場合、この地図をLayerと呼ぶためか

    svg
        .call(zoom)     // svgに対して、zoom要素を適用？？意味がわからない
        //.call(zoom.transform, mutable transform)      // mutableは、Observableのなにか？
        .call(zoom.transform, transform)        // もっと意味が分からない
        .on("wheel", (event) => event.preventDefault())     // 限界まで拡大縮小してもブラウザがスクロールしない設定
    ;

    function zoomed(transform_param) {
        console.log("zoomed!"); // パンでも呼ばれる

        //mutable transform = transform;
        transform = transform_param;

        //console.log(this);
        // thisは、window

        levels.each(function(delta) {
            // tile"s"
            // 作成したtileから、,,,わからない、、関数？
            const tiles = tile.zoomDelta(delta)(transform);

            d3.select(this)
                .selectAll("image")
                .data(tiles, d => d)
                .join("image")
                    .attr("xlink:href",
                        d => url(...d3.tileWrap(d))     // tileWrapでx,y,zが返ってきて、それを渡すとurlを得られる
                    )
                    .attr("x", ([x]) => (x + tiles.translate[0]) * tiles.scale)
                    .attr("y", ([, y]) => (y + tiles.translate[1]) * tiles.scale)
                    .attr("width", tiles.scale)
                    .attr("height", tiles.scale)
            ;
        });
    }

    return svg.node();
}


//deltas = [-100, -4, -1, 0];   // original
deltas = [-100, -4, -1, 0];
url = (x, y, z) => `https://tile.opentopomap.org/${z}/${x}/${y}.png`;
height = 1000;
width = 1000;
showlayers = false;
transform = d3.zoomIdentity.translate(width >> 1, height >> 1).scale(1 << 12);

svg = map();
document.getElementById("div1")
    .append(svg);

