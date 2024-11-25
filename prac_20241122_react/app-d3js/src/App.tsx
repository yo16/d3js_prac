import { CircleD3 } from "./CircleD3";
import { CirclesD3 } from "./CirclesD3";
import { CirclesReact } from "./CirclesReact";
import { AnimatedCirclesD3 } from "./AnimatedCirclesD3";
import './App.css'

export function App() {
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
            <AnimatedCirclesD3 />
        </>
    )
}
