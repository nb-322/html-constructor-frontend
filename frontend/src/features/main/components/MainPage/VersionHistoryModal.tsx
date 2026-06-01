import { useEffect, useState } from 'react';
import { X, RotateCcw, Eye, Clock } from 'lucide-react';
import { apiGetTemplateHistory, apiUpdateTemplate } from '../../../../api/api.ts';
import TemplatePreview from './TemplatePreview.tsx';

interface ChangeLog {
    id: number;
    tpl_id: number;
    old_html: string;
    new_html: string;
    changed_by: number;
    changed_at: string;
}

interface Version {
    html: string;
    label: string;
    date: string | null;
    author: number | null;
    isCurrent: boolean;
}

interface Props {
    templateId: number;
    templateName: string;
    userName: (id?: number) => string;
    onClose: () => void;
    onRestored: () => void;
}

const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }) : '';

export default function VersionHistoryModal({ templateId, templateName, userName, onClose, onRestored }: Props) {
    const [loading, setLoading] = useState(true);
    const [versions, setVersions] = useState<Version[]>([]);
    const [zoom, setZoom] = useState<Version | null>(null);
    const [restoring, setRestoring] = useState<number | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        apiGetTemplateHistory(templateId)
            .then((data) => {
                const logs: ChangeLog[] = (data.history || []).slice().sort(
                    (a: ChangeLog, b: ChangeLog) =>
                        new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime()
                );
                if (logs.length === 0) { setVersions([]); return; }

                // Реконструируем цепочку версий из old→new пар
                const list: Version[] = [];
                list.push({
                    html: logs[0].old_html,
                    label: 'Исходная версия',
                    date: null,
                    author: null,
                    isCurrent: false,
                });
                logs.forEach((log, i) => {
                    list.push({
                        html: log.new_html,
                        label: `Версия ${i + 2}`,
                        date: log.changed_at,
                        author: log.changed_by,
                        isCurrent: i === logs.length - 1,
                    });
                });
                // Новые версии сверху
                setVersions(list.reverse());
            })
            .catch((e) => setError(e instanceof Error ? e.message : 'Ошибка загрузки истории'))
            .finally(() => setLoading(false));
    }, [templateId]);

    const restore = async (v: Version, idx: number) => {
        setRestoring(idx);
        try {
            await apiUpdateTemplate(templateId, { name: templateName, html_body: v.html });
            onRestored();
            onClose();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Ошибка восстановления');
            setRestoring(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-card border border-border rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                            <Clock className="w-5 h-5" />История изменений
                        </h2>
                        <p className="text-sm text-muted-foreground mt-0.5 truncate max-w-md">{templateName}</p>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground bg-transparent p-0">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 -mx-2 px-2">
                    {loading ? (
                        <p className="text-center text-muted-foreground py-12">Загрузка...</p>
                    ) : error ? (
                        <p className="text-center text-destructive py-12">{error}</p>
                    ) : versions.length === 0 ? (
                        <p className="text-center text-muted-foreground py-12">
                            Шаблон ещё не редактировался — версий нет
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {versions.map((v, idx) => (
                                <div
                                    key={idx}
                                    className={`flex gap-4 p-3 rounded-lg border ${
                                        v.isCurrent ? 'border-primary bg-primary/5' : 'border-border bg-background'
                                    }`}
                                >
                                    {/* Превью версии */}
                                    <div
                                        className="w-28 h-36 flex-shrink-0 rounded-md overflow-hidden border border-border cursor-pointer relative group"
                                        onClick={() => setZoom(v)}
                                    >
                                        <TemplatePreview htmlBody={v.html} fallbackClass="bg-gradient-to-br from-slate-200 to-slate-300" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                            <Eye className="w-6 h-6 text-white" />
                                        </div>
                                    </div>

                                    {/* Метаданные */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-foreground">{v.label}</span>
                                                {v.isCurrent && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                                                        текущая
                                                    </span>
                                                )}
                                            </div>
                                            {v.date ? (
                                                <>
                                                    <p className="text-sm text-muted-foreground">Изменил: {userName(v.author ?? undefined)}</p>
                                                    <p className="text-xs text-muted-foreground">{fmt(v.date)}</p>
                                                </>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">Первоначальное состояние шаблона</p>
                                            )}
                                        </div>

                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => setZoom(v)}
                                                className="text-sm px-3 py-1.5 border border-border rounded-lg hover:bg-accent text-card-foreground flex items-center gap-1 bg-transparent"
                                            >
                                                <Eye className="w-4 h-4" />Посмотреть
                                            </button>
                                            {!v.isCurrent && (
                                                <button
                                                    onClick={() => restore(v, idx)}
                                                    disabled={restoring === idx}
                                                    className="text-sm px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-1 disabled:opacity-50"
                                                >
                                                    <RotateCcw className="w-4 h-4" />
                                                    {restoring === idx ? 'Восстановление...' : 'Восстановить'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Увеличенный просмотр версии */}
            {zoom && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]" onClick={() => setZoom(null)}>
                    <div className="bg-card rounded-lg p-4 max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-foreground">{zoom.label}{zoom.isCurrent ? ' (текущая)' : ''}</span>
                            <button onClick={() => setZoom(null)} className="text-muted-foreground hover:text-foreground bg-transparent p-0">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden rounded-md border border-border" style={{ aspectRatio: '3/4', maxHeight: '70vh' }}>
                            <TemplatePreview htmlBody={zoom.html} fallbackClass="bg-gradient-to-br from-slate-200 to-slate-300" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
