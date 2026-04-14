import ToolBar from "../ToolBar/ToolBar.tsx";
import Canvas from "../Canvas/Canvas.tsx";
import PropertiesEditor from "../PropertiesEditor/PropertiesEditor.tsx";
import './Editor.css';

const Editor = () => {
    return (
        <div className="Editor">
            <ToolBar></ToolBar>
            <Canvas></Canvas>
            <div className="properties-container">
                <PropertiesEditor></PropertiesEditor>
            </div>
        </div>
    );
};

export default Editor;