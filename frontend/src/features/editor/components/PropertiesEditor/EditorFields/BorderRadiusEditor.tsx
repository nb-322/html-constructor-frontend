import React, { useEffect, useState } from 'react';
import { useEditorStore } from '../../../store/useEditorStore.ts';

const BorderRadiusEditor = () => {
    const selectedId = useEditorStore(s => s.selectedId);
    const selectedElement = useEditorStore(s => s.elements.find(el => el.id === selectedId));
    const updateElement = useEditorStore(s => s.updateElement);
    const [val, setVal] = useState('');

    useEffect(() => {
        if (selectedElement) setTimeout(() => setVal(String(selectedElement.styles.borderRadius ?? 0)), 0);
    }, [selectedElement?.styles?.borderRadius, selectedElement]);

    if (!selectedElement) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVal(e.target.value);
        const n = Number(e.target.value);
        if (!isNaN(n) && n >= 0) updateElement(selectedElement.id, { styles: { ...selectedElement.styles, borderRadius: n } });
    };

    return (
        <div className="editor-field">
            <h2>Скругление</h2>
            <input type="text" placeholder="px" value={val} onChange={handleChange} />
        </div>
    );
};

export default BorderRadiusEditor;
