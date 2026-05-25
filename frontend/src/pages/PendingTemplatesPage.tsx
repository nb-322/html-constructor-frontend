import { Link } from 'react-router-dom';
import { Settings, User, LogOut, Mail, FileText, Send, Users, BarChart3, Shield, Clock, Check, X as XIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PendingTemplate {
    id: string;
    name: string;
    thumbnail: string;
    submittedBy: string;
    submittedDate: string;
}

export default function PendingTemplatesPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [pendingTemplates, setPendingTemplates] = useState<PendingTemplate[]>([
        { id: '1', name: 'Летняя акция 2026', thumbnail: 'bg-gradient-to-br from-orange-400 to-red-400', submittedBy: 'Мария Смирнова', submittedDate: '28 апр 2026' },
        { id: '2', name: 'Новости компании', thumbnail: 'bg-gradient-to-br from-indigo-400 to-purple-400', submittedBy: 'Петр Козлов', submittedDate: '29 апр 2026' },
    ]);

    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [templateToReject, setTemplateToReject] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const handleApprove = (id: string) => {
        setPendingTemplates(pendingTemplates.filter(t => t.id !== id));
    };

    const handleRejectClick = (id: string) => {
        setTemplateToReject(id);
        setRejectModalOpen(true);
    };

    const confirmReject = () => {
        if (templateToReject) {
            setPendingTemplates(pendingTemplates.filter(t => t.id !== templateToReject));
            setRejectModalOpen(false);
            setTemplateToReject(null);
            setRejectReason('');
        }
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
                        <Link to="/templates" className="flex items-center gap-3 px-4 py-3 rounded-lg text-card-foreground hover:bg-accent"><FileText className="w-5 h-5" /><span>Шаблоны</span></Link>
                        <Link to="/pending-templates" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted text-primary"><Clock className="w-5 h-5" /><span>Шаблоны на утверждении</span></Link>
                        <Link to="/campaigns" className="flex items-center gap-3 px-4 py-3 rounded-lg text-card-foreground hover:bg-accent"><Send className="w-5 h-5" /><span>Кампании</span></Link>
                        <Link to="/clients" className="flex items-center gap-3 px-4 py-3 rounded-lg text-card-foreground hover:bg-accent"><Users className="w-5 h-5" /><span>Клиенты</span></Link>
                        <Link to="/reports" className="flex items-center gap-3 px-4 py-3 rounded-lg text-card-foreground hover:bg-accent"><BarChart3 className="w-5 h-5" /><span>Отчеты</span></Link>
                        <Link to="/employees" className="flex items-center gap-3 px-4 py-3 rounded-lg text-card-foreground hover:bg-accent"><Shield className="w-5 h-5" /><span>Сотрудники</span></Link>
                        <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-card-foreground hover:bg-accent"><Settings className="w-5 h-5" /><span>Настройки</span></Link>
                    </nav>
                </div>
                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm text-card-foreground truncate">{user?.name || 'Пользователь'}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email || user?.role || ''}</p>
                        </div>
                        <button onClick={() => { logout(); navigate('/auth', { replace: true }); }} className="text-muted-foreground hover:text-foreground p-0 bg-transparent">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 overflow-auto">
                <div className="max-w-6xl mx-auto p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Шаблоны на утверждении</h1>
                        <p className="text-muted-foreground">Проверьте и утвердите новые шаблоны</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingTemplates.map((template) => (
                            <div key={template.id} className="aspect-[3/4] bg-card border border-border rounded-lg overflow-hidden shadow-sm">
                                <div className={`h-2/3 ${template.thumbnail}`} />
                                <div className="h-1/3 p-4 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                                        <p className="text-xs text-muted-foreground mb-1">Отправил: {template.submittedBy}</p>
                                        <p className="text-xs text-muted-foreground">{template.submittedDate}</p>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => handleApprove(template.id)} className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center justify-center gap-1 text-sm">
                                            <Check className="w-4 h-4" />Одобрить
                                        </button>
                                        <button onClick={() => handleRejectClick(template.id)} className="flex-1 px-3 py-2 border border-border rounded-lg hover:bg-accent text-card-foreground flex items-center justify-center gap-1 text-sm bg-transparent">
                                            <XIcon className="w-4 h-4" />Отклонить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {pendingTemplates.length === 0 && (
                        <div className="text-center py-12">
                            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-xl font-semibold text-foreground mb-2">Нет шаблонов на утверждении</p>
                            <p className="text-muted-foreground">Все шаблоны проверены</p>
                        </div>
                    )}
                </div>
            </main>

            {rejectModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setRejectModalOpen(false)}>
                    <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-foreground">Причина отклонения</h2>
                            <button onClick={() => setRejectModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-transparent p-0"><XIcon className="w-5 h-5" /></button>
                        </div>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Укажите причину отклонения..."
                            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none min-h-[120px] resize-none"
                        />
                        <div className="flex gap-3 justify-end mt-6">
                            <button onClick={() => setRejectModalOpen(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground bg-transparent">Отмена</button>
                            <button onClick={confirmReject} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition">Отклонить</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
