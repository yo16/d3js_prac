import { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

import useInterval from "./customHooks/useInterval";

// [x,y]の配列を、n個作る関数
const generateDataset = (): number[][] => {
    const n = 10;

    return Array(n).fill(0).map(() => ([
      Math.random() * 80 + 10,
      Math.random() * 35 + 10,
    ]))
};

export const Circles = () => {
    // dataset
    const [dataset, setDataset] = useState<number[][]>(
        generateDataset()
    );
    const svgRef = useRef<SVGSVGElement | null>(null);

    // 描画直前の処理
    useEffect(() => {
        const svgElement = d3.select(svgRef.current);
        svgElement.selectAll("circle")
            .data(dataset)
            .join("circle")
                .attr("cx", d => d[0])
                .attr("cy", d => d[1])
                .attr("r", 3)
        ;
    }, [dataset]);

    // 定期的に更新
    useInterval(() => {
        const newDataset = generateDataset();
        setDataset(newDataset);
    }, 2000);

    return (
        <svg
            viewBox="0 0 100 50"
            ref={svgRef}
        />
    );
}
