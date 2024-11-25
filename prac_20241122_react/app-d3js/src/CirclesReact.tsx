import { useState } from "react";

import useInterval from "./customHooks/useInterval";

// [x,y]の配列を、n個作る関数
const generateDataset = (): number[][] => {
    const n = 10;

    return Array(n).fill(0).map(() => ([
      Math.random() * 80 + 10,
      Math.random() * 35 + 10,
    ]))
};

export const CirclesReact = () => {
    // dataset
    const [dataset, setDataset] = useState<number[][]>(
        generateDataset()
    );

    // 定期的に更新
    useInterval(() => {
        const newDataset = generateDataset();
        setDataset(newDataset);
    }, 2000);

    return (
        <svg viewBox="0 0 100 50">
            {dataset.map(([x,y], i) => (
                <circle
                    key={`circle_${i}`}
                    cx={x}
                    cy={y}
                    r="3"
                />
            ))}
        </svg>
    );
}
