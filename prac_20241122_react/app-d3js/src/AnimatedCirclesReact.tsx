import { useState, useRef, useEffect } from "react";
import { useSpring, animated, easings } from "@react-spring/web";

import useInterval from "./customHooks/useInterval";


const numOfCircles = 10;
// 0からnumOfCircles-1のindexについて、表示するindexをランダムで決め、配列にする
const generateCircles = (): number[] => {
    const ret: number[] = [];
    for(let i=0; i<numOfCircles; i++){
        if (Math.random() > 0.5) {
            ret.push(i);
        }
    }
    return ret;
}
// 全Circlesのindex配列
const allCircles: number[] = Array(numOfCircles).fill(0).map((_, i) => i);

export const AnimatedCirclesReact = () => {
    const [visibleCircles, setVisibleCircles] = useState<number[]>(
        generateCircles()
    );

    useInterval(() => {
        setVisibleCircles(generateCircles());
    }, 2000);

    return (
        <svg viewBox="0 0 100 20">
            {allCircles.map(d => (
                <AnimatedCircle
                    key={d}
                    index={d}
                    isShowing={visibleCircles.includes(d)}
                />
            ))}
        </svg>
    );
};

interface AnimatedCircleProps {
    index: number,
    isShowing: boolean
};
const AnimatedCircle = ({ index, isShowing }: AnimatedCircleProps) => {
    // １つ前の状態を覚えておく変数
    const wasShowing = useRef(false);
    // useEffectは、描画が終わったら実行される関数
    useEffect(() => {
        // １つ前の情報として記録し
        // つぎの描画時に利用する
        wasShowing.current = isShowing
    }, [isShowing]);

    const style = useSpring({
        config: {
            duration: 1200,
            easing: easings.easeInOutCubic,
        },
        r: isShowing? 3: 0,
        cy: isShowing? 5: 20,
        opacity: isShowing? 1: 0,
        fill:
            !isShowing? "tomato":
            !wasShowing.current ? "cornflowerblue":
                                  "goldenrod"
        ,
    });

    return (
        <animated.circle {...style}
            cx={index * 10 + 5}
        />
    );
}
