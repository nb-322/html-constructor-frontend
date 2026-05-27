import React, { useEffect, useState } from 'react';
import { useEditorStore } from '../../../store/useEditorStore.ts';

const HeightEditor = () => {
    const selectedId = useEditorStore(s => s.selectedId);
    const selectedElement = useEditorStore(s => s.elements.find(el => el.id === selectedId));
    const updateElement = useEditorStore(s => s.updateElement);
    const [val, setVal] = useState('');

    useEffect(() => {
        if (selectedElement) setTimeout(() => setVal(String(selectedElement.height)), 0);
    }, [selectedElement?.height, selectedElement]);

    if (!selectedElement) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVal(e.target.value);
        const n = Number(e.target.value);
        if (!isNaN(n) && n > 0) updateElement(selectedElement.id, { height: n });
    };

    return (
        <div className="editor-field">
            <h2>Высота</h2>
            <input type="text" placeholder="px" value={val} onChange={handleChange} />
        </div>
    );
};

export default HeightEditor;
