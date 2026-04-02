import './ImgEditor.css'
import type {ImgElement} from "../../../types/Editor.ts";
import XEditor from "../EditorFields/XEditor.tsx";
import YEditor from "../EditorFields/YEditor.tsx";
import SrcEditor from "../EditorFields/SrcEditor.tsx";
type ButtonEditorProps = {
    selectedElement: ImgElement;
}
const ImgEditor = ({selectedElement}:ButtonEditorProps) => {


    if (!selectedElement) return null




    return (
        <div className="ImgEditor">
            <XEditor/>
            <YEditor/>
            <SrcEditor/>
        </div>
    )
}

export default ImgEditor;