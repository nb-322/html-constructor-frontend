import { Link, useNavigate } from 'react-router-dom';
import { Plus, Mail, User, LogOut, Settings, FileText, Users, BarChart3, Send, Clock, CheckCircle, X, Eye, MousePointerClick, Shield, Trash2, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Campaign {
    id: string;
    name: string;
    status: 'draft' | 'scheduled' | 'sent';
    recipients: number;
    segment: string;
    sentDate?: string;
    deleted?: boolean;
}

export default function CampaignsPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [campaigns, setCampaigns] = useState<Campaign[]>([
        { id: '1', name: 'Летняя распродажа 2026', status: 'sent', recipients: 1250, segment: 'Активные клиенты', sentDate: '20 апр 2026' },
        { id: '2', name: 'Новинки недели', status: 'scheduled', recipients: 980, segment: 'Все клиенты', sentDate: '28 апр 2026' },
        { id: '3', name: 'Приветственная серия', status: 'draft', recipients: 0, segment: 'Новые подписчики' },
    ]);

    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
    const [newCampaign, setNewCampaign] = useState({ name: '', segment: '', template: '', date: '' });
    const [showDeleted, setShowDeleted] = useState(false);

    const handleDetails = (campaign: Campaign) => { setSelectedCampaign(campaign); setDetailsModalOpen(true); };
    const handleDeleteClick = (id: string) => { setCampaignToDelete(id); setDeleteModalOpen(true); };

    const confirmDelete = () => {
        if (campaignToDelete) {
            setCampaigns(campaigns.map(c => c.id === campaignToDelete ? { ...c, deleted: true } : c));
            setDeleteModalOpen(false);
            setCampaignToDelete(null);
        }
    };

    const restoreCampaign = (id: string) => setCampaigns(campaigns.map(c => c.id === id ? { ...c, deleted: false } : c));
    const activeCampaigns = campaigns.filter(c => !c.deleted);
    const deletedCampaigns = campaigns.filter(c => c.deleted);

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
                            <p className="text-xs text-muted-foreground truncate">{user?.email || user?.role || ''}</p>
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
                                <Plus className="w-5 h-5" />Создать кампанию
                            </button>
                        </div>
                    </div>

                    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-background border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Название</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Статус</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Сегмент</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Получатели</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Дата отправки</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {(showDeleted ? deletedCampaigns : activeCampaigns).map((campaign) => (
                                        <tr key={campaign.id} className="hover:bg-background">
                                            <td className="px-6 py-4"><p className="font-medium text-foreground">{campaign.name}</p></td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${campaign.status === 'sent' ? 'bg-muted text-primary' : campaign.status === 'scheduled' ? 'bg-accent text-card-foreground' : 'bg-secondary/70 text-secondary-foreground border border-border'}`}>
                                                    {campaign.status === 'sent' && <CheckCircle className="w-3 h-3" />}
                                                    {campaign.status === 'scheduled' && <Clock className="w-3 h-3" />}
                                                    {campaign.status === 'sent' ? 'Отправлена' : campaign.status === 'scheduled' ? 'Запланирована' : 'Черновик'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">{campaign.segment}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{campaign.recipients.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{campaign.sentDate || '—'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {!showDeleted ? (
                                                        <>
                                                            <button onClick={() => handleDetails(campaign)} className="text-primary hover:opacity-80 text-sm font-medium bg-transparent p-0">Подробнее</button>
                                                            <button onClick={() => handleDeleteClick(campaign.id)} className="text-destructive hover:opacity-80 text-sm font-medium bg-transparent p-0">Удалить</button>
                                                        </>
                                                    ) : (
                                                        <button onClick={() => restoreCampaign(campaign.id)} className="text-primary hover:opacity-80 text-sm font-medium flex items-center gap-1 bg-transparent p-0">
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
                </div>
            </main>

            {createModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setCreateModalOpen(false)}>
                    <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-foreground">Создать кампанию</h2>
                            <button onClick={() => setCreateModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-transparent p-0"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-card-foreground mb-2">Название кампании</label>
                                <input type="text" value={newCampaign.name} onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })} placeholder="Летняя распродажа" className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-card-foreground mb-2">Шаблон</label>
                                <select value={newCampaign.template} onChange={(e) => setNewCampaign({ ...newCampaign, template: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none">
                                    <option value="">Выберите шаблон</option>
                                    <option value="1">Новостная рассылка</option>
                                    <option value="2">Промо акция</option>
                                    <option value="3">Приветственное письмо</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-card-foreground mb-2">Сегмент</label>
                                <select value={newCampaign.segment} onChange={(e) => setNewCampaign({ ...newCampaign, segment: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none">
                                    <option value="">Выберите сегмент</option>
                                    <option value="all">Все клиенты</option>
                                    <option value="active">Активные клиенты</option>
                                    <option value="new">Новые подписчики</option>
                                    <option value="vip">VIP клиенты</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-card-foreground mb-2">Дата и время отправки</label>
                                <input type="datetime-local" value={newCampaign.date} onChange={(e) => setNewCampaign({ ...newCampaign, date: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end mt-6">
                            <button onClick={() => setCreateModalOpen(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground bg-transparent">Отмена</button>
                            <button onClick={() => { setCreateModalOpen(false); setNewCampaign({ name: '', segment: '', template: '', date: '' }); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">Создать</button>
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
                        <p className="text-muted-foreground mb-6">Вы точно хотите удалить эту кампанию?</p>
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
                            <h2 className="text-2xl font-semibold text-foreground">{selectedCampaign.name}</h2>
                            <button onClick={() => setDetailsModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-transparent p-0"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${selectedCampaign.status === 'sent' ? 'bg-muted text-primary' : selectedCampaign.status === 'scheduled' ? 'bg-accent text-card-foreground' : 'bg-gray-100 text-card-foreground'}`}>
                                        {selectedCampaign.status === 'sent' && <CheckCircle className="w-3 h-3" />}
                                        {selectedCampaign.status === 'scheduled' && <Clock className="w-3 h-3" />}
                                        {selectedCampaign.status === 'sent' ? 'Отправлена' : selectedCampaign.status === 'scheduled' ? 'Запланирована' : 'Черновик'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-background p-4 rounded-lg"><p className="text-sm text-muted-foreground mb-1">Сегмент</p><p className="text-xl font-bold text-foreground">{selectedCampaign.segment}</p></div>
                                    <div className="bg-background p-4 rounded-lg"><p className="text-sm text-muted-foreground mb-1">Получатели</p><p className="text-xl font-bold text-foreground">{selectedCampaign.recipients.toLocaleString()}</p></div>
                                    <div className="bg-background p-4 rounded-lg"><p className="text-sm text-muted-foreground mb-1">Дата отправки</p><p className="text-xl font-bold text-foreground">{selectedCampaign.sentDate || '—'}</p></div>
                                </div>
                            </div>
                            {selectedCampaign.status === 'sent' && (
                                <div className="border-t border-border pt-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Статистика</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-background p-4 rounded-lg"><div className="flex items-center gap-2 mb-2"><Eye className="w-4 h-4 text-primary" /><p className="text-sm text-muted-foreground">Open Rate</p></div><p className="text-2xl font-bold text-foreground">24.5%</p><p className="text-xs text-muted-foreground mt-1">306 открытий</p></div>
                                        <div className="bg-background p-4 rounded-lg"><div className="flex items-center gap-2 mb-2"><MousePointerClick className="w-4 h-4 text-primary" /><p className="text-sm text-muted-foreground">Click Rate</p></div><p className="text-2xl font-bold text-foreground">3.2%</p><p className="text-xs text-muted-foreground mt-1">40 кликов</p></div>
                                        <div className="bg-background p-4 rounded-lg"><div className="flex items-center gap-2 mb-2"><Send className="w-4 h-4 text-primary" /><p className="text-sm text-muted-foreground">Доставлено</p></div><p className="text-2xl font-bold text-foreground">98.4%</p><p className="text-xs text-muted-foreground mt-1">1230 писем</p></div>
                                    </div>
                                </div>
                            )}
                            {selectedCampaign.status === 'scheduled' && (
                                <div className="border-t border-border pt-6">
                                    <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                                        <p className="text-sm text-card-foreground">
                                            <span className="font-medium">Запланировано:</span> Рассылка будет отправлена {selectedCampaign.sentDate} в 10:00
                                        </p>
                                    </div>
                                </div>
                            )}
                            {selectedCampaign.status === 'draft' && (
                                <div className="border-t border-border pt-6">
                                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                                        <p className="text-sm text-card-foreground">
                                            <span className="font-medium">Черновик:</span> Завершите настройку кампании перед отправкой
                                        </p>
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
