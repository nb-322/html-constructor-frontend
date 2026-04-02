import './App.css'
import { Routes, Route } from "react-router-dom";
import Editor from "./features/editor/components/Editor/Editor.tsx";
import MainPage from "./features/main/components/MainPage/MainPage.tsx";
function App() {

    return <div className="App">
        <Routes>
            <Route path="/editor" element={<Editor />} />
            <Route path="/" element={<MainPage />} />

        </Routes>    </div>

}

export default App
