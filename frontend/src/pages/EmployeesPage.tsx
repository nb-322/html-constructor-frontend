import { Link, useNavigate } from 'react-router-dom';
import { Mail, User, LogOut, Settings, FileText, Users, BarChart3, Send, UserPlus, X, Shield, Clock, Trash2, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiGetUsers, apiGetArchivedUsers, apiRegisterUser, apiUpdateUser, apiArchiveUser, apiRestoreUser } from '../api/api.ts';

interface Employee {
    id: number;
    login: string;
    role: string;
    created_at: string;
}

export default function EmployeesPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [showDeleted, setShowDeleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);
    const [formData, setFormData] = useState({ login: '', password: '', role: 'маркетолог' });
    const [createError, setCreateError] = useState('');

    const load = async () => {
        setLoading(true);
        try {
            const fn = showDeleted ? apiGetArchivedUsers : apiGetUsers;
            const data = await fn();
            setEmployees(data.users || []);
        } catch { setEmployees([]); }
        setLoading(false);
    };

    useEffect(() => { load(); }, [showDeleted]);

    const handleCreate = async () => {
        setCreateError('');
        try {
            await apiRegisterUser({ login: formData.login, password: formData.password, role: formData.role });
            await load();
            setCreateModalOpen(false);
            setFormData({ login: '', password: '', role: 'маркетолог' });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            setCreateError(msg || 'Ошибка создания сотрудника');
        }
    };

    const handleEdit = (e: Employee) => {
        setEditingEmployee(e);
        setFormData({ login: e.login, password: '', role: e.role });
        setEditModalOpen(true);
    };

    const saveEmployee = async () => {
        if (!editingEmployee) return;
        try { await apiUpdateUser(editingEmployee.id, { login: formData.login, role: formData.role }); await load(); } catch { /* ignore */ }
        setEditModalOpen(false);
        setEditingEmployee(null);
        setFormData({ login: '', password: '', role: 'маркетолог' });
    };

    const handleDeleteClick = (id: number) => { setEmployeeToDelete(id); setDeleteModalOpen(true); };

    const confirmDelete = async () => {
        if (employeeToDelete == null) return;
        try { await apiArchiveUser(employeeToDelete); await load(); } catch { /* ignore */ }
        setDeleteModalOpen(false);
        setEmployeeToDelete(null);
    };

    const restoreEmployee = async (id: number) => {
        try { await apiRestoreUser(id); await load(); } catch { /* ignore */ }
    };

    const formatDate = (d: string) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getRoleLabel = (role: string) => role;
    const getRoleColor = (role: string) => ({ 'админ': 'bg-destructive/10 text-destructive border-destructive/20', 'маркетолог': 'bg-primary/10 text-primary border-primary/20' }[role] || 'bg-muted text-muted-foreground border-border');

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
                        <Link to="/campaigns" className="flex items-center gap-3 px-4 py-3 rounded-lg text-card-foreground hover:bg-accent"><Send className="w-5 h-5" /><span>Компании</span></Link>
                        <Link to="/clients" className="flex items-center gap-3 px-4 py-3 rounded-lg text-card-foreground hover:bg-accent"><Users className="w-5 h-5" /><span>Клиенты</span></Link>
                        <Link to="/reports" className="flex items-center gap-3 px-4 py-3 rounded-lg text-card-foreground hover:bg-accent"><BarChart3 className="w-5 h-5" /><span>Отчеты</span></Link>
                        <Link to="/employees" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted text-primary"><Shield className="w-5 h-5" /><span>Сотрудники</span></Link>
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
                            <h1 className="text-3xl font-bold text-foreground mb-2">Сотрудники</h1>
                            <p className="text-muted-foreground">Управляйте доступом сотрудников</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleted(!showDeleted)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground flex items-center gap-2 bg-transparent"><Trash2 className="w-4 h-4" />{showDeleted ? 'Показать активные' : 'Показать удаленные'}</button>
                            <button onClick={() => { setFormData({ login: '', password: '', role: 'маркетолог' }); setCreateError(''); setCreateModalOpen(true); }} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-2"><UserPlus className="w-5 h-5" />Создать сотрудника</button>
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
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Логин</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Роль</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Дата добавления</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {employees.map((emp) => (
                                            <tr key={emp.id} className="hover:bg-background">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center"><User className="w-5 h-5 text-muted-foreground" /></div>
                                                        <p className="font-medium text-foreground">{emp.login}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(emp.role)}`}>{getRoleLabel(emp.role)}</span>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">{formatDate(emp.created_at)}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        {!showDeleted ? (
                                                            <>
                                                                <button onClick={() => handleEdit(emp)} className="text-primary hover:opacity-80 text-sm font-medium bg-transparent p-0">Редактировать</button>
                                                                <button onClick={() => handleDeleteClick(emp.id)} className="text-destructive hover:opacity-80 text-sm font-medium bg-transparent p-0">Удалить</button>
                                                            </>
                                                        ) : (
                                                            <button onClick={() => restoreEmployee(emp.id)} className="text-primary hover:opacity-80 text-sm font-medium flex items-center gap-1 bg-transparent p-0"><RotateCcw className="w-3 h-3" />Восстановить</button>
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
                        <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold text-foreground">Редактировать сотрудника</h2><button onClick={() => setEditModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-transparent p-0"><X className="w-5 h-5" /></button></div>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium text-card-foreground mb-2">Логин</label><input type="text" value={formData.login} onChange={(e) => setFormData({ ...formData, login: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none" /></div>
                            <div><label className="block text-sm font-medium text-card-foreground mb-2">Роль</label>
                                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none">
                                    <option value="маркетолог">Маркетолог</option><option value="аналитик">Аналитик</option><option value="админ">Администратор</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end mt-6">
                            <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground bg-transparent">Отмена</button>
                            <button onClick={saveEmployee} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">Сохранить</button>
                        </div>
                    </div>
                </div>
            )}

            {createModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setCreateModalOpen(false)}>
                    <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold text-foreground">Создать сотрудника</h2><button onClick={() => setCreateModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-transparent p-0"><X className="w-5 h-5" /></button></div>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium text-card-foreground mb-2">Логин</label><input type="text" value={formData.login} onChange={(e) => setFormData({ ...formData, login: e.target.value })} placeholder="ivan" className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none" /></div>
                            <div><label className="block text-sm font-medium text-card-foreground mb-2">Пароль</label><input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Минимум 8 символов" className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none" /></div>
                            <div><label className="block text-sm font-medium text-card-foreground mb-2">Роль</label>
                                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none">
                                    <option value="маркетолог">Маркетолог</option><option value="аналитик">Аналитик</option><option value="админ">Администратор</option>
                                </select>
                            </div>
                            <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground">
                                <p className="font-medium text-card-foreground mb-2">Права доступа:</p>
                                <ul className="space-y-1 text-xs"><li>• <strong>Маркетолог:</strong> Создание шаблонов и кампаний</li><li>• <strong>Аналитик:</strong> Просмотр отчётов и статистики</li><li>• <strong>Админ:</strong> Полный доступ</li></ul>
                            </div>
                        </div>
                        {createError && <p className="text-destructive text-sm mt-3">{createError}</p>}
                        <div className="flex gap-3 justify-end mt-4">
                            <button onClick={() => setCreateModalOpen(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground bg-transparent">Отмена</button>
                            <button onClick={handleCreate} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">Создать</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteModalOpen(false)}>
                    <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold text-foreground">Подтверждение удаления</h2><button onClick={() => setDeleteModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-transparent p-0"><X className="w-5 h-5" /></button></div>
                        <p className="text-muted-foreground mb-6">Вы точно хотите удалить этого сотрудника?</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground bg-transparent">Отмена</button>
                            <button onClick={confirmDelete} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition">Удалить</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
