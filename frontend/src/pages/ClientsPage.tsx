import { Link, useNavigate } from 'react-router-dom';
import { Upload, Mail, User, LogOut, Settings, FileText, Users, BarChart3, Send, Search, X, UserPlus, Shield, Clock, Trash2, RotateCcw, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    apiGetClients, apiGetArchivedClients,
    apiCreateClient, apiUpdateClient, apiArchiveClient, apiRestoreClient,
    apiGetSegments,
} from '../api/api.ts';

interface Client {
    client_id: number;
    email: string;
    segment: string;
    consent_flag: boolean;
    created_at: string;
    updated_at: string;
}

interface Segment { name: string; }

export default function ClientsPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [clients, setClients] = useState<Client[]>([]);
    const [segments, setSegments] = useState<Segment[]>([]);
    const [showDeleted, setShowDeleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [clientToDelete, setClientToDelete] = useState<number | null>(null);
    const [formData, setFormData] = useState({ email: '', consent_flag: true, segment: '' });

    const load = async () => {
        setLoading(true);
        try {
            const fn = showDeleted ? apiGetArchivedClients : apiGetClients;
            const data = await fn();
            setClients(data.clients || []);
        } catch { setClients([]); }
        setLoading(false);
    };

    useEffect(() => { load(); }, [showDeleted]);
    useEffect(() => { apiGetSegments().then(d => setSegments(d.segments || [])).catch(() => {}); }, []);

    const handleEdit = (c: Client) => {
        setEditingClient(c);
        setFormData({ email: c.email, consent_flag: c.consent_flag, segment: c.segment });
        setEditModalOpen(true);
    };

    const saveClient = async () => {
        if (!editingClient) return;
        try { await apiUpdateClient(editingClient.client_id, formData); await load(); } catch { /* ignore */ }
        setEditModalOpen(false);
        setEditingClient(null);
        setFormData({ email: '', consent_flag: true, segment: '' });
    };

    const addClient = async () => {
        try { await apiCreateClient(formData); await load(); } catch { /* ignore */ }
        setAddModalOpen(false);
        setFormData({ email: '', consent_flag: true, segment: '' });
    };

    const handleDeleteClick = (id: number) => { setClientToDelete(id); setDeleteModalOpen(true); };

    const confirmDelete = async () => {
        if (clientToDelete == null) return;
        try { await apiArchiveClient(clientToDelete); await load(); } catch { /* ignore */ }
        setDeleteModalOpen(false);
        setClientToDelete(null);
    };

    const restoreClient = async (id: number) => {
        try { await apiRestoreClient(id); await load(); } catch { /* ignore */ }
    };

    const formatDate = (d: string) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const filtered = clients.filter(c => c.email.toLowerCase().includes(search.toLowerCase()) || c.segment.toLowerCase().includes(search.toLowerCase()));

    const clientFormJSX = (
        <div className="space-y-4">
            <div><label className="block text-sm font-medium text-card-foreground mb-2">Email</label><input type="text" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="ivan@example.com" className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none" /></div>
            <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Сегмент</label>
                <select value={formData.segment} onChange={(e) => setFormData({ ...formData, segment: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none">
                    <option value="">Выберите сегмент</option>
                    {segments.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Согласие на рассылку</label>
                <select value={formData.consent_flag ? 'true' : 'false'} onChange={(e) => setFormData({ ...formData, consent_flag: e.target.value === 'true' })} className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none">
                    <option value="true">Активен</option>
                    <option value="false">Отписался</option>
                </select>
            </div>
        </div>
    );

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
                        <Link to="/campaigns" className="flex items-center gap-3 px-4 py-3 rounded-lg text-card-foreground hover:bg-accent"><Send className="w-5 h-5" /><span>Кампании</span></Link>
                        <Link to="/clients" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted text-primary"><Users className="w-5 h-5" /><span>Клиенты</span></Link>
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
                            <h1 className="text-3xl font-bold text-foreground mb-2">Клиенты</h1>
                            <p className="text-muted-foreground">Управляйте своей базой подписчиков</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleted(!showDeleted)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground flex items-center gap-2 bg-transparent"><Trash2 className="w-4 h-4" />{showDeleted ? 'Показать активные' : 'Показать удаленные'}</button>
                            <button onClick={() => setImportModalOpen(true)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground flex items-center gap-2 bg-transparent"><Upload className="w-4 h-4" />Импорт CSV</button>
                            <button onClick={() => { setFormData({ email: '', consent_flag: true, segment: '' }); setAddModalOpen(true); }} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-2"><UserPlus className="w-5 h-5" />Добавить клиента</button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input type="text" placeholder="Поиск клиентов..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none" />
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
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Статус</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Сегмент</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Дата добавления</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {filtered.map((client) => (
                                            <tr key={client.client_id} className="hover:bg-background">
                                                <td className="px-6 py-4"><p className="font-medium text-foreground">{client.email}</p></td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${client.consent_flag ? 'bg-muted text-primary' : 'bg-destructive/10 text-destructive'}`}>
                                                        {client.consent_flag ? 'Активен' : 'Отписался'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">{client.segment}</td>
                                                <td className="px-6 py-4 text-muted-foreground">{formatDate(client.created_at)}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        {!showDeleted ? (
                                                            <>
                                                                <button onClick={() => handleEdit(client)} className="text-primary hover:opacity-80 text-sm font-medium bg-transparent p-0">Редактировать</button>
                                                                <button onClick={() => handleDeleteClick(client.client_id)} className="text-destructive hover:opacity-80 text-sm font-medium bg-transparent p-0">Удалить</button>
                                                            </>
                                                        ) : (
                                                            <button onClick={() => restoreClient(client.client_id)} className="text-primary hover:opacity-80 text-sm font-medium flex items-center gap-1 bg-transparent p-0"><RotateCcw className="w-3 h-3" />Восстановить</button>
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

            {editModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditModalOpen(false)}>
                    <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold text-foreground">Редактировать клиента</h2><button onClick={() => setEditModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-transparent p-0"><X className="w-5 h-5" /></button></div>
                        {clientFormJSX}
                        <div className="flex gap-3 justify-end mt-6">
                            <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground bg-transparent">Отмена</button>
                            <button onClick={saveClient} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">Сохранить</button>
                        </div>
                    </div>
                </div>
            )}

            {addModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setAddModalOpen(false)}>
                    <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold text-foreground">Добавить клиента</h2><button onClick={() => setAddModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-transparent p-0"><X className="w-5 h-5" /></button></div>
                        {clientFormJSX}
                        <div className="flex gap-3 justify-end mt-6">
                            <button onClick={() => setAddModalOpen(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground bg-transparent">Отмена</button>
                            <button onClick={addClient} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">Добавить</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteModalOpen(false)}>
                    <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold text-foreground">Подтверждение удаления</h2><button onClick={() => setDeleteModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-transparent p-0"><X className="w-5 h-5" /></button></div>
                        <p className="text-muted-foreground mb-6">Вы точно хотите удалить этого клиента?</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground bg-transparent">Отмена</button>
                            <button onClick={confirmDelete} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition">Удалить</button>
                        </div>
                    </div>
                </div>
            )}

            {importModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setImportModalOpen(false)}>
                    <div className="bg-card border border-border rounded-lg p-6 max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold text-foreground">Импорт клиентов</h2><button onClick={() => setImportModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-transparent p-0"><X className="w-5 h-5" /></button></div>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-4">
                            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-card-foreground mb-2">Перетащите CSV файл сюда</p>
                            <p className="text-sm text-muted-foreground mb-4">или</p>
                            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">Выбрать файл</button>
                        </div>
                        <div className="bg-muted rounded-lg p-4 text-sm">
                            <p className="font-medium text-card-foreground mb-2">Формат CSV:</p>
                            <code className="text-xs text-muted-foreground">email,сегмент<br />ivan@example.com,VIP клиенты</code>
                        </div>
                        <div className="flex gap-3 justify-end mt-6">
                            <button onClick={() => setImportModalOpen(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground bg-transparent">Отмена</button>
                            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">Импортировать</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
