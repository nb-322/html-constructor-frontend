import './PropertiesEditor.css'
import {useEditorStore} from "../../store/useEditorStore.ts";
import ImgEditor from "./ImgEditor/ImgEditor.tsx";
import TextEditor from "./TextEditor/TextEditor.tsx";
import ButtonEditor from "./ButtonEditor/ButtonEditor.tsx";

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
        </div>

    );
};

export default PropertiesEditor;