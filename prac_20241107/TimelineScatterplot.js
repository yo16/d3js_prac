// Sort data from external file in descending order based on date (Unix ms timestamp)
// データを、registerdで降順ソート（日付の新しい方がindexが小さい並び）
data.sort(function(a, b) {
    return b.registered - a.registered;
});
//console.log(data.map(d => d.registered));

// Infinite scrolling/pagination variables
// １ページの設定
let offset = 0;
const limit = 10;
let current_index = 10;

// Useful datapoints (data variable included from external file)
// 便利なデータポイント（データポイント？）
// chartに表示するデータ（初期値、パン時に fetchData() で変更する）
let chart_data = data.slice(offset, limit);
// chart_data.registered の[最小値,最大値]を取得
let date_extent = d3.extent(chart_data, function(d) { return d.registered; });
// chart_data.age の[最小値,最大値]を取得
let age_extent = d3.extent(chart_data, function(d) { return d.age; });

// 今
const now = new Date(2015, 8, 16);
// スケール
var scale = 1.25;
// 読み込んだxの、translateの最小値
// データを読み込むたびに更新する
var min_translate_x = 0;
// transformのtranslateで指定する、x方向の最大値
// x_scaleを作った後に、計算して、その後変更しない
var max_translate_x; // Calculated after initial scaling

// Get and save properties of the container
// コンテナクラスのdivを取得し、widthとheightを取得しておく
const chart_container = d3.select('.chart');
const width = parseInt( chart_container.style('width') );
const height = parseInt( chart_container.style('height') );

// Create SVG
// コンテナにSVGを追加
const viz = chart_container.append('svg')
                //.attr({   // たぶんabolished
                //    width: width,
                //    height: height
                //})
                .attr("width", width)
                .attr("height", height)
;

// Create scales
// スケールを追加
//var x_scale = d3.time.scale()     // 古い書き方かも
//                .domain([new Date(date_extent[0]), new Date(date_extent[1])])
//                .range([0, width]);
const x_scale = d3.scaleTime()      // 時間軸
                .domain([new Date(date_extent[0]), new Date(date_extent[1])])   // 範囲 chart_dataのminとmax
                .range([0, width])  // 表示幅 0～width
;

console.log("x_scale domain:", x_scale.domain());
console.log("x_scale range:", x_scale.range());

// 縦方向
//var y_scale = d3.scale.linear()
var y_scale = d3.scaleLinear()
                .domain([age_extent[0] - 5, age_extent[1] + 5]) // chart_dataのmin-5～max+5
                .range([height, 0]); // 表示 height～0（上が大きい値なのでひっくり返している）

// Axis generators
// 軸
//var x_axis_generator = d3.svg.axis()
//var x_axis_generator = d3.axisBottom()
var x_axis_generator = d3.axisTop(x_scale)  // 上で作ったスケール
                // .scale(x_scale)      // v3では、x_scaleを渡して、パン時に自動的に反映されるようになっていた
                //.outerTickSize(0)
                .tickSizeOuter(0)
                //.orient('top')
                .tickFormat(d3.timeFormat("%Y/%m/%d"))
;

// Start adding to the viz
// 軸を描画
var x_axis = viz.append('g')
                .classed('x axis', true)
                .call(x_axis_generator)
                //.attr('transform', 'translate(0, ' + height + ')');
                .attr('transform', `translate(0,${height})`)
                    // axisTopを、一番下に表示している
;

// 点(circle)を描画
const group = viz.append('g')
    .classed('point-group', true);
let circles = group.selectAll('.point')
                .data(chart_data)
                .enter()
                .append('circle')
                    .classed('point', true)
                    //.attr({
                    //    cx: function(d) { return x_scale(new Date(d.registered)); },
                    //    cy: function(d) { return y_scale(d.age); },
                    //    fill: function(d) { return d.color; },
                    //    r: 4
                    //})
                    .attr("cx", d => x_scale(new Date(d.registered)))
                    .attr("cy", d => y_scale(d.age))
                    .attr("fill", d => d.color)
                    .attr("r", 4)
;

