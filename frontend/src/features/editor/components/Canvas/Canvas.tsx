import './Canvas.css'
import {renderElement} from "../RenderElement/RenderElement.tsx";
import {useEditorStore} from "../../store/useEditorStore.ts";
import {useEffect, useRef} from "react";
import ShadowCanvas from "../../../../contexts/ShadowCanvas.tsx";

const Canvas = () => {
    const canvasRef = useRef<HTMLDivElement>(null)
    const setCanvasSize = useEditorStore((s) => s.setCanvasSize)

    const canvasHeight = useEditorStore(state => state.canvasHeight)

    useEffect(() => {
        if (!canvasRef.current) return
        const {clientWidth} = canvasRef.current
        setCanvasSize(clientWidth, window.innerHeight-20)
    }, [])
    const elements = useEditorStore(s=>s.elements)
    const selectElement= useEditorStore(s=>s.selectElement)
    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
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
            <div className="Canvas" onClick={handleCanvasClick} ref={canvasRef} style={{height: canvasHeight}}>
                {elements.map(el=>renderElement(el))}
            </div>

    );
};

export default Canvas;