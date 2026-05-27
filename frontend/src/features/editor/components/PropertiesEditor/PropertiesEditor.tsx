import './PropertiesEditor.css'
import {useEditorStore} from "../../store/useEditorStore.ts";
import ImgEditor from "./ImgEditor/ImgEditor.tsx";
import TextEditor from "./TextEditor/TextEditor.tsx";
import ButtonEditor from "./ButtonEditor/ButtonEditor.tsx";
import XEditor from "./EditorFields/XEditor.tsx";
import YEditor from "./EditorFields/YEditor.tsx";
import WidthEditor from "./EditorFields/WidthEditor.tsx";
import HeightEditor from "./EditorFields/HeightEditor.tsx";
import BackgroundEditor from "./EditorFields/BackgroundEditor.tsx";
import BorderRadiusEditor from "./EditorFields/BorderRadiusEditor.tsx";

const PropertiesEditor = () => {
    const selectedElement = useEditorStore(state =>
        state.elements.find(el => el.id === state.selectedId)
    )

    if (!selectedElement) {
        return <div className="PropertiesEditor">
            Ничего не выбрано
        </div>
    }

    return (
        <div className="PropertiesEditor">
            {selectedElement.type === "img" && (<ImgEditor key={selectedElement.id} selectedElement={selectedElement}/>)}
            {selectedElement.type === "text" && (<TextEditor key={selectedElement.id} selectedElement={selectedElement}/>)}
            {selectedElement.type === "button" && (<ButtonEditor key={selectedElement.id} selectedElement={selectedElement}/>)}
            {(selectedElement.type === "divider" || selectedElement.type === "rectangle") && (
                <div key={selectedElement.id}>
                    <XEditor/>
                    <YEditor/>
                    <WidthEditor/>
                    <HeightEditor/>
                    <BackgroundEditor/>
                    <BorderRadiusEditor/>
                </div>
            )}
        </div>
    );
};

export default PropertiesEditor;