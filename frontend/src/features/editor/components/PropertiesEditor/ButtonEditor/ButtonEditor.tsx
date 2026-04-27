import './ButtonEditor.css'
import type {ButtonElement} from "../../../types/Editor.ts";
import XEditor from "../EditorFields/XEditor.tsx";
import YEditor from "../EditorFields/YEditor.tsx";
import BackgroundEditor from "../EditorFields/BackgroundEditor.tsx";
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
            <BackgroundEditor/>
            <LinkEditor/>
        </div>
    )
}

export default ButtonEditor;