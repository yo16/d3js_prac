import * as d3 from "d3";
import { useRef, useEffect } from "react";

export const Circle = () => {
    const svgRef = useRef<SVGSVGElement | null>(null);
  
    useEffect(() => {
        const svgElement = d3.select(svgRef.current);
        svgElement.append("circle")
            .attr("cx", 150)
            .attr("cy", 70)
            .attr("r",  50)
        ;
    }, [])
  
    return (
        <svg
            ref={ svgRef }
        />
    );
}
