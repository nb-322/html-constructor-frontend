import './Canvas.css'
import {renderElement} from "../RenderElement/RenderElement.tsx";
import {useEditorStore} from "../../store/useEditorStore.ts";
import {useEffect, useRef, useState} from "react";

const Canvas = () => {
    const canvasRef = useRef<HTMLDivElement>(null)
    const setCanvasSize = useEditorStore((s) => s.setCanvasSize)
    const canvasHeight = useEditorStore(state => state.canvasHeight)
    
    // Отслеживаем, был ли drag
    const isDraggingRef = useRef(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!canvasRef.current) return
        const {clientWidth} = canvasRef.current
        setCanvasSize(clientWidth, window.innerHeight-20)
    }, [setCanvasSize])
    
    const elements = useEditorStore(s=>s.elements)
    const selectElement= useEditorStore(s=>s.selectElement)
    
    const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setStartPos({ x: e.clientX, y: e.clientY });
        isDraggingRef.current = false;
    };
    
    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (Math.abs(e.clientX - startPos.x) > 3 || Math.abs(e.clientY - startPos.y) > 3) {
            isDraggingRef.current = true;
        }
    };
    
    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Игнорируем клики, которые были драгами
        if (isDraggingRef.current) return;
        
        const target = e.target as HTMLElement

        const elementNode = target.closest("[data-element-id]") as HTMLElement | null

        if (elementNode) {
            const id = elementNode.dataset.elementId!
            selectElement(id)
        } else {
            selectElement(null)
        }
    }

    return (
        <div 
            className="Canvas" 
            onClick={handleCanvasClick}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            ref={canvasRef} 
            style={{height: canvasHeight}}
        >
            {elements.map(el=>renderElement(el))}
        </div>
    );
};

export default Canvas;