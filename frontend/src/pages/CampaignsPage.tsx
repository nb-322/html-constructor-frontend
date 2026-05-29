import { Link, useNavigate } from 'react-router-dom';
import { Plus, Mail, User, LogOut, Settings, FileText, Users, BarChart3, Send, Clock, CheckCircle, X, Eye, MousePointerClick, Shield, Trash2, RotateCcw, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    apiGetCampaigns, apiGetArchivedCampaigns,
    apiCreateCampaign, apiArchiveCampaign, apiRestoreCampaign,
    apiGetSegments, apiGetUserTemplates,
} from '../api/api.ts';

interface Campaign {
    camp_id: number;
    status: string;
    segment: string;
    tpl_id: number;
    scheduled_at: string;
    created_at: string;
}

interface Segment { name: string; }
interface Template { tpl_id: number; name: string; }

export default function CampaignsPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [segments, setSegments] = useState<Segment[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [showDeleted, setShowDeleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [campaignToDelete, setCampaignToDelete] = useState<number | null>(null);
    const [newCampaign, setNewCampaign] = useState({ name: '', segment: '', tpl_id: '', date: '' });

    const load = async () => {
        setLoading(true);
        try {
            const fn = showDeleted ? apiGetArchivedCampaigns : apiGetCampaigns;
            const data = await fn();
            setCampaigns(data.campaigns || []);
        } catch { setCampaigns([]); }
        setLoading(false);
    };

    useEffect(() => { load(); }, [showDeleted]);

    useEffect(() => {
        apiGetSegments().then(d => setSegments(d.segments || [])).catch(() => {});
        apiGetUserTemplates().then(d => setTemplates(d.templates || [])).catch(() => {});
    }, []);

    const handleDetails = (c: Campaign) => { setSelectedCampaign(c); setDetailsModalOpen(true); };
    const handleDeleteClick = (id: number) => { setCampaignToDelete(id); setDeleteModalOpen(true); };

    const confirmDelete = async () => {
        if (campaignToDelete == null) return;
        try { await apiArchiveCampaign(campaignToDelete); await load(); } catch { /* ignore */ }
        setDeleteModalOpen(false);
        setCampaignToDelete(null);
    };

    const restoreCampaign = async (id: number) => {
        try { await apiRestoreCampaign(id); await load(); } catch { /* ignore */ }
    };

    const handleCreate = async () => {
        try {
            await apiCreateCampaign({
                segment: newCampaign.segment,
                tpl_id: Number(newCampaign.tpl_id),
                scheduled_at: newCampaign.date || new Date().toISOString(),
            });
            setCreateModalOpen(false);
            setNewCampaign({ name: '', segment: '', tpl_id: '', date: '' });
            await load();
        } catch { /* ignore */ }
    };

    const formatDate = (d: string) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const statusLabel = (s: string) => ({ sent: 'Отправлена', scheduled: 'Запланирована', draft: 'Черновик' }[s] || s);
    const statusClass = (s: string) => s === 'sent' ? 'bg-muted text-primary' : s === 'scheduled' ? 'bg-accent text-card-foreground' : 'bg-secondary/70 text-secondary-foreground border border-border';

    return (
        <div className="flex h-screen bg-background">
            <aside className="w-64 bg-card border-r border-border flex flex-col">
                <Link to="/templates" className="p-6 border-b border-border flex items-center gap-2">
                    <Mail className="w-8 h-8 text-primary" /><span className="text-xl font-bold">EmailBuilder</span>
                </Link>
                <div className="flex-1 p-4">
                    <nav className="space-y-2">
                        <Link to="/templates" className="flex items-center gap-3 px-4 py-3 rounded-lg text-card-foreground hover:bg-accent"><FileText className="w-5 h-5" /><span>Шаблоны</span></Link>
                        <Link to="/pending-templates" className="flex items-center gap-3 px-4 py-3 rounded-lg text-card-foreground hover:bg-accent"><Clock className="w-5 h-5" /><span>Шаблоны на утверждении</span></Link>
                        <Link to="/campaigns" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted text-primary"><Send className="w-5 h-5" /><span>Кампании</span></Link>
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
                            <h1 className="text-3xl font-bold text-foreground mb-2">Кампании</h1>
                            <p className="text-muted-foreground">Управляйте своими email-кампаниями</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleted(!showDeleted)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground flex items-center gap-2 bg-transparent">
                                <Trash2 className="w-4 h-4" />{showDeleted ? 'Показать активные' : 'Показать удаленные'}
                            </button>
                            <button onClick={() => setCreateModalOpen(true)} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-2">
                                <Plus className="w-5 h-5" />Создать компанию
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-muted-foreground">Загрузка...</div>
                    ) : (
                        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-background border-b border-border">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">ID</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Статус</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Сегмент</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Шаблон</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Дата отправки</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {campaigns.map((campaign) => (
                                            <tr key={campaign.camp_id} className="hover:bg-background">
                                                <td className="px-6 py-4"><p className="font-medium text-foreground">#{campaign.camp_id}</p></td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusClass(campaign.status)}`}>
                                                        {campaign.status === 'sent' && <CheckCircle className="w-3 h-3" />}
                                                        {campaign.status === 'scheduled' && <Clock className="w-3 h-3" />}
                                                        {statusLabel(campaign.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">{campaign.segment}</td>
                                                <td className="px-6 py-4 text-muted-foreground">#{campaign.tpl_id}</td>
                                                <td className="px-6 py-4 text-muted-foreground">{formatDate(campaign.scheduled_at)}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        {!showDeleted ? (
                                                            <>
                                                                <button onClick={() => handleDetails(campaign)} className="text-primary hover:opacity-80 text-sm font-medium bg-transparent p-0">Подробнее</button>
                                                                <button onClick={() => handleDeleteClick(campaign.camp_id)} className="text-destructive hover:opacity-80 text-sm font-medium bg-transparent p-0">Удалить</button>
                                                            </>
                                                        ) : (
                                                            <button onClick={() => restoreCampaign(campaign.camp_id)} className="text-primary hover:opacity-80 text-sm font-medium flex items-center gap-1 bg-transparent p-0">
                                                                <RotateCcw className="w-3 h-3" />Восстановить
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {createModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setCreateModalOpen(false)}>
                    <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-foreground">Создать компанию</h2>
                            <button onClick={() => setCreateModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-transparent p-0"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-card-foreground mb-2">Шаблон</label>
                                <select value={newCampaign.tpl_id} onChange={(e) => setNewCampaign({ ...newCampaign, tpl_id: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none">
                                    <option value="">Выберите шаблон</option>
                                    {templates.map(t => <option key={t.tpl_id} value={t.tpl_id}>{t.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-card-foreground mb-2">Сегмент</label>
                                <select value={newCampaign.segment} onChange={(e) => setNewCampaign({ ...newCampaign, segment: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none">
                                    <option value="">Выберите сегмент</option>
                                    {segments.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-card-foreground mb-2">Дата и время отправки</label>
                                <input type="datetime-local" value={newCampaign.date} onChange={(e) => setNewCampaign({ ...newCampaign, date: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end mt-6">
                            <button onClick={() => setCreateModalOpen(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground bg-transparent">Отмена</button>
                            <button onClick={handleCreate} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">Создать</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteModalOpen(false)}>
                    <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-foreground">Подтверждение удаления</h2>
                            <button onClick={() => setDeleteModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-transparent p-0"><X className="w-5 h-5" /></button>
                        </div>
                        <p className="text-muted-foreground mb-6">Вы точно хотите удалить эту компанию?</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground bg-transparent">Отмена</button>
                            <button onClick={confirmDelete} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition">Удалить</button>
                        </div>
                    </div>
                </div>
            )}

            {detailsModalOpen && selectedCampaign && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDetailsModalOpen(false)}>
                    <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-foreground">Кампания #{selectedCampaign.camp_id}</h2>
                            <button onClick={() => setDetailsModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-transparent p-0"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusClass(selectedCampaign.status)}`}>
                                        {selectedCampaign.status === 'sent' && <CheckCircle className="w-3 h-3" />}
                                        {selectedCampaign.status === 'scheduled' && <Clock className="w-3 h-3" />}
                                        {statusLabel(selectedCampaign.status)}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-background p-4 rounded-lg"><p className="text-sm text-muted-foreground mb-1">Сегмент</p><p className="text-xl font-bold text-foreground">{selectedCampaign.segment}</p></div>
                                    <div className="bg-background p-4 rounded-lg"><p className="text-sm text-muted-foreground mb-1">Шаблон</p><p className="text-xl font-bold text-foreground">#{selectedCampaign.tpl_id}</p></div>
                                    <div className="bg-background p-4 rounded-lg"><p className="text-sm text-muted-foreground mb-1">Дата отправки</p><p className="text-xl font-bold text-foreground">{formatDate(selectedCampaign.scheduled_at)}</p></div>
                                </div>
                            </div>
                            {selectedCampaign.status === 'sent' && (
                                <div className="border-t border-border pt-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Статистика</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-background p-4 rounded-lg"><div className="flex items-center gap-2 mb-2"><Eye className="w-4 h-4 text-primary" /><p className="text-sm text-muted-foreground">Open Rate</p></div><p className="text-2xl font-bold text-foreground">—</p></div>
                                        <div className="bg-background p-4 rounded-lg"><div className="flex items-center gap-2 mb-2"><MousePointerClick className="w-4 h-4 text-primary" /><p className="text-sm text-muted-foreground">Click Rate</p></div><p className="text-2xl font-bold text-foreground">—</p></div>
                                        <div className="bg-background p-4 rounded-lg"><div className="flex items-center gap-2 mb-2"><Send className="w-4 h-4 text-primary" /><p className="text-sm text-muted-foreground">Доставлено</p></div><p className="text-2xl font-bold text-foreground">—</p></div>
                                    </div>
                                </div>
                            )}
                            {selectedCampaign.status === 'scheduled' && (
                                <div className="border-t border-border pt-6">
                                    <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                                        <p className="text-sm text-card-foreground"><span className="font-medium">Запланировано:</span> Рассылка будет отправлена {formatDate(selectedCampaign.scheduled_at)} в 10:00</p>
                                    </div>
                                </div>
                            )}
                            {selectedCampaign.status === 'draft' && (
                                <div className="border-t border-border pt-6">
                                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                                        <p className="text-sm text-card-foreground"><span className="font-medium">Черновик:</span> Завершите настройку кампании перед отправкой</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-border">
                            <button onClick={() => setDetailsModalOpen(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground bg-transparent">Закрыть</button>
                            {selectedCampaign.status === 'draft' && (
                                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">Продолжить редактирование</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
