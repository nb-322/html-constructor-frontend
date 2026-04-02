import type { EditorElement } from "../../types/Editor.ts";
import { useEditorStore } from "../../store/useEditorStore.ts";
import { useRef, useLayoutEffect } from "react";
import { ElementWrapper } from "./ElementWrapper";

interface Props {
    element: EditorElement;
}

export function ImgElement({ element }: Props) {
    const updateElement = useEditorStore(s => s.updateElement);

    const imgRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!imgRef.current) return;
        const h = imgRef.current.scrollHeight;
        if (h !== element.height) updateElement(element.id, { height: h });
    }, []);

    if (element.type !== "img") return null;

    return (
        <ElementWrapper element={element}>
            <div
                ref={imgRef}
                style={{
                    width: "100%",
                    height: "100%",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    color: element.styles.color,
                    fontSize: element.styles.fontSize,
                    fontWeight: element.styles.fontWeight,
                    background: element.styles.background,
                    borderRadius: element.styles.borderRadius,
                    boxSizing: "border-box",
                    transition: "height 0.15s ease, width 0.15s ease",
                }}
            >
                <img
                    src={element.src}
                    draggable={false}
                    style={{ height: "100%", width: "100%" }}
                    alt=""
                />
            </div>
        </ElementWrapper>
    );
}