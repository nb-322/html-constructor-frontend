import React, { useRef } from "react";
import { useEditorStore } from "../../store/useEditorStore";
import { useDrag } from "../../hooks/useDrag";
import { useResize } from "../../hooks/useResize";
import type { EditorElement } from "../../types/Editor";

interface ElementWrapperProps {
    element: EditorElement;
    children: React.ReactNode;
}

export const ElementWrapper: React.FC<ElementWrapperProps> = ({ element, children }) => {
    const selectedId = useEditorStore(s => s.selectedId);
    const selectElement = useEditorStore(s => s.selectElement);
    const isSelected = selectedId === element.id;
    const { startDrag } = useDrag(element);
    const { startResize } = useResize(element);
    const dragStartedRef = useRef(false);
    const [isDragging, setIsDragging] = React.useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        // Если это не resize хэндл
        if ((e.target as HTMLElement).getAttribute("data-resize-handle") !== "true") {
            dragStartedRef.current = false;
            setIsDragging(true);
            // Выбираем элемент при клике, если еще не выбран
            if (!isSelected) {
                selectElement(element.id);
            }
            startDrag(e, () => setIsDragging(false));
        }
    };

    const handleResizeMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        startResize(e);
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
                outline: isSelected ? "2px solid #00D9FF" : "2px solid rgba(0, 217, 255, 0.3)",
                outlineOffset: "-2px",
                boxSizing: "border-box",
                cursor: isSelected ? "move" : "pointer",
                transition: isDragging ? "none" : "outline 0.1s ease",
                userSelect: "none",
            }}
            onMouseDown={handleMouseDown}
        >
            {children}
            {isSelected && !isDragging && (
                <div
                    data-resize-handle="true"
                    onMouseDown={handleResizeMouseDown}
                    style={{
                        position: "absolute",
                        width: 12,
                        height: 12,
                        right: -6,
                        bottom: -6,
                        background: "linear-gradient(135deg, #00D9FF 0%, #FF006E 100%)",
                        cursor: "nwse-resize",
                        borderRadius: "50%",
                        border: "2px solid white",
                        boxShadow: "0 2px 8px rgba(0, 217, 255, 0.4)",
                        zIndex: 10,
                    }}
                />
            )}
        </div>
    );
};
