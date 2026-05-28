import { useEditorStore, GRID_SIZE } from "../store/useEditorStore";
import type { EditorElement } from "../types/Editor";

const snap = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

export const useResize = (element: EditorElement) => {
    const canvasWidth = useEditorStore(s => s.canvasWidth);
    const canvasHeight = useEditorStore(s => s.canvasHeight);
    const updateElement = useEditorStore(s => s.updateElement);
    const setCanvasSize = useEditorStore(s => s.setCanvasSize);
    const snapGrid = useEditorStore(s => s.snapGrid);

    const startResize = (e: React.MouseEvent) => {
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = element.width;
        const startHeight = element.height;

        const move = (e: MouseEvent) => {
            const rawWidth = startWidth + e.clientX - startX;
            const rawHeight = startHeight + e.clientY - startY;
            const snappedWidth = snapGrid ? snap(rawWidth) : rawWidth;
            const snappedHeight = snapGrid ? snap(rawHeight) : rawHeight;
            const newWidth = Math.max(GRID_SIZE, Math.min(canvasWidth - element.x, snappedWidth));
            const newHeight = Math.max(GRID_SIZE, snappedHeight);
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
