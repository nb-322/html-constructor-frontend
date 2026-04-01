import React from "react";
import { useEditorStore } from "../../store/useEditorStore";
import { useDrag } from "../../hooks/useDrag";
import { useResize } from "../../hooks/useResize";
import type { EditorElement } from "../../types/Editor";

interface ElementWrapperProps {
    element: EditorElement;
    children: React.ReactNode;
    onMouseDown?: (e: React.MouseEvent) => void;
}

export const ElementWrapper: React.FC<ElementWrapperProps> = ({ element, children, onMouseDown }) => {
    const selectedId = useEditorStore(s => s.selectedId);
    const isSelected = selectedId === element.id;
    const { startDrag } = useDrag(element);
    const { startResize } = useResize(element);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (onMouseDown) onMouseDown(e);
        startDrag(e);
    };

    return (
        <div
            data-element-id={element.id}
            style={{
                position: "absolute",
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                outline: isSelected ? "1px solid skyblue" : "none",
                boxSizing: "border-box",
                cursor: isSelected ? "text" : "move",
            }}
            onMouseDown={handleMouseDown}
        >
            {children}
            {isSelected && (
                <div
                    onMouseDown={startResize}
                    style={{
                        position: "absolute",
                        width: 10,
                        height: 10,
                        right: 0,
                        bottom: 0,
                        background: "skyblue",
                        cursor: "nwse-resize",
                        borderRadius: "50%",
                    }}
                />
            )}
        </div>
    );
};
