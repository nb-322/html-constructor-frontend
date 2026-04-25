import {useEditorStore} from "../../../store/useEditorStore.ts";

const BackgroundEditor = () => {
    const selectedId = useEditorStore(s=>s.selectedId);
    const elements = useEditorStore(s=>s.elements);
    const selectedElement =  elements.find(s=>s.id === selectedId);
    const updateElement = useEditorStore(state => state.updateElement)

    if (!selectedElement) return null;
    if (!selectedId) return null;
    return (
        <div className="editor-field">
            <h2>Фон</h2>
            <input
                type="text"
                placeholder={"Цвет фона"}
                value={selectedElement.styles.background}
                onChange={(e)=>{updateElement(selectedId,{styles:{...selectedElement?.styles, background:(e.target.value)}})}}
            />
        </div>
    );
};

export default BackgroundEditor;