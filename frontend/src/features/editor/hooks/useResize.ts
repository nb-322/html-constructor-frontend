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
        
        // Вычисляем соотношение сторон элемента для пропорционального ресайза
        const aspectRatio = startWidth / startHeight;

        const move = (e: MouseEvent) => {
            // Вычисляем дельту движения мыши
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            // Определяем направление (горизонтальное или вертикальное движение более значимо)
            const isHorizontalDom = Math.abs(deltaX) > Math.abs(deltaY);
            
            let newWidth: number;
            let newHeight: number;
            
            if (isHorizontalDom) {
                // Если движение горизонтальное - ширина как источник правды
                newWidth = Math.max(40, Math.min(canvasWidth - element.x, startWidth + deltaX));
                newHeight = Math.round(newWidth / aspectRatio);
            } else {
                // Если движение вертикальное - высота как источник правды
                newHeight = Math.max(40, Math.min(canvasHeight - element.y, startHeight + deltaY));
                newWidth = Math.round(newHeight * aspectRatio);
            }
            
            // Финальная проверка, что не выходим за границы по ширине
            if (newWidth > canvasWidth - element.x) {
                newWidth = canvasWidth - element.x;
                newHeight = Math.round(newWidth / aspectRatio);
            }
            
            updateElement(element.id, { width: newWidth, height: newHeight });
            
            // Расширяем canvas если нужно
            if (element.y + newHeight > canvasHeight) {
                setCanvasSize(canvasWidth, element.y + newHeight);
            }
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
