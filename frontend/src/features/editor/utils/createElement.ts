import type { EditorElement, ElementType} from "../types/Editor.ts"
import { v4 as uuid } from "uuid"

export function createElement(type: ElementType,):EditorElement {
    const base = {
        id: uuid(),
        type,
        x: 100,
        y: 100,
        width: 150,
        height: 50
    }
    switch (type) {
        case "img":
            return {
                ...base,
                type: 'img',
                src:"data:image/jpeg;base64,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",
                styles:{
                    fontSize:24,
                    fontWeight:4,
                    background:"",
                    color:"black",
                    borderRadius:1
                }
            }
            case "text":
                return {
                    ...base,
                    type: 'text',
                    text: "текст+-",
                    styles:{
                        color:'Black',
                        fontSize:24,
                        fontWeight:4,
                        background:"",
                        borderRadius:1
                    }
                }
            case "button":
                return {
                    ...base,
                    type: 'button',
                    text: "Я кнопка!!!!!",
                    link:"",
                    styles:{
                        color:'white',
                        fontSize:24,
                        fontWeight:4,
                        background:"black",
                        borderRadius:1
                    }
                }
    }
    throw new Error("Unknown element type")
}