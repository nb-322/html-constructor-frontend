export type ElementType = "img" | "text" | "button" | "divider" | "rectangle";

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
export type ButtonStyles = BaseStyles & {

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
export interface ButtonElement extends BaseElement {
    type: "button"
    link: string
    text: string
    styles: ButtonStyles
}
export interface DividerElement extends BaseElement {
    type: 'divider';
    styles: BaseStyles;
}

export interface RectangleElement extends BaseElement {
    type: 'rectangle';
    styles: BaseStyles;
}

export type EditorElement = TextElement | ImgElement | ButtonElement | DividerElement | RectangleElement;