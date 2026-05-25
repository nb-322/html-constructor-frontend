import Canvas from '../Canvas/Canvas.tsx';
import PropertiesEditor from '../PropertiesEditor/PropertiesEditor.tsx';
import { useEditorStore } from '../../store/useEditorStore.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Type, Image as ImageIcon, Square, Mail, Trash2, Save } from 'lucide-react';
import ExportHtml from '../ToolBar/ExportHTML.tsx';
import { useState, useEffect } from 'react';
import { apiGetTemplate, apiCreateTemplate, apiUpdateTemplate } from '../../../../api/api.ts';

const Editor = () => {
    const add = useEditorStore(s => s.addElement);
    const del = useEditorStore(s => s.removeElement);
    const selectedId = useEditorStore(s => s.selectedId);
    const elements = useEditorStore(s => s.elements);
    const clearElements = useEditorStore(s => s.clearElements);
    const loadElements = useEditorStore(s => s.loadElements);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [name, setName] = useState('Новый шаблон');
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');

    useEffect(() => {
        clearElements();
        if (!id) return;
        apiGetTemplate(Number(id)).then((data) => {
            if (data.name) setName(data.name);
            if (data.html_body) {
                try {
                    const parsed = JSON.parse(data.html_body);
                    if (Array.isArray(parsed)) loadElements(parsed);
                } catch { /* html_body is raw HTML, can't restore elements */ }
            }
        }).catch(() => {});
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        setSaveMsg('');
        try {
            const html_body = JSON.stringify(elements);
            if (id) {
                await apiUpdateTemplate(Number(id), { name, html_body });
            } else {
                await apiCreateTemplate({ name, html_body });
            }
            setSaveMsg('Сохранено');
            setTimeout(() => setSaveMsg(''), 2000);
        } catch {
            setSaveMsg('Ошибка сохранения');
            setTimeout(() => setSaveMsg(''), 3000);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex h-screen bg-background">
            <aside className="w-64 bg-card border-r border-border flex flex-col">
                <div className="p-4 border-b border-border">
                    <button
                        onClick={() => navigate('/templates', { replace: true })}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground bg-transparent p-0"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Назад к шаблонам</span>
                    </button>
                </div>

                <div className="p-4 flex-1">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-4">Элементы</h2>
                    <div className="space-y-2">
                        <button
                            onClick={() => add('text')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:bg-accent transition bg-transparent text-card-foreground"
                        >
                            <Type className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm">Текст</span>
                        </button>
                        <button
                            onClick={() => add('img')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:bg-accent transition bg-transparent text-card-foreground"
                        >
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm">Изображение</span>
                        </button>
                        <button
                            onClick={() => add('button')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:bg-accent transition bg-transparent text-card-foreground"
                        >
                            <Square className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm">Кнопка</span>
                        </button>

                        {selectedId && (
                            <button
                                onClick={() => del(selectedId)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-destructive/40 hover:bg-destructive/10 transition bg-transparent text-destructive"
                            >
                                <Trash2 className="w-5 h-5" />
                                <span className="text-sm">Удалить выбранный</span>
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Mail className="w-6 h-6 text-primary" />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="text-xl font-semibold bg-transparent border-none outline-none text-foreground"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        {saveMsg && (
                            <span className={`text-sm ${saveMsg === 'Сохранено' ? 'text-green-600' : 'text-destructive'}`}>
                                {saveMsg}
                            </span>
                        )}
                        <ExportHtml />
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Сохранение...' : 'Сохранить'}
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6 bg-background">
                    <Canvas />
                </div>
            </main>

            <aside className="w-80 bg-card border-l border-border p-6 overflow-y-auto">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-4">Свойства</h2>
                <PropertiesEditor />
            </aside>
        </div>
    );
};

export default Editor;
