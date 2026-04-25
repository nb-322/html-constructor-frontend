import type { EditorElement } from "../../types/Editor.ts";
import { useEditorStore } from "../../store/useEditorStore.ts";
import { useRef, useLayoutEffect } from "react";
import { ElementWrapper } from "./ElementWrapper";
import {useNavigate} from "react-router-dom";

interface Props {
    element: EditorElement;
}

export function ButtonElement({ element }: Props) {
    const updateElement = useEditorStore(s => s.updateElement);
    const navigate = useNavigate();
    const imgRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!imgRef.current) return;
        const h = imgRef.current.scrollHeight;
        if (h !== element.height) updateElement(element.id, { height: h });
    }, []);

    if (element.type !== "button") return null;

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
                <button
                    onClick={() => navigate(element.link)}
                    draggable={false}
                    style={{ height: "100%", width: "100%" }}
                    value={element.text}
                />
            </div>
        </ElementWrapper>
    );
}
export default ButtonElement;