// Zoom/Pan behavior
// panという変数は、zoomの動作を定義するだけ
// 後でこれをviz(svg要素)に適用させる
//var pan = d3.behavior.zoom()
let pan = d3.zoom()
                //.x(x_scale)                   // zoomの初期値
                //.size([width, height])
                //.extent([[0,0], [width, height]])
                .scaleExtent([scale, scale])    // 同じ値を設定することで拡大縮小なしでパンのみ
                .on(
                    'zoom',
                    (event) => {
                        //console.log("zoomed!");

                        // 変更情報を適用した新しいスケールを作成
                        const updated_x_scale = event.transform.rescaleX(x_scale);

                        // 今表示している範囲を取得
                        const current_domain = updated_x_scale.domain();
                        //console.log(current_domain);
                        // 今表示している範囲の右端の値を時間に変換して取得
                        const current_max = current_domain[1].getTime();

                        // If we go past the max (i.e. now), reset translate to the max
                        // 右端（now）を超えないよう制限
                        if (!isNaN(max_translate_x) && current_max > now.getTime()) {
                            console.log("最大までスクロール");
                            // 初期状態（d3.zoomIdentity）に対して、translateをする
                            // x軸の左端をmax_translate_xに、y軸の上端を0にする
                            const clampedTransform = d3.zoomIdentity.translate(max_translate_x, 0);
                            viz.call(pan.transform, clampedTransform);
                        }
                        
                        // Update the data once user hits the point where current data ends
                        // 現在のデータが終了する地点にユーザーが到達したら、データを更新する。
                        // 右へパンさせると、transform.xは、増える（右へx分だけ平行移動したという意味なので）
                        //console.log({min_translate_x});
                        //console.log(event.transform.x);
                        //if (pan.translate()[0] > min_translate_x) {
                        // 最小値を超えた分、移動させたとき、データを更新する
                        if (min_translate_x < event.transform.x) {
                            updateData();
                            addNewPoints();
                            
                            // Just to illustrate what's happening
                            console.debug('Updated data: ', chart_data);
                            console.debug('Updated selection: ', circles);
                        }

                        // Redraw any components defined by the x axis
                        //x_axis.call(x_axis_generator);
                        x_axis.call(x_axis_generator.scale(updated_x_scale));
                        //circles.attr('cx', d => x_scale(new Date(d.registered)));
                        circles.attr("cx",
                            d => updated_x_scale(new Date(d.registered))
                        );

                    }
                )
;

// Apply the behavior
// zoom機能を定義した"pan"を、vizに反映させる
viz.call(pan);

// Now that we've scaled in, find the farthest point that
// we'll allow users to pan forward in time (to the right)
// これで拡大縮小が完了したので、次のような最も遠いポイントを見つけます。
// ユーザーが時間的に前方（右方向・過去方向）にパンできるようにします。
// widthから、右端に来るnowの座標値を引くと、translateする右の限界点が出る。
// zoomedで、xはこれ以上大きくしない（これ以上右へパンさせない）ようにコントロールする。
//console.log({width});   // 954
//console.log(x_scale(new Date(now)));    // 1351.875...
max_translate_x = width - x_scale(new Date(now));
// pan.transformの初期値を、右端の限界位置にする
//viz.call(pan.translate([max_translate_x, 0]).event); 
viz.call(pan.transform, d3.zoomIdentity.translate(max_translate_x, 0));



// -- Functions

// Fetches data from the global variable (this is where you would make an ajax call)
// グローバル変数からデータをフェッチする（ここでajaxコールを行うことになる）
// 新しい、次のデータを返す
function fetchData() {
    // Update offset and limit
    // offsetの初期値は0、limitの初期値は10
    offset += 1;
    current_index = offset * limit;

    // Return "next page" (create indexes based off offset & limit)
    // 次のページ」を返す（オフセットと制限に基づいてインデックスを作成する）
    return data.slice(current_index, current_index + limit);
}

// Updates the chart_data and any variables the rely on it
// chart_data とそれに依存する変数を更新する。
function updateData() {
    if (chart_data.length < 50) {   // データ数が50だから
        // 次のページのデータを読み込む
        var new_data = fetchData();
        console.log('adding new data: ', new_data)
        // Update the chart data
        // chart_data配列の後ろに、new_dataをくっつける
        chart_data = chart_data.concat(new_data);
        
        // Update other dependent variables
        // 他の関連する変数を更新
        // chart_data.registeredの、[最小値, 最大値]
        date_extent = d3.extent(chart_data, function(d) { return d.registered; });
        // chart_data.ageの、[最小値,最大値]
        age_extent = d3.extent(chart_data, function(d) { return d.age; });
        // x軸の最小値（scale後の座標値）
        // d3.zoomTransform(viz.node())は、zoomの関数の中では、event.transform.x と一緒
        //min_translate_x = pan.translate()[0] - x_scale(new Date(date_extent[0]));
        min_translate_x = d3.zoomTransform(viz.node()).x
            - x_scale(new Date(date_extent[0]))
        ;
        
    } else console.warn('No more data exists. External dataset only holds 50 items.');
};

// Binds the current data again and adds any new points to the selection
// 現在のデータを再度バインドし、新しいポイントを選択範囲に追加する。
function addNewPoints() {
    // Add new points
    // もう一度、最初に定義したcircleと同じ処理で再構築
    group.selectAll('circle.point')
        .data(chart_data)
        .enter()
        .append('circle')
            .classed('point', true)
            //.attr({
            //    cx: function(d) { return x_scale(new Date(d.registered)); },
            //    cy: function(d) { return y_scale(d.age); },
            //    fill: function(d) { return d.color; },
            //    r: 4
            //})
            .attr("cx", d => x_scale(new Date(d.registered)))
            .attr("cy", d => y_scale(d.age))
            .attr("fill", d => d.color)
            .attr("r", 4)
    ;

    // Update selection
    // この変数もzoomedの中で使うから、更新する
    // 上の戻り値といっしょなので、上で直接入れると、なんか残る。作り直すことが大事なのかも？
    circles = group.selectAll('circle.point');
};

