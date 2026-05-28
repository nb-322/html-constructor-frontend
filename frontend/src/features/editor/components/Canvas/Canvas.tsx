import './Canvas.css'
import {renderElement} from "../RenderElement/RenderElement.tsx";
import {useEditorStore} from "../../store/useEditorStore.ts";
import {useEffect, useRef} from "react";
import React from "react";

/** Отступ ниже самого нижнего элемента */
const BOTTOM_PADDING = 120;

const Canvas = () => {
    const canvasRef = useRef<HTMLDivElement>(null)
    const setCanvasSize = useEditorStore((s) => s.setCanvasSize)
    const canvasWidth  = useEditorStore((s) => s.canvasWidth)
    const canvasHeight = useEditorStore(state => state.canvasHeight)
    const showGrid = useEditorStore(s => s.showGrid)
    const elements = useEditorStore(s => s.elements)
    const selectElement = useEditorStore(s => s.selectElement)

    // Инициализация размера канваса по реальным размерам контейнера
    useEffect(() => {
        if (!canvasRef.current) return
        const { clientWidth, clientHeight } = canvasRef.current
        setCanvasSize(clientWidth, clientHeight)
    }, [])

    // Автоматическое расширение/сжатие по мере движения элементов
    useEffect(() => {
        if (!canvasRef.current) return

        const containerHeight = canvasRef.current.parentElement?.clientHeight ?? window.innerHeight
        const minHeight = containerHeight - 48 // учитываем padding контейнера

        const maxBottom = elements.reduce(
            (max, el) => Math.max(max, el.y + el.height),
            0
        )

        const needed = Math.max(minHeight, maxBottom + BOTTOM_PADDING)

        // Обновляем только если разница больше 1px (избегаем лишних ре-рендеров)
        if (Math.abs(needed - canvasHeight) > 1) {
            setCanvasSize(canvasWidth || canvasRef.current.clientWidth, needed)
        }
    }, [elements])

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement
        const elementNode = target.closest("[data-element-id]") as HTMLElement | null
        if (elementNode) {
            selectElement(elementNode.dataset.elementId!)
        } else {
            selectElement(null)
        }
    }

    return (
        <div
            className={`Canvas${showGrid ? ' Canvas--grid' : ''}`}
            onClick={handleCanvasClick}
            ref={canvasRef}
            style={{
                height: canvasHeight,
                transition: 'height 0.15s ease',
            }}
        >
            {elements.map(el => renderElement(el))}
        </div>
    );
};

export default Canvas;