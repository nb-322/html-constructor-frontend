import './App.css'
import { Routes, Route } from "react-router-dom";
import Editor from "./features/editor/components/Editor/Editor.tsx";
function App() {

    return <div className="App">
        <Routes>
            <Route path="/editor" element={<Editor />} />
        </Routes>    </div>

}

export default App
