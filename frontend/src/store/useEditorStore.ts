import { create } from "zustand"
import { createElement } from "../utils/createElement"
import type {EditorElement, ElementType} from "../types/Editor.ts"
interface EditorState {
    elements: EditorElement[]
    selectedId: string | null

    addElement: (type: ElementType) => void
    selectElement: (id: string | null) => void
    updateElement: (id: string, data: Partial<EditorElement>) => void
    removeElement: (id: string) => void

    canvasWidth: number
    canvasHeight: number
    setCanvasSize: (width: number, height:number) => void
}
export const useEditorStore = create<EditorState>((set) => ({
    elements: [],
    selectedId: null,

    addElement: (type) =>
        set((state) => ({
            elements: [
                ...state.elements,
                createElement(type)
            ]
        })),

    selectElement: (id) =>
        set({ selectedId: id }),

    updateElement: (
        id: string,
        data: Partial<Omit<EditorElement, "type" | "id">>
    ) =>
        set((state) => ({
            elements: state.elements.map((el) => {
                if (el.id !== id) return el

                return {
                    ...el,
                    ...data,
                    styles: data.styles
                        ? { ...el.styles, ...data.styles }
                        : el.styles
                } as EditorElement
            })
        })),

    removeElement: (id) =>
        set((state) => ({
            elements: state.elements.filter(el => el.id !== id),
            selectedId: state.selectedId === id ? null : state.selectedId
        })),
    canvasWidth: 0,
    canvasHeight: 0,
    setCanvasSize:(width, height) =>{
        set({canvasWidth:width, canvasHeight:height})
    }
}))