import React, {useEffect, useState} from 'react';
import {useEditorStore} from "../../../store/useEditorStore.ts";

const XEditor = () => {
    const canvasWidth = useEditorStore((s)=>s.canvasWidth);
    const updateElement = useEditorStore(state => state.updateElement)
    const selectedId = useEditorStore(state => state.selectedId)
    const selectedElement = useEditorStore(state => state.elements.find((el)=>el.id===selectedId))
    const [xString,setXString] = useState<string>(String(selectedElement?.x))
    useEffect(() => {
        if (selectedElement){
            setTimeout(() => setXString(String(selectedElement.x)), 0)
        }
    },[selectedElement?.x, selectedElement])
    if (!selectedElement) return null
    const handleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setXString(e.target.value)
        const value = Number(e.target.value);

        if (!isNaN(value)){
            const newX = Math.min(Math.max(value, 0), canvasWidth - selectedElement.width);
            updateElement(selectedElement.id, { x: newX });
        }
    }
    return (
        <div className="editor-field">
            <h2>Позиция по x</h2>
            <input
                type="text"
                placeholder={"Значение по x"}
                value={xString}
                onChange={handleXChange}
            />
        </div>
    );
};

export default XEditor;