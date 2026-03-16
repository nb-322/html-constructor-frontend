export type ElementType = "img" | "text";

export interface BaseElement {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export type BaseStyles = {
    color?: string
    fontSize?: number
    fontWeight: number
    background: string
    borderRadius: number
}

export type TextStyles = BaseStyles & {

}

export type ImgStyles = BaseStyles & {

}

export interface ImgElement extends BaseElement {
    type: "img"
    src: string
    styles: ImgStyles
}

export interface TextElement extends BaseElement {
    type: "text"
    text: string
    styles: TextStyles
}

export type EditorElement = TextElement | ImgElement;