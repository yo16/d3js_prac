
chart = (data) => {
    // Specify the dimensions of the chart.
    // チャートの枠サイズを決定
    const width = 928;
    const height = 600;
  
    // Specify the color scale.
    // 色を決定
    // scaleOrdinalで、color(0)、color(1)、、、のように使う
    // d3.schemeCategory10 で定義された10色を、ループで返す
    // 参考：[D3.js v4/v5 カラースケールの作り方 – データビジュアライゼーション・ラボ](https://wizardace.com/d3-makecolorscale/)
    const color = d3.scaleOrdinal(d3.schemeCategory10);
  
    // The force simulation mutates links and nodes, so create a copy
    // so that re-evaluating this cell produces the same result.
    // 力学シミュレーションはリンクとノードを変異させるので、
    // このセル（関数）を再評価（再実行）しても同じ結果が得られるようにコピーを作成する。
    // 配列要素を１つずつ、objectを...で展開してもう一度オブジェクトにして、１要素にしている
    const links = data.links.map(d => ({...d}));
    const nodes = data.nodes.map(d => ({...d}));
  
    // Create a simulation with several forces.
    // 力学シミュレーションを作る
    // force
    // 参考
    // - [d3.js Force Simulation の世界 #forceSimulation - Qiita](https://qiita.com/junkoda/items/2d12ecdd3b4b5c99d994)
    // - [d3/d3-force: Force-directed graph layout using velocity Verlet integration.](https://github.com/d3/d3-force)
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())    // クーロン力（ひきつけ合う力）
        .force("center", d3.forceCenter(width / 2, height / 2))   // 特定の点に向かう重力
        .on("tick", ticked)     // tickごとに呼び出される関数
                                // 時々刻々と変化する処理を設定
                                // 下で定義する、linkとnodeのattrを変化させる
    ;
  
    // Create the SVG container.
    // SVGコンテナを作成
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");
  
    // Add a line for each link, and a circle for each node.
    // ノードごとのリンクを作成
    const link = svg.append("g")    // リンクをまとめて、gを１つ作成
        .attr("stroke", "#999")         // gの中の共通の設定として、線の色とopacity
        .attr("stroke-opacity", 0.6)
        .attr("name", "linkですよ")
      .selectAll()
      .data(links)      // 配列linksをdataとして登録し、以降はlinksの１要素ごと
        .join("line")   // lineを追加
        .attr("stroke-width", d => Math.sqrt(d.value));     // valueに応じたwidth
  
    // ノードを作成
    // joinについて参考：[D3.js のデータ結合を理解する (1) data/enter/exit/join の基本｜まくろぐ](https://maku.blog/p/bp2btie/)
    // nodeという変数は、circle要素群
    const node_data = svg.append("g")    // 全ノードをまとめて、gを１つ作成
        .attr("stroke", "#fff")     // 全ノード共通の境界線
        .attr("stroke-width", 1.5)
        .attr("name", "nodeです")
      .selectAll()
      .data(nodes)
    ;
    const title = node_data
      .join("text")
        .text(d => d.id)
        .attr("font-size", "15")
        .attr("font-family", "sans-serif")
        .attr("stroke-width", "0")
        .attr("fill", "red")
    ;
    const node = node_data
      .join("circle")   // joinの後は、enterとupdateの共通処理
                        // ここのくだりは、参考サイトがわかりやすい
        .attr("r", 5)
        .attr("fill", d => color(d.group))
    ;
    
    // ↑の最後のcircleに対する処理
    // 別途、タイトルを追加
    // nodeは、circle要素群でないと、あとでticked()で.attrの対象がtitleになってしまう
    // なのでnodeの変数はそのままに、別でtitleを追加している
    // でもこの要素、使わないんだけど・・・
    // （上へ移動した）
  
    // Add a drag behavior.
    // nodeにドラッグ機能を追加
    node.call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
    );
  
    // Set the position attributes of links and nodes each time the simulation ticks.
    // シミュレーションが刻々と変化するたびに、リンクとノードの位置属性を設定します。
    // linkやnodeには、すでにdata()が設定されているので、
    // そのdataの１件に対するattrを定義する。
    // linkやnodeの定義のところでは、tickごとに呼び出せないので、関数化して外に出し
    // simulatorから呼び出している
    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
  
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
      
        title
            .attr("x", d => d.x+5)
            .attr("y", d => d.y+5);
    }
  
    // Reheat the simulation when drag starts, and fix the subject position.
    // ドラッグが始まったらシミュレーションを再加熱し、被写体の位置を固定する。
    // ↑意味がよくわからない
    function dragstarted(event) {
        // このif文は・・・？存在意味がよくわからない、かならず入る
        if (!event.active) {    // active: 現在アクティブなドラッグジェスチャーの数
            // alphaTargetは、0.0～1.0。小さいほど、ほか要素への影響度が減るみたい
            // 小さいほど、linkのバネがゆるい感じ
            simulation.alphaTarget(0.3).restart();
        }
        // fxとは・・・？
        // subjectとは・・・？
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }
  
    // Update the subject (dragged node) position during drag.
    // ドラッグ中にサブジェクト（ドラッグされたノード）の位置を更新する。
    // 確定するようなイメージ？
    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }
  
    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    // ドラッグ終了後にシミュレーションが冷却されるように、対象のアルファ値を元に戻します。
    // ドラッグされなくなったので、被写体の位置を固定解除します。
    // fxは、fixedなxという意味かも？
    function dragended(event) {
        // ゼロにする・・・？
        // 意味がよくわからないけど、ゼロだと何かが止まるらしい
        if (!event.active) {
            simulation.alphaTarget(0);
        }
        // nullにする・・・？
        event.subject.fx = null;
        event.subject.fy = null;
    }
  
    // When this cell is re-run, stop the previous simulation. (This doesn’t
    // really matter since the target alpha is zero and the simulation will
    // stop naturally, but it’s a good practice.)
    // このセルを再実行するときは、前のシミュレーションを停止する。
    // (ターゲット・アルファはゼロであり、シミュレーションは自然に停止するので、
    // これはあまり重要ではありませんが、良い習慣です)。
    // この関数は、Observableのstdlibの関数なので割愛。
    //invalidation.then(() => simulation.stop());
  
    return svg.node();
};

svg = chart(data);
document.getElementById("b1")
    .append(svg);

