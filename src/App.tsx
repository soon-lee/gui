import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import './App.css'
<<<<<<< HEAD
import {PollMonitor} from "./containers/PollMonitor.tsx";
import ActionList from "./components/ActionList.tsx";
=======
import {CodePlot} from "./components/CodePlot.tsx";
>>>>>>> 41c36eafa27b529b76ceef851dcfa84c17761c73

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
<<<<<<< HEAD
                <PollMonitor />
                <ActionList actionList={["A0", "A1", "A2", "A3"]} />
=======
                <CodePlot language={'js'} code={'let p = 56;console.log(p)'} />
>>>>>>> 41c36eafa27b529b76ceef851dcfa84c17761c73
            </div>
        </>
    )
}

export default App
