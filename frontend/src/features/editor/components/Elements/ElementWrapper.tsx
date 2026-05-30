import React from "react";
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
    const [isDragging, setIsDragging] = React.useState(false);

    const isEditableTarget = (target: EventTarget | null): boolean => {
        if (!target) return false;
        const el = target as HTMLElement;
        return el.contentEditable === "true" || !!el.closest('[contenteditable="true"]');
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).getAttribute("data-resize-handle") === "true") return;

        // Если элемент уже выбран и кликнули на contentEditable — не начинаем drag
        if (isSelected && isEditableTarget(e.target)) return;

        if (!isSelected) selectElement(element.id);

        setIsDragging(true);
        startDrag(e, () => setIsDragging(false));
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
                // Разрешаем выделение текста когда элемент выбран
                userSelect: isSelected ? "text" : "none",
            }}
            onMouseDown={handleMouseDown}
            onDragStart={(e) => e.preventDefault()}
            draggable={false}
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
