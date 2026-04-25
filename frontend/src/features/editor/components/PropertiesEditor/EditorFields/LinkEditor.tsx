import {useEditorStore} from "../../../store/useEditorStore.ts";

const LinkEditor = () => {
    const selectedId = useEditorStore(state => state.selectedId);
    const elements = useEditorStore(state => state.elements);
    const selectedElement = elements.find((el)=>el.id===selectedId);
    const updateElement = useEditorStore(state => state.updateElement)

    if (!selectedElement || selectedElement.type!=="button") return null;
    if (!selectedId) return null;
    return (
        <div className="editor-field">
            <h2>Ссылка</h2>
            <input
                type="text"
                placeholder={"Ссылка для перехода"}
                value={selectedElement.link}
                onChange={(e)=>{updateElement(selectedId,{link:e.target.value})}}
            />
        </div>

    );
};

export default LinkEditor;