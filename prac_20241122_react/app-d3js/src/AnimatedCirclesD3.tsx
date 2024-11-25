import { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

import useInterval from "./customHooks/useInterval";


// 0からn-1のindexについて、表示するindexをランダムで決め、配列にする
const generateCircles = (): number[] => {
    const n = 10;
    const ret: number[] = [];
    for(let i=0; i<n; i++){
        if (Math.random() > 0.5) {
            ret.push(i);
        }
    }
    return ret;
}

export const AnimatedCirclesD3 = () => {
    const [visibleCircles, setVisibleCircles] = useState<number[]>(
        generateCircles()
    );
    const refSvg = useRef<SVGSVGElement>(null);

    useInterval(() => {
        setVisibleCircles(generateCircles());
    }, 1500);

    useEffect(() => {
        const svgElement = d3.select(refSvg.current);
        svgElement.selectAll<SVGCircleElement, number>("circle")
            .data<number>(visibleCircles, (d: number) => d)
            .join(
                enter => (
                    enter.append("circle")
                        .attr("cx", d => d * 10 + 5)
                        .attr("cy", 20)
                        .attr("r", 0)
                        .attr("fill", "cornflowerblue")
                        .attr("opacity", 0)
                        .call(enter => (
                            enter.transition().duration(1200)
                                .attr("cy", 5)
                                .attr("r", 3)
                                .style("opacity", 1)
                        ))
                ),
                update => (
                    update
                        .call(update => (
                            update.transition().duration(500)
                                .attr("fill", "lightgrey")
                        ))
                ),
                exit => (
                    exit.attr("fill", "tomato")
                        .call(exit => (
                            exit.transition().duration(1200)
                                .attr("cy",20)
                                .attr("r", 0)
                                .style("opacity", 0)
                                .remove()
                        ))
                )
            )
        ;
    }, [visibleCircles]);

    return (
        <svg
            viewBox="0 0 100 20"
            ref={ refSvg }
        />
    );
};
