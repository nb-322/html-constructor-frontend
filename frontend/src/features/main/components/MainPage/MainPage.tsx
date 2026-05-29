import { Link, useNavigate } from 'react-router-dom';
import { Plus, Settings, User, LogOut, Mail, Eye, FileText, Send, Users, BarChart3, Trash2, X, Shield, MoreVertical, Ban, RotateCcw, Clock, SendHorizonal, History, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import {
    apiGetUserTemplates, apiGetArchivedTemplates,
    apiArchiveTemplate, apiRestoreTemplate, apiSubmitTemplate,
    apiGetTemplateReviews,
} from '../../../../api/api.ts';
import TemplatePreview from './TemplatePreview.tsx';

interface Review {
    id: number;
    tpl_id: number;
    admin_id: number;
    status: string;
    comment: string | null;
    reviewed_at: string;
}

interface Template {
    tpl_id: number;
    name: string;
    status: string;
    updated_at: string;
    html_body?: string;
    deleted?: boolean;
}

const THUMBNAILS = [
    'bg-gradient-to-br from-purple-400 to-pink-400',
    'bg-gradient-to-br from-blue-400 to-cyan-400',
    'bg-gradient-to-br from-green-400 to-emerald-400',
    'bg-gradient-to-br from-orange-400 to-red-400',
    'bg-gradient-to-br from-indigo-400 to-purple-400',
    'bg-gradient-to-br from-yellow-400 to-orange-400',
];

const MainPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [templates, setTemplates] = useState<Template[]>([]);
    const [showDeleted, setShowDeleted] = useState(false);
    const [menuOpen, setMenuOpen] = useState<number | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [revokeModalOpen, setRevokeModalOpen] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyReviews, setHistoryReviews] = useState<Review[]>([]);
    const [historyTemplateName, setHistoryTemplateName] = useState('');

    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
    const showToast = (msg: string, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3000);
    };

    const loadTemplates = async () => {
        setLoading(true);
        try {
            const fn = showDeleted ? apiGetArchivedTemplates : apiGetUserTemplates;
            const data = await fn();
            setTemplates(data.templates || []);
        } catch {
            setTemplates([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadTemplates(); }, [showDeleted]);

    const handleDeleteClick = (id: number) => { setTemplateToDelete(id); setDeleteModalOpen(true); setMenuOpen(null); };
    const handleRevokeClick = (id: number) => { void id; setRevokeModalOpen(true); setMenuOpen(null); };
    const handleSubmit = async (id: number) => {
        setMenuOpen(null);
        try {
            await apiSubmitTemplate(id);
            await loadTemplates();
            showToast('Шаблон отправлен на утверждение');
        } catch (e) {
            showToast(e instanceof Error ? e.message : 'Ошибка при отправке', false);
        }
    };

    const handleHistoryClick = async (id: number, name: string) => {
        setMenuOpen(null);
        setHistoryTemplateName(name);
        setHistoryReviews([]);
        setHistoryModalOpen(true);
        setHistoryLoading(true);
        try {
            const data = await apiGetTemplateReviews(id);
            const sorted = (data.reviews || []).sort((a: Review, b: Review) =>
                new Date(b.reviewed_at).getTime() - new Date(a.reviewed_at).getTime()
            );
            setHistoryReviews(sorted);
        } catch {
            setHistoryReviews([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (templateToDelete == null) return;
        try {
            await apiArchiveTemplate(templateToDelete);
            await loadTemplates();
            showToast('Шаблон удалён');
        } catch (e) {
            showToast(e instanceof Error ? e.message : 'Ошибка удаления', false);
        }
        setDeleteModalOpen(false);
        setTemplateToDelete(null);
    };

    const confirmRevoke = () => { setRevokeModalOpen(false); };

    const restoreTemplate = async (id: number) => {
        try {
            await apiRestoreTemplate(id);
            await loadTemplates();
            showToast('Шаблон восстановлен');
        } catch (e) {
            showToast(e instanceof Error ? e.message : 'Ошибка восстановления', false);
        }
    };

    const getStatusBadge = (status: string) => {
        const map: Record<string, { label: string; cls: string }> = {
            'черновик':        { label: 'Черновик',        cls: 'bg-muted text-muted-foreground' },
            'на утверждении':  { label: 'На утверждении',  cls: 'bg-yellow-100 text-yellow-700' },
            'утверждён':       { label: 'Утверждён',       cls: 'bg-green-100 text-green-700' },
            'отклонён':        { label: 'Отклонён',        cls: 'bg-red-100 text-red-600' },
        };
        const s = map[status] ?? { label: status, cls: 'bg-muted text-muted-foreground' };
        return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.cls}`}>{s.label}</span>;
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'Только что';
        const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
        if (diff === 0) return 'Сегодня';
        if (diff === 1) return 'Вчера';
        return `${diff} дней назад`;
    };

    return (
        <div className="flex h-screen bg-background">
            <aside className="w-64 bg-card border-r border-border flex flex-col">
                <Link to="/templates" className="p-6 border-b border-border flex items-center gap-2">
                    <Mail className="w-8 h-8 text-primary" />
                    <span className="text-xl font-bold">EmailBuilder</span>
                </Link>
                <div className="flex-1 p-4">
                    <nav className="space-y-2">
                        <Link to="/templates" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted text-primary"><FileText className="w-5 h-5" /><span>Шаблоны</span></Link>
                        <Link to="/pending-templates" className="flex items-center gap-3 px-4 py-3 rounded-lg text-card-foreground hover:bg-accent"><Clock className="w-5 h-5" /><span>Шаблоны на утверждении</span></Link>
                        <Link to="/campaigns" className="flex items-center gap-3 px-4 py-3 rounded-lg text-card-foreground hover:bg-accent"><Send className="w-5 h-5" /><span>Кампании</span></Link>
                        <Link to="/clients" className="flex items-center gap-3 px-4 py-3 rounded-lg text-card-foreground hover:bg-accent"><Users className="w-5 h-5" /><span>Клиенты</span></Link>
                        <Link to="/segments" className="flex items-center gap-3 px-4 py-3 rounded-lg text-card-foreground hover:bg-accent"><Tag className="w-5 h-5" /><span>Сегменты</span></Link>
                        <Link to="/reports" className="flex items-center gap-3 px-4 py-3 rounded-lg text-card-foreground hover:bg-accent"><BarChart3 className="w-5 h-5" /><span>Отчеты</span></Link>
                        <Link to="/employees" className="flex items-center gap-3 px-4 py-3 rounded-lg text-card-foreground hover:bg-accent"><Shield className="w-5 h-5" /><span>Сотрудники</span></Link>
                        <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-card-foreground hover:bg-accent"><Settings className="w-5 h-5" /><span>Настройки</span></Link>
                    </nav>
                </div>
                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground"><User className="w-5 h-5" /></div>
                        <div className="flex-1">
                            <p className="font-medium text-sm text-card-foreground truncate">{user?.name || 'Пользователь'}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.role || ''}</p>
                        </div>
                        <button onClick={() => { logout(); navigate('/auth', { replace: true }); }} className="text-muted-foreground hover:text-foreground p-0 bg-transparent"><LogOut className="w-5 h-5" /></button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 overflow-auto">
                <div className="max-w-6xl mx-auto p-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">Шаблоны</h1>
                            <p className="text-muted-foreground">Создавайте и управляйте своими email-шаблонами</p>
                        </div>
                        <button
                            onClick={() => setShowDeleted(!showDeleted)}
                            className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground flex items-center gap-2 bg-transparent"
                        >
                            <Trash2 className="w-4 h-4" />
                            {showDeleted ? 'Показать активные' : 'Показать удаленные'}
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-muted-foreground">Загрузка...</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {!showDeleted && (
                                <Link
                                    to="/editor"
                                    className="aspect-[3/4] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-muted/50 transition group"
                                >
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center group-hover:bg-accent transition">
                                        <Plus className="w-8 h-8 text-primary" />
                                    </div>
                                    <span className="text-muted-foreground group-hover:text-primary font-medium">Создать новый шаблон</span>
                                </Link>
                            )}

                            {templates.map((template, index) => (
                                <div
                                    key={template.tpl_id}
                                    className="aspect-[3/4] bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group relative"
                                >
                                    <div className={`h-2/3 relative overflow-hidden`}>
                                        <TemplatePreview
                                            htmlBody={template.html_body || ''}
                                            fallbackClass={THUMBNAILS[index % THUMBNAILS.length]}
                                        />
                                        {!showDeleted && (
                                            <>
                                                <div className="absolute inset-0 bg-card/10 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                    <Link
                                                        to={`/editor/${template.tpl_id}`}
                                                        className="px-4 py-2 bg-card rounded-lg shadow-lg flex items-center gap-2 hover:bg-background text-foreground"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        <span className="text-sm font-medium">Открыть</span>
                                                    </Link>
                                                </div>
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); setMenuOpen(menuOpen === template.tpl_id ? null : template.tpl_id); }}
                                                        className="p-2 bg-card rounded-lg shadow-lg hover:bg-background"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                    {menuOpen === template.tpl_id && (
                                                        <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-lg shadow-lg z-10">
                                                            <button
                                                                onClick={() => handleSubmit(template.tpl_id)}
                                                                className="w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-2 text-card-foreground bg-transparent"
                                                            >
                                                                <SendHorizonal className="w-4 h-4" />На утверждение
                                                            </button>
                                                            <button
                                                                onClick={() => handleHistoryClick(template.tpl_id, template.name)}
                                                                className="w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-2 text-card-foreground border-t border-border bg-transparent"
                                                            >
                                                                <History className="w-4 h-4" />История
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(template.tpl_id)}
                                                                className="w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-2 text-card-foreground border-t border-border bg-transparent"
                                                            >
                                                                <Trash2 className="w-4 h-4" />Удалить
                                                            </button>
                                                            <button
                                                                onClick={() => handleRevokeClick(template.tpl_id)}
                                                                className="w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-2 text-card-foreground border-t border-border bg-transparent"
                                                            >
                                                                <Ban className="w-4 h-4" />Отозвать
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="h-1/3 p-4 flex flex-col justify-between">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-foreground truncate mr-2">{template.name}</h3>
                                            {showDeleted ? (
                                                <button onClick={() => restoreTemplate(template.tpl_id)} className="text-primary hover:opacity-80 bg-transparent p-0">
                                                    <RotateCcw className="w-4 h-4" />
                                                </button>
                                            ) : getStatusBadge(template.status)}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Изменено {formatDate(template.updated_at)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteModalOpen(false)}>
                    <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-foreground">Подтверждение удаления</h2>
                            <button onClick={() => setDeleteModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-transparent p-0"><X className="w-5 h-5" /></button>
                        </div>
                        <p className="text-muted-foreground mb-6">Вы точно хотите удалить шаблон?</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground bg-transparent">Отмена</button>
                            <button onClick={confirmDelete} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition">Удалить</button>
                        </div>
                    </div>
                </div>
            )}

            {revokeModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setRevokeModalOpen(false)}>
                    <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-foreground">Подтверждение отзыва</h2>
                            <button onClick={() => setRevokeModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-transparent p-0"><X className="w-5 h-5" /></button>
                        </div>
                        <p className="text-muted-foreground mb-6">Вы точно хотите отозвать шаблон?</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setRevokeModalOpen(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground bg-transparent">Отмена</button>
                            <button onClick={confirmRevoke} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">Отозвать</button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${toast.ok ? 'bg-green-600 text-white' : 'bg-destructive text-destructive-foreground'}`}>
                    {toast.msg}
                </div>
            )}

            {historyModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setHistoryModalOpen(false)}>
                    <div className="bg-card border border-border rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">История решений</h2>
                                <p className="text-sm text-muted-foreground mt-0.5 truncate max-w-xs">{historyTemplateName}</p>
                            </div>
                            <button onClick={() => setHistoryModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-transparent p-0"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="overflow-y-auto flex-1">
                            {historyLoading ? (
                                <p className="text-center text-muted-foreground py-8">Загрузка...</p>
                            ) : historyReviews.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">История решений пуста</p>
                            ) : (
                                <div className="space-y-3">
                                    {historyReviews.map((r) => {
                                        const statusMap: Record<string, { label: string; cls: string }> = {
                                            'одобрено':  { label: 'Одобрено',  cls: 'bg-green-100 text-green-700' },
                                            'отклонено': { label: 'Отклонено', cls: 'bg-red-100 text-red-600' },
                                        };
                                        const s = statusMap[r.status] ?? { label: r.status, cls: 'bg-muted text-muted-foreground' };
                                        const date = new Date(r.reviewed_at).toLocaleString('ru-RU', {
                                            day: '2-digit', month: '2-digit', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit',
                                        });
                                        return (
                                            <div key={r.id} className="flex gap-4 p-4 rounded-lg border border-border bg-background">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.cls}`}>{s.label}</span>
                                                        <span className="text-xs text-muted-foreground">{date}</span>
                                                    </div>
                                                    {r.comment && (
                                                        <p className="text-sm text-foreground mt-1 break-words">💬 {r.comment}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainPage;
