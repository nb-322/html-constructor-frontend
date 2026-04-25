import type {EditorElement} from "../../types/Editor.ts";
import {TextElement} from "../Elements/TextElement.tsx";
import {ImgElement} from "../Elements/ImgElement.tsx";
import ButtonElement from "../Elements/ButtonElement.tsx";


export function renderElement(el: EditorElement) {
    switch (el.type) {

        case "button":
            return <ButtonElement key={el.id} element={el}></ButtonElement>
        case "text":
            return <TextElement key={el.id} element={el} />
        case "img":
            return <ImgElement key = {el.id} element={el} />
        default:
            return null
    }
}