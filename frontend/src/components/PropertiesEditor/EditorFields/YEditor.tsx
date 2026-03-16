import React, {useEffect, useState} from "react";
import { useEditorStore } from "../../../store/useEditorStore.ts";

const YEditor = () => {
    const selectedId = useEditorStore(s => s.selectedId);
    const selectedElement = useEditorStore(s => s.elements.find(el => el.id === selectedId));
    const canvasHeight = useEditorStore(s => s.canvasHeight);
    const updateElement = useEditorStore(s => s.updateElement);

    const [yString, setYString] = useState<string>("");

    useEffect(() => {
        if (selectedElement) {
            setTimeout(() => setYString(String(selectedElement.y)), 0)
        }
    }, [selectedElement?.y])

    if (!selectedElement) return null;

    const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setYString(e.target.value);
        const value = Number(e.target.value);
        if (!isNaN(value)) {
            const newY = Math.min(Math.max(value, 0), canvasHeight - selectedElement.height);
            updateElement(selectedElement.id, { y: newY });
        }
    };

    return (
        <div>
            <h2>Позиция по Y</h2>
            <input
                type="text"
                placeholder="Значение по Y"
                value={yString}
                onChange={handleYChange}
            />
        </div>
    );
};

export default YEditor;