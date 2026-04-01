import type { TextElement } from "../../types/Editor.ts";
import { useEditorStore } from "../../store/useEditorStore.ts";
import { useRef, useLayoutEffect } from "react";
import { ElementWrapper } from "./ElementWrapper";

interface Props {
    element: TextElement;
}

export function TextElement({ element }: Props) {
    const updateElement = useEditorStore(s => s.updateElement);
    const canvasWidth = useEditorStore(s => s.canvasWidth);
    const canvasHeight = useEditorStore(s => s.canvasHeight);
    const setCanvasSize = useEditorStore(s => s.setCanvasSize);

    const textRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!textRef.current) return;
        const h = textRef.current.scrollHeight;
        if (h !== element.height) updateElement(element.id, { height: h });
    }, []);

    return (
        <ElementWrapper element={element}>
            <div
                ref={textRef}
                contentEditable
                suppressContentEditableWarning
                onInput={() => {
                    if (!textRef.current) return;
                    const el = textRef.current;
                    el.style.height = "auto";
                    const newHeight = el.scrollHeight;
                    if (newHeight !== element.height) {
                        updateElement(element.id, { height: newHeight });
                    }
                    if (element.y + newHeight > canvasHeight) {
                        setCanvasSize(canvasWidth, element.y + newHeight);
                    }
                }}
                onBlur={() => {
                    if (!textRef.current) return;
                    updateElement(element.id, { text: textRef.current.innerText });
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
        </ElementWrapper>
    );
}