import { useEditorStore } from "../../../store/useEditorStore.ts";

const toHex = (color: string): string => {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (!ctx) return '#000000';
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    } catch {
        return '#000000';
    }
};

const ColorEditor = () => {
    const selectedId = useEditorStore(s => s.selectedId);
    const selectedElement = useEditorStore(s => s.elements.find(el => el.id === s.selectedId));
    const updateElement = useEditorStore(s => s.updateElement);

    if (!selectedElement || !selectedId) return null;

    const value = selectedElement.styles.color ?? '';

    const handleChange = (color: string) => {
        updateElement(selectedId, { styles: { ...selectedElement.styles, color } });
    };

    return (
        <div className="editor-field">
            <h2>Цвет</h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                    type="color"
                    value={toHex(value || '#000000')}
                    onChange={(e) => handleChange(e.target.value)}
                    style={{
                        width: 36, height: 36, padding: 2,
                        border: '1px solid var(--border)', borderRadius: 6,
                        cursor: 'pointer', background: 'var(--card)', flexShrink: 0,
                    }}
                    title="Выбрать цвет"
                />
                <input
                    type="text"
                    placeholder="Цвет текста"
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                />
            </div>
        </div>
    );
};

export default ColorEditor;
