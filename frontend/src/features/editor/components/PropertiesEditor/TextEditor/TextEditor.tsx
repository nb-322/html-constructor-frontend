import "./TextEditor.css"
import type {TextElement} from "../../../types/Editor.ts";
import XEditor from "../EditorFields/XEditor.tsx";
import YEditor from "../EditorFields/YEditor.tsx";
import WidthEditor from "../EditorFields/WidthEditor.tsx";
import HeightEditor from "../EditorFields/HeightEditor.tsx";
import FontSizeEditor from "../EditorFields/FontSizeEditor.tsx";
import BackgroundEditor from "../EditorFields/BackgroundEditor.tsx";
import ColorEditor from "../EditorFields/ColorEditor.tsx";
import BorderRadiusEditor from "../EditorFields/BorderRadiusEditor.tsx";

type TextEditorProps = {
    selectedElement: TextElement
}

const TextEditor = ({selectedElement}: TextEditorProps) => {
    if (!selectedElement) return null
    return (
        <div className="TextEditor">
            <XEditor/>
            <YEditor/>
            <WidthEditor/>
            <HeightEditor/>
            <FontSizeEditor/>
            <BackgroundEditor/>
            <ColorEditor/>
            <BorderRadiusEditor/>
        </div>
    )
}

export default TextEditor;
