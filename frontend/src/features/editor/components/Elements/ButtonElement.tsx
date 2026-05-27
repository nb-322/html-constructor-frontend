import type { EditorElement } from "../../types/Editor.ts";
import { useEditorStore } from "../../store/useEditorStore.ts";
import { useRef, useLayoutEffect } from "react";
import { ElementWrapper } from "./ElementWrapper";

interface Props {
    element: EditorElement;
}

export function ButtonElement({ element }: Props) {
    const updateElement = useEditorStore(s => s.updateElement);
    const selectedId = useEditorStore(s => s.selectedId);
    const isSelected = selectedId === element.id;
    const btnRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!btnRef.current) return;
        const h = btnRef.current.scrollHeight;
        if (h !== element.height) updateElement(element.id, { height: h });
    }, []);

    if (element.type !== "button") return null;

    return (
        <ElementWrapper element={element}>
            <div
                ref={btnRef}
                contentEditable={isSelected}
                suppressContentEditableWarning
                draggable={false}
                onBlur={() => {
                    if (!btnRef.current) return;
                    updateElement(element.id, { text: btnRef.current.innerText });
                }}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    color: element.styles.color,
                    fontSize: element.styles.fontSize,
                    fontWeight: element.styles.fontWeight,
                    background: element.styles.background,
                    borderRadius: element.styles.borderRadius,
                    boxSizing: "border-box",
                    padding: "0 8px",
                    textAlign: "center",
                    lineHeight: "normal",
                    cursor: isSelected ? "text" : "pointer",
                    transition: "height 0.15s ease, width 0.15s ease",
                    outline: "none",
                }}
            >
                {element.text}
            </div>
        </ElementWrapper>
    );
}
export default ButtonElement;
