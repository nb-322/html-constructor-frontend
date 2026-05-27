import './ImgEditor.css'
import type {ImgElement} from "../../../types/Editor.ts";
import XEditor from "../EditorFields/XEditor.tsx";
import YEditor from "../EditorFields/YEditor.tsx";
import WidthEditor from "../EditorFields/WidthEditor.tsx";
import HeightEditor from "../EditorFields/HeightEditor.tsx";
import BorderRadiusEditor from "../EditorFields/BorderRadiusEditor.tsx";
import SrcEditor from "../EditorFields/SrcEditor.tsx";

type ImgEditorProps = {
    selectedElement: ImgElement;
}

const ImgEditor = ({selectedElement}: ImgEditorProps) => {
    if (!selectedElement) return null
    return (
        <div className="ImgEditor">
            <XEditor/>
            <YEditor/>
            <WidthEditor/>
            <HeightEditor/>
            <BorderRadiusEditor/>
            <SrcEditor/>
        </div>
    )
}

export default ImgEditor;
