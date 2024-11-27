import { useState } from "react";

import { CircleD3 } from "./CircleD3";
import { CirclesD3 } from "./CirclesD3";
import { CirclesReact } from "./CirclesReact";
import { AnimatedCirclesD3 } from "./AnimatedCirclesD3";
import { AnimatedCirclesReact } from "./AnimatedCirclesReact";
import { AxisD3 } from "./AxisD3";
import { AxisReact } from "./AxisReact";
import { AxisReact2 } from "./AxisReact2";

import './App.css'

export function App() {
    const [domainX, setDomainX] = useState<number>(0);
    const [domainY, setDomainY] = useState<number>(100);
    const [rangeX, setRangeX] = useState<number>(10);
    const [rangeY, setRangeY] = useState<number>(290);

    const handleOnChangeDomainX = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDomainX(Number(event.target.value));
    }
    const handleOnChangeDomainY = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDomainY(Number(event.target.value));
    }
    const handleOnChangeRangeX = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRangeX(Number(event.target.value));
    }
    const handleOnChangeRangeY = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRangeY(Number(event.target.value));
    }

    return (
        <>
            <h1>ReactでD3.jsを使うサンプル</h1>

            <h2>D3.jsを使った単体のcircle</h2>
            <CircleD3 />

            <h2>D3.jsを使った複数のcircle</h2>
            <CirclesD3 />

            <h2>Reactで同様の機能</h2>
            <CirclesReact />

            <h2>D3.jsを使った動くcircle</h2>
            発生(enter)時に青、連続で選ばれたら黄色、選ばれない(exit)時に赤
            <AnimatedCirclesD3 />

            <h2>Reactで同様の機能</h2>
            <AnimatedCirclesReact />

            <h2>軸(D3.js)</h2>
            <AxisD3 />

            <h2>軸(React + D3)</h2>
            <AxisReact />
            
            <h2>軸(React + D3) 汎用版</h2>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <AxisReact2
                    domain={[domainX, domainY]}
                    range={[rangeX, rangeY]}
                />
                <div>
                    domain: [<input id="domainX" type="number" onChange={handleOnChangeDomainX} value={domainX} />,
                        <input id="domainY" type="number" onChange={handleOnChangeDomainY} value={domainY} />]<br />
                    range: [<input id="rangeX" type="number" onChange={handleOnChangeRangeX} value={rangeX} />,
                        <input id="rangeY" type="number" onChange={handleOnChangeRangeX} value={rangeY} />]
                </div>
            </div>
        </>
    )
}
