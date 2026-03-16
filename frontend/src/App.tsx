import './App.css'
import Canvas from "./components/Canvas/Canvas"
import PropertiesEditor from "./components/PropertiesEditor/PropertiesEditor"
import ToolBar from "./components/ToolBar/ToolBar"
function App() {

    return <div className="App">
        <ToolBar></ToolBar>
        <Canvas></Canvas>
        <PropertiesEditor></PropertiesEditor>
    </div>

}

export default App
