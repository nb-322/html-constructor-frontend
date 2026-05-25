import Canvas from '../Canvas/Canvas.tsx';
import PropertiesEditor from '../PropertiesEditor/PropertiesEditor.tsx';
import { useEditorStore } from '../../store/useEditorStore.ts';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Type, Image as ImageIcon, Square, Mail, Trash2 } from 'lucide-react';
import ExportHtml from '../ToolBar/ExportHTML.tsx';

const Editor = () => {
    const add = useEditorStore(s => s.addElement);
    const del = useEditorStore(s => s.removeElement);
    const selectedId = useEditorStore(s => s.selectedId);
    const navigate = useNavigate();

    return (
        <div className="flex h-screen bg-background">
            {/* Left sidebar */}
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

            {/* Center: header + canvas */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Mail className="w-6 h-6 text-primary" />
                        <input
                            type="text"
                            defaultValue="Новый шаблон"
                            className="text-xl font-semibold bg-transparent border-none outline-none text-foreground"
                        />
                    </div>
                    <div className="flex gap-2">
                        <ExportHtml />
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6 bg-background">
                    <Canvas />
                </div>
            </main>

            {/* Right: properties panel */}
            <aside className="w-80 bg-card border-l border-border p-6 overflow-y-auto">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-4">Свойства</h2>
                <PropertiesEditor />
            </aside>
        </div>
    );
};

export default Editor;
