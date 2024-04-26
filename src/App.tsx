import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {CodePlot} from "./components/CodePlot.tsx";

function App () {
    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} class="logo" alt="Vite logo"/>
                </a>
                <a href="https://solidjs.com" target="_blank">
                    <img src={solidLogo} class="logo solid" alt="Solid logo"/>
                </a>
            </div>
            <h1>Vite + Solid</h1>
            <div class="card">
                <CodePlot language={'js'} code={'let p = 56;console.log(p)'} />
            </div>
        </>
    )
}

export default App
