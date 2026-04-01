import './App.css'
import Canvas from "./features/editor/components/Canvas/Canvas"
import PropertiesEditor from "./features/editor/components/PropertiesEditor/PropertiesEditor"
import ToolBar from "./features/editor/components/ToolBar/ToolBar"
function App() {

    return <div className="App">
        <ToolBar></ToolBar>
        <Canvas></Canvas>
        <PropertiesEditor></PropertiesEditor>
    </div>

}

export default App
