import { useEditorStore } from "../store/useEditorStore";
import type { EditorElement } from "../types/Editor";

export const useResize = (element: EditorElement) => {
    const canvasWidth = useEditorStore(s => s.canvasWidth);
    const canvasHeight = useEditorStore(s => s.canvasHeight);
    const updateElement = useEditorStore(s => s.updateElement);
    const setCanvasSize = useEditorStore(s => s.setCanvasSize);

    const startResize = (e: React.MouseEvent) => {
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = element.width;
        const startHeight = element.height;

        const move = (e: MouseEvent) => {
            const newWidth = Math.max(20, Math.min(canvasWidth - element.x, startWidth + e.clientX - startX));
            const newHeight = Math.max(20, startHeight + e.clientY - startY);
            updateElement(element.id, { width: newWidth, height: newHeight });
            if (element.y + newHeight > canvasHeight) setCanvasSize(canvasWidth, element.y + newHeight);
        };
        const up = () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    };

    return { startResize };
};
