import type {EditorElement} from "../../types/Editor.ts";
import {TextElement} from "../Elements/TextElement.tsx";
import {ImgElement} from "../Elements/ImgElement.tsx";
import ButtonElement from "../Elements/ButtonElement.tsx";
import { ElementWrapper } from "../Elements/ElementWrapper.tsx";

export function renderElement(el: EditorElement) {
    switch (el.type) {
        case "button":
            return <ButtonElement key={el.id} element={el} />
        case "text":
            return <TextElement key={el.id} element={el} />
        case "img":
            return <ImgElement key={el.id} element={el} />
        case "divider":
            return (
                <ElementWrapper key={el.id} element={el}>
                    <div style={{
                        width: '100%', height: '100%',
                        background: el.styles.background,
                        borderRadius: el.styles.borderRadius,
                    }} />
                </ElementWrapper>
            )
        case "rectangle":
            return (
                <ElementWrapper key={el.id} element={el}>
                    <div style={{
                        width: '100%', height: '100%',
                        background: el.styles.background,
                        borderRadius: el.styles.borderRadius,
                    }} />
                </ElementWrapper>
            )
        default:
            return null
    }
}