import type {TextElement} from "../../types/Editor.ts";
import { useEditorStore } from "../../store/useEditorStore.ts";
import {useRef, useLayoutEffect, } from "react";

interface Props {
    element: TextElement;
}

export function TextElement({ element }: Props) {
    const selectedId = useEditorStore(s => s.selectedId);
    const isSelected = selectedId === element.id;
    const canvasWidth = useEditorStore(s => s.canvasWidth);
    const canvasHeight = useEditorStore(s => s.canvasHeight);
    const setCanvasSize = useEditorStore(s => s.setCanvasSize);
    const updateElement = useEditorStore(s => s.updateElement);

    const textRef = useRef<HTMLDivElement>(null);
    const divRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!textRef.current) return;
        const h = textRef.current.scrollHeight;
        if (h !== element.height) updateElement(element.id, { height: h });
    }, []);


    const startDrag = (e: React.MouseEvent) => {
        if (document.activeElement === textRef.current) return;
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

    return (
        <div
            ref={divRef}
            style={{
                position: "absolute",
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                outline: isSelected ? "1px solid skyblue" : "none",
                boxSizing: "border-box",
                cursor: isSelected ? "text" : "move",
            }}
            onMouseDown={startDrag}
        >
            <div
                ref={textRef}
                contentEditable={isSelected}
                suppressContentEditableWarning
                onInput={() => {
                    if (!textRef.current) return
                    const el = textRef.current
                    el.style.height = "auto"
                    const newHeight = el.scrollHeight
                    if (newHeight !== element.height) {
                        updateElement(element.id, { height: newHeight })
                    }
                    if (element.y + newHeight > canvasHeight) {
                        setCanvasSize(canvasWidth, element.y + newHeight)
                    }
                }}
                onBlur={() => {
                    if (!textRef.current) return
                    updateElement(element.id, { text: textRef.current.innerText })
                }}
                style={{
                    width: "100%",
                    height: "auto",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    color: element.styles.color,
                    fontSize: element.styles.fontSize,
                    fontWeight: element.styles.fontWeight,
                    background: element.styles.background,
                    borderRadius: element.styles.borderRadius,
                    boxSizing: "border-box",
                }}
            >
                {element.text}
            </div>
            {isSelected && (<div
                onMouseDown={startResize}
                style={{
                    position: "absolute",
                    width: 10,
                    height: 10,
                    right: 0,
                    bottom: 0,
                    background: "skyblue",
                    cursor: "nwse-resize",
                    borderRadius: "50%",
                }}
            />)}
        </div>
    );
}