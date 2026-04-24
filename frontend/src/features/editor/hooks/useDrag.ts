import { useEditorStore } from "../store/useEditorStore";
import type { EditorElement } from "../types/Editor";

export const useDrag = (element: EditorElement) => {
    const canvasWidth = useEditorStore(s => s.canvasWidth);
    const canvasHeight = useEditorStore(s => s.canvasHeight);
    const updateElement = useEditorStore(s => s.updateElement);

    const startDrag = (e: React.MouseEvent) => {
        e.stopPropagation();

        const startX = e.clientX;
        const startY = e.clientY;
        const startLeft = element.x;
        const startTop = element.y;

        const move = (e: MouseEvent) => {
            const newX = Math.max(0, Math.min(canvasWidth - element.width, startLeft + e.clientX - startX));
            const newY = Math.max(0, Math.min(canvasHeight - element.height, startTop + e.clientY - startY));
            updateElement(element.id, { x: newX, y: newY });
        };
        
        const up = () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
        };
        
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    };

    return { startDrag };
};
