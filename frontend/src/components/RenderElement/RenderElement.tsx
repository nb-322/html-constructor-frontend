import type {EditorElement} from "../../types/Editor.ts";
import {TextElement} from "../Elements/TextElement.tsx";
import {ImgElement} from "../Elements/ImgElement.tsx";


export function renderElement(el: EditorElement) {
    switch (el.type) {


        case "text":
            return <div data-element-id={el.id} >
                <TextElement key={el.id} element={el} />
            </div>
        case "img":
            return <div data-element-id={el.id} >
                <ImgElement key = {el.id} element={el} />
            </div>
        default:
            return null
    }
}