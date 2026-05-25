import { useEditorStore } from '../../store/useEditorStore.ts';
import { Download } from 'lucide-react';

const ExportHtml = () => {
    const elements = useEditorStore(state => state.elements);
    const canvasHeight = useEditorStore(state => state.canvasHeight);
    const canvasWidth = useEditorStore(state => state.canvasWidth);

    const exportHTML = () => {
        const s: string[] = [];

        elements.forEach(element => {
            const baseStyle = `position:absolute;left:${element.x}px;top:${element.y}px;width:${element.width}px;height:${element.height}px;background:${element.styles.background};border-radius:${element.styles.borderRadius};box-sizing:border-box;`;

            if (element.type === 'text') {
                s.push(`<div style="${baseStyle}color:${element.styles.color};font-size:${element.styles.fontSize};font-weight:${element.styles.fontWeight};overflow-wrap:break-word;">${element.text}</div>`);
            }

            if (element.type === 'img') {
                s.push(`<img src="${element.src}" style="${baseStyle}" />`);
            }
        });

        const html = `<div style="width:${canvasWidth}px;height:${canvasHeight}px;border:1px solid black;margin:5px;position:relative;box-sizing:border-box;">${s.join('')}</div>`;
        navigator.clipboard.writeText(html);
    };

    return (
        <button
            onClick={exportHTML}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-2"
        >
            <Download className="w-4 h-4" />
            Экспорт HTML
        </button>
    );
};

export default ExportHtml;
