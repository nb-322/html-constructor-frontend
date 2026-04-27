import {useEditorStore} from "../../../store/useEditorStore.ts";

const ColorEditor = () => {
    const selectedId = useEditorStore(s=>s.selectedId);
    const elements = useEditorStore(s=>s.elements);
    const selectedElement =  elements.find(s=>s.id === selectedId);
    const updateElement = useEditorStore(state => state.updateElement)

    if (!selectedElement) return null;
    if (!selectedId) return null;
    return (
        <div className="editor-field">
            <h2>Цвет</h2>
            <input
                type="text"
                placeholder={"Цвет текста"}
                value={selectedElement.styles.color}
                onChange={(e)=>{updateElement(selectedId,{styles:{...selectedElement?.styles, color:(e.target.value)}})}}
            />
        </div>
    );
};

export default ColorEditor;