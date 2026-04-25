import type { EditorElement } from "../../types/Editor.ts";
import { ElementWrapper } from "./ElementWrapper";
import {useNavigate} from "react-router-dom";

interface Props {
    element: EditorElement;
}

export function ButtonElement({ element }: Props) {
    const navigate = useNavigate();

    if (element.type !== "button") return null;

    return (
        <ElementWrapper element={element}>
            <button
                onClick={() => navigate(element.link)}
                draggable={false}
                style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    background: "transparent",
                    color: "inherit",
                    fontSize: "inherit",
                    fontWeight: "inherit",
                    cursor: "pointer",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    boxSizing: "border-box",
                }}
            >
                {element.text}
            </button>
        </ElementWrapper>
    );
}
export default ButtonElement;