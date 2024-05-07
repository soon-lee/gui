import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ActionList from "./components/ActionList.tsx";

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
                <ActionList actionList={["test1", "test2", "test3"]} />
            </div>
        </>
    )
}

export default App
