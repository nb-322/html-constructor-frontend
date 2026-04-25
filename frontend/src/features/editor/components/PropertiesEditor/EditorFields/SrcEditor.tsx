import {useEditorStore} from "../../../store/useEditorStore.ts";

const SrcEditor = () => {
    const selectedId = useEditorStore(state => state.selectedId);
    const elements = useEditorStore(state => state.elements);
    const selectedElement = elements.find((el)=>el.id===selectedId);
    const updateElement = useEditorStore(state => state.updateElement)

    if (!selectedElement || selectedElement.type!=="img") return null;
    if (!selectedId) return null;
    return (
            <div className="editor-field">
                <h2>Источник</h2>
                <input
                    type="text"
                    placeholder={"URL изображения"}
                    value={selectedElement.src}
                    onChange={(e)=>{updateElement(selectedId,{src:e.target.value})}}
                />
            </div>

    );
};

export default SrcEditor;