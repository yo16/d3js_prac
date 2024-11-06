
const chart = () => {
    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
    ;
  
    // 円を所属させるグループを作成
    const g = svg.append("g")
        .attr("cursor", "grab")
        .attr("name", "circle_group")
    ;
  
    // グループに円を追加
    g.selectAll("circle")   // 円を選択し
        .data(data)         // データを対応
        .join("circle")
            .attr("cx", ({x}) => x)
            .attr("cy", ({y}) => y)
            .attr("r", radius)
            .attr("fill", (d, i) => d3.interpolateRainbow(i / 360))
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
    ;
  
    // svgにzoomを適用（これだけ！！）
    svg.call(d3.zoom()
        .extent([[0, 0], [width, height]])
        .scaleExtent([0.1, 8])
        .on("zoom", zoomed))    // 関数を別途定義
    ;
  
    function dragstarted() {
        // thisは、circle

        // raise()：選択した各要素を、親の最後の子として順番に再挿入選択した各要素を親の最初の子として順番に再挿入
        // 最前面に持ってくるため！（こういう使い方するのか！）
        d3.select(this)
            .raise()
        ;

        g.attr("cursor", "grabbing");
    }
  
    function dragged(event, d) {
        // 代入の結果は代入した値と同じであることを確認
        //console.log(event.x);
        myx = (d.x = event.x);
        //console.log(myx);
        console.assert(myx === event.x, "同じはず！");

        // thisは、circle要素
        d3.select(this)
            .attr("cx", d.x = event.x)  // event.xをd.xに設定し、それをcxに設定してる
            .attr("cy", d.y = event.y)
        ;
        // d.x、d.yに設定しないと、なんかずれる。よくわからない
        //d3.select(this)
        //    .attr("cx", event.x)
        //    .attr("cy", event.y)
        //;
    }
  
    function dragended() {
        g.attr("cursor", "grab");
    }
  
    // zoomしたときの関数
    // transformしやすいように、引数が渡される！超便利
    function zoomed({transform}) {
        g.attr("transform", transform);
    }
  
    return svg.node();
}

const width = 928;
const height = 600;
const radius = 6;
const step = radius * 2;
const theta = Math.PI * (3 - Math.sqrt(5));     // たぶん、誰かが見つけた適当な数字
    // １点描いたら、次の点はtheta回した角度になる

// データ作成
// 円形にだんだん広がる
data = Array.from({length: 2000}, (_, i) => {
    const radius = step * Math.sqrt(i += 0.5);
    const a = theta * i;
    return {
        x: width / 2 + radius * Math.cos(a),
        y: height / 2 + radius * Math.sin(a)
    };
});

svg = chart(data);
document.getElementById("b1")
    .append(svg);
