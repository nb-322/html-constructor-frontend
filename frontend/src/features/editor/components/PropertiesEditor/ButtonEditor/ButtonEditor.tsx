import './ButtonEditor.css'
import type {ButtonElement} from "../../../types/Editor.ts";
import XEditor from "../EditorFields/XEditor.tsx";
import YEditor from "../EditorFields/YEditor.tsx";
import WidthEditor from "../EditorFields/WidthEditor.tsx";
import HeightEditor from "../EditorFields/HeightEditor.tsx";
import BackgroundEditor from "../EditorFields/BackgroundEditor.tsx";
import ColorEditor from "../EditorFields/ColorEditor.tsx";
import BorderRadiusEditor from "../EditorFields/BorderRadiusEditor.tsx";
import LinkEditor from "../EditorFields/LinkEditor.tsx";

type ButtonEditorProps = {
    selectedElement: ButtonElement;
}

const ButtonEditor = ({selectedElement}: ButtonEditorProps) => {
    if (!selectedElement) return null
    return (
        <div className="ButtonEditor">
            <XEditor/>
            <YEditor/>
            <WidthEditor/>
            <HeightEditor/>
            <BackgroundEditor/>
            <ColorEditor/>
            <BorderRadiusEditor/>
            <LinkEditor/>
        </div>
    )
}

export default ButtonEditor;
