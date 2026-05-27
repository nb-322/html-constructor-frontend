import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import type { EditorElement } from '../../../editor/types/Editor.ts';

interface Props {
    htmlBody: string;
    fallbackClass: string;
}

const CANVAS_W = 600;
const CANVAS_H = 800;

export default function TemplatePreview({ htmlBody, fallbackClass }: Props) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useLayoutEffect(() => {
        if (!wrapRef.current) return;
        const { width, height } = wrapRef.current.getBoundingClientRect();
        setScale(Math.min(width / CANVAS_W, height / CANVAS_H));
    }, []);

    let elements: EditorElement[] = [];
    try {
        const parsed = JSON.parse(htmlBody);
        if (Array.isArray(parsed)) elements = parsed;
    } catch {
        return <div className={`w-full h-full ${fallbackClass}`} />;
    }

    if (elements.length === 0) {
        return <div className={`w-full h-full ${fallbackClass}`} />;
    }

    return (
        <div ref={wrapRef} className="w-full h-full overflow-hidden bg-white relative">
            <div
                style={{
                    width: CANVAS_W,
                    height: CANVAS_H,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transformOrigin: 'top left',
                    transform: `scale(${scale})`,
                }}
            >
                {elements.map((el) => {
                    const base: CSSProperties = {
                        position: 'absolute',
                        left: el.x,
                        top: el.y,
                        width: el.width,
                        height: el.height,
                        background: el.styles.background,
                        borderRadius: el.styles.borderRadius,
                        boxSizing: 'border-box',
                        pointerEvents: 'none',
                    };

                    if (el.type === 'text') return (
                        <div key={el.id} style={{ ...base, color: el.styles.color, fontSize: el.styles.fontSize, fontWeight: el.styles.fontWeight, overflowWrap: 'break-word' }}>
                            {el.text}
                        </div>
                    );
                    if (el.type === 'img') return (
                        <img key={el.id} src={el.src} style={{ ...base, objectFit: 'cover' }} alt="" />
                    );
                    if (el.type === 'button') return (
                        <div key={el.id} style={{ ...base, color: el.styles.color, fontSize: el.styles.fontSize, fontWeight: el.styles.fontWeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {el.text}
                        </div>
                    );
                    return null;
                })}
            </div>
        </div>
    );
}
