import { useEditorStore } from '../../store/useEditorStore.ts';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { apiUpdateTemplate } from '../../../../api/api.ts';
import type { EditorElement } from '../../types/Editor.ts';

interface Props {
    templateId?: number;
    templateName?: string;
}

// Маркеры для хранения JSON редактора внутри html_body
const JSON_START = '<!--EDITOR_JSON_START:';
const JSON_END = ':EDITOR_JSON_END-->';

/** Извлекает JSON редактора из html_body (если он там есть) */
export const extractEditorJson = (htmlBody: string): EditorElement[] | null => {
    const s = htmlBody.indexOf(JSON_START);
    const e = htmlBody.indexOf(JSON_END);
    if (s === -1 || e === -1) return null;
    try {
        const b64 = htmlBody.slice(s + JSON_START.length, e);
        const json = decodeURIComponent(escape(atob(b64)));
        const parsed = JSON.parse(json);
        return Array.isArray(parsed) ? parsed : null;
    } catch {
        return null;
    }
};

/** Генерирует чистый email-HTML из элементов */
export const generateEmailHTML = (
    elements: EditorElement[],
    canvasWidth: number,
    canvasHeight: number
): string => {
    const parts: string[] = [];

    for (const el of elements) {
        const base = [
            `position:absolute`,
            `left:${el.x}px`,
            `top:${el.y}px`,
            `width:${el.width}px`,
            `height:${el.height}px`,
            `box-sizing:border-box`,
            `background:${el.styles.background}`,
            `border-radius:${el.styles.borderRadius}px`,
        ].join(';') + ';';

        const textStyle = [
            `color:${el.styles.color ?? '#000000'}`,
            `font-size:${el.styles.fontSize ?? 16}px`,
            `font-weight:${el.styles.fontWeight ?? 400}`,
        ].join(';') + ';';

        if (el.type === 'text') {
            parts.push(
                `<div style="${base}${textStyle}overflow-wrap:break-word;white-space:pre-wrap;">${el.text ?? ''}</div>`
            );
        } else if (el.type === 'img') {
            parts.push(
                `<img src="${el.src ?? ''}" alt="" style="${base}object-fit:cover;" />`
            );
        } else if (el.type === 'button') {
            parts.push(
                `<a href="${el.link ?? '#'}" style="${base}${textStyle}display:flex;align-items:center;justify-content:center;text-decoration:none;text-align:center;">${el.text ?? ''}</a>`
            );
        } else if (el.type === 'divider' || el.type === 'rectangle') {
            parts.push(`<div style="${base}"></div>`);
        }
    }

    const inner = `<div style="width:${canvasWidth}px;min-height:${canvasHeight}px;position:relative;background:#ffffff;margin:0 auto;">\n${parts.join('\n')}\n</div>`;

    return [
        '<!DOCTYPE html>',
        '<html>',
        '<head>',
        '<meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width,initial-scale=1">',
        '<title>Email</title>',
        '</head>',
        '<body style="margin:0;padding:0;">',
        inner,
        '</body>',
        '</html>',
    ].join('\n');
};

const ExportHtml = ({ templateId, templateName }: Props) => {
    const elements = useEditorStore(state => state.elements);
    const canvasHeight = useEditorStore(state => state.canvasHeight);
    const canvasWidth = useEditorStore(state => state.canvasWidth);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        const rendered = generateEmailHTML(elements, canvasWidth, canvasHeight);

        // Копируем в буфер
        try {
            await navigator.clipboard.writeText(rendered);
        } catch { /* ignore clipboard error */ }

        // Сохраняем на бек: html_body = JSON-комментарий + рендеренный HTML
        if (templateId && templateName) {
            try {
                const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(elements))));
                const htmlBody = `${JSON_START}${b64}${JSON_END}\n${rendered}`;
                await apiUpdateTemplate(templateId, { name: templateName, html_body: htmlBody });
                setMsg('Сохранено и скопировано!');
            } catch (e) {
                setMsg(`Скопировано (бек: ${e instanceof Error ? e.message : 'ошибка'})`);
            }
        } else {
            setMsg('Скопировано в буфер');
        }

        setLoading(false);
        setTimeout(() => setMsg(''), 3000);
    };

    return (
        <div className="flex items-center gap-2">
            {msg && <span className="text-sm text-green-600 whitespace-nowrap">{msg}</span>}
            <button
                onClick={handleExport}
                disabled={loading}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
            >
                <Download className="w-4 h-4" />
                {loading ? 'Экспорт...' : 'Экспорт HTML'}
            </button>
        </div>
    );
};

export default ExportHtml;
