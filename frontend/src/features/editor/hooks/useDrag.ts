import { useEditorStore, GRID_SIZE } from "../store/useEditorStore";
import type { EditorElement } from "../types/Editor";

const snap = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

export const useDrag = (element: EditorElement) => {
    const canvasWidth = useEditorStore(s => s.canvasWidth);
    const canvasHeight = useEditorStore(s => s.canvasHeight);
    const updateElement = useEditorStore(s => s.updateElement);
    const snapGrid = useEditorStore(s => s.snapGrid);

    const startDrag = (e: React.MouseEvent, onDragEnd?: () => void) => {
        e.stopPropagation();

        const startX = e.clientX;
        const startY = e.clientY;
        const startLeft = element.x;
        const startTop = element.y;

        const move = (e: MouseEvent) => {
            const rawX = startLeft + e.clientX - startX;
            const rawY = startTop + e.clientY - startY;
            const snappedX = snapGrid ? snap(rawX) : rawX;
            const snappedY = snapGrid ? snap(rawY) : rawY;
            const newX = Math.max(0, Math.min(canvasWidth - element.width, snappedX));
            const newY = Math.max(0, Math.min(canvasHeight - element.height, snappedY));
            updateElement(element.id, { x: newX, y: newY });
        };

        const up = () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
            onDragEnd?.();
        };

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    };

    return { startDrag };
};
