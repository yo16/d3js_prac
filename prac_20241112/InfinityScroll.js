tiles = () => {
    // スケールを定義
    let scaleX = d3.scaleLinear()
        .domain([0, width / cellSize])
        .range([0, width])
    ;
    let scaleY = d3.scaleLinear()
        .domain([0, height / cellSize])
        .range([0, height])
    ;

    // ２次元の指定範囲のデータを読み込み、dataを更新する
    // ここで指定するxStartTile、・・・yEndTileは、スケール後のタイル座標値
    function loadData(xStartTileNum, xEndTileNum, yStartTileNum, yEndTileNum) {     // *: number, return: void
        //console.log({xStartTileNum});
        //console.log({xEndTileNum});
        //console.log({yStartTileNum});
        //console.log({yEndTileNum});

        // タイル座標値を整数化
        const xStartTile = Math.floor(xStartTileNum);
        const xEndTile   = Math.floor(xEndTileNum) + 1;
        const yStartTile = Math.floor(yStartTileNum);
        const yEndTile   = Math.floor(yEndTileNum) + 1;
        //console.log({xStartTile});
        //console.log({xEndTile});
        //console.log({yStartTile});
        //console.log({yEndTile});

        const addedData = [];

        for(let x=xStartTile; x<=xEndTile; x++){
            for (let y=yStartTile; y<=yEndTile; y++) {
                const key = getKey(x, y);
                // mapDataに存在しない場合、aryDataにも存在しない
                if (! mapData.has(key)) {
                    // aryDataとmapDataに追加
                    addedData.push({
                        x,
                        y,
                        value: getValue(x, y),  // このタイミングでmapDataにも追加される
                    });
                }
            }
        }

        if (addedData.length > 0) {
            console.log(`追加したデータ数：${addedData.length}`);
            //console.log(addedData);

            // 追加するデータをまとめて追加
            aryData = aryData.concat(addedData);

            // 追加したデータを表示
            drawGrid(aryData);
        }
    }


    // svg
    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
    ;

    // 描画
    const g = svg.append("g");
    const g1 = g.append("g")
        .attr("name", "rectsGroup")
    ;
    const g2 = g.append("g")
        .attr("name", "textsGroup")
    ;
    function drawGrid(data) {
        console.log(`表示対象のグリッド数：${data.length}`);
        // 無限スクロールする内容
        //console.log(aryData);
        g1.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
                .attr("x", d => scaleX(d.x))
                .attr("y", d => scaleY(d.y))
                .attr("width", cellSize)
                .attr("height", cellSize)
                .attr("fill", "#e66")
                .attr("stroke", "black")
                .attr("name", d => d.value)
        ;
        g2.selectAll("text")
            .data(data)
            .enter()
            .append("text")
                .attr("x", d => scaleX(d.x) + cellSize / 2)
                .attr("y", d => scaleY(d.y) + cellSize / 2)
                .attr("text-anchor", "middle")
                .attr("font-size", "14px")
                .attr("dy", ".35em")
                .text(d => d.value)
        ;
    }
    // 初期データのロード
    loadData(
        scaleX.invert(0), scaleX.invert(width),
        scaleY.invert(0), scaleY.invert(height)
    );
    // 描画
    drawGrid(aryData);


    // Zoomの設定
    const zoom = d3.zoom()
        .scaleExtent([0.1, 10])
        .on("zoom", zoomed)     // zoomしたら、zoomed()を呼ぶ、パンでも呼ばれる
    ;
    function zoomed(event) {
        //console.log("zoomed!"); // パンでも呼ばれる

        // 変更情報を適用した新しいスケール
        const updatedScaleX = event.transform.rescaleX(scaleX);
        const updatedScaleY = event.transform.rescaleY(scaleY);

        // 最新の範囲を取得
        const currentDomainX = updatedScaleX.domain();
        const currentDomainY = updatedScaleY.domain();
        //console.log("zoomしたあたらしいdomain");
        //console.log({currentDomainX});
        //console.log({currentDomainY});

        // 今の範囲のデータをロード
        loadData(
            currentDomainX[0], currentDomainX[1],
            currentDomainY[0], currentDomainY[1]
        );

        // 変更後のtransformを反映
        g.attr("transform", event.transform);
    }

    // svgにZoom設定を追加
    svg
        .call(zoom)
        .on("wheel", (event) => event.preventDefault())     // 限界まで拡大縮小してもブラウザがスクロールしない設定
    ;

    return svg.node();
}

// ２次元データ
const mapData = new Map();     // <string, string>()
let aryData = [];        // {x: number, y: number, value: string}[]
// Mapのデータの出し入れ
function setValue(x, y, value) {    // x: number, y: number, value: string
    const key = getKey(x, y);
    mapData.set(key, value);
}
function getValue(x, y) {       // x: number, y: number, return: string
    const key = getKey(x, y);
    let val = mapData.get(key);
    if (!val) {
        // まだキーがない場合は、計算して、設定する
        val = calcValue(x, y);
        setValue(x, y, val);
    }
    return val;
}
function calcValue(x, y) {      // x: number, y: number, return: string
    return `(${x},${y})`;
}
function getKey(x, y) {     // x: number, y: number, return: string
    return `${x},${y}`;
}


height = 400;
width = 500;
cellSize = 50;

svg = tiles();
document.getElementById("div1")
    .append(svg);

