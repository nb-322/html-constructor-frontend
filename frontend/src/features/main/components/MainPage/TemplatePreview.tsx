import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import type { EditorElement } from '../../../editor/types/Editor.ts';
import { extractEditorJson } from '../../../editor/components/ToolBar/ExportHTML.tsx';

interface Props {
    htmlBody: string;
    fallbackClass: string;
}

/** Достаёт массив элементов из html_body (JSON или формат после экспорта) */
function parseElements(htmlBody: string): EditorElement[] | null {
    if (!htmlBody) return null;
    // Формат после экспорта: <!--EDITOR_JSON_START:...:EDITOR_JSON_END-->
    const fromExport = extractEditorJson(htmlBody);
    if (fromExport) return fromExport;
    // Старый формат: просто JSON-массив
    try {
        const parsed = JSON.parse(htmlBody);
        return Array.isArray(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

export default function TemplatePreview({ htmlBody, fallbackClass }: Props) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    const elements = parseElements(htmlBody);

    useLayoutEffect(() => {
        if (!wrapRef.current || !elements?.length) return;
        const { width, height } = wrapRef.current.getBoundingClientRect();

        // Вычисляем реальный bounding box всех элементов
        const maxRight  = Math.max(...elements.map(el => el.x + el.width));
        const maxBottom = Math.max(...elements.map(el => el.y + el.height));

        const scaleX = maxRight  > 0 ? width  / maxRight  : 1;
        const scaleY = maxBottom > 0 ? height / maxBottom : 1;
        setScale(Math.min(scaleX, scaleY));
    }, [htmlBody]);

    if (!elements || elements.length === 0) {
        return <div className={`w-full h-full ${fallbackClass}`} />;
    }

    const maxRight  = Math.max(...elements.map(el => el.x + el.width));
    const maxBottom = Math.max(...elements.map(el => el.y + el.height));

    return (
        <div ref={wrapRef} className="w-full h-full overflow-hidden bg-white relative">
            <div
                style={{
                    width: maxRight,
                    height: maxBottom,
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
                        <div key={el.id} style={{ ...base, color: el.styles.color, fontSize: el.styles.fontSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {el.text}
                        </div>
                    );
                    if (el.type === 'divider' || el.type === 'rectangle') return (
                        <div key={el.id} style={{ ...base }} />
                    );
                    return null;
                })}
            </div>
        </div>
    );
}
