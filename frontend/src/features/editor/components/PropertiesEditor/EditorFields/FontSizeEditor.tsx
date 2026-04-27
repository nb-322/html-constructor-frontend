import {useEditorStore} from "../../../store/useEditorStore.ts";

const FontSizeEditor = () => {
    const fontSizeOptions = [];
    for (let i = 12; i < 101; i+=2) {
        fontSizeOptions.push(i);
    }
    const selectedId = useEditorStore(state => state.selectedId);
    const elements = useEditorStore(state => state.elements);
    const selectedElement = elements.find((el)=>el.id===selectedId);
    const updateElement = useEditorStore(state => state.updateElement)

    if (!selectedElement || selectedElement.type!=="text") return null;
    if (!selectedId) return null;
    return (
        <div className="editor-field">
            <h2>Размер шрифта</h2>
            <select
                value={selectedElement.styles.fontSize}
                onChange={(e) =>
                    updateElement(selectedElement.id, {
                        styles: {
                            ...selectedElement.styles,
                            fontSize: Number(e.target.value)
                        }
                    })
                }
            >
                {fontSizeOptions.map(o => (
                    <option key={o} value={o}>
                        {o}px
                    </option>
                ))}
            </select>
        </div>

    );
};

export default FontSizeEditor;