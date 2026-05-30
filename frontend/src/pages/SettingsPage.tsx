import { Link, useNavigate } from 'react-router-dom';
import { Mail, User, LogOut, Settings, FileText, Users, BarChart3, Send, Sun, Moon, Shield, Clock } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar.tsx';
import { isAdmin } from '../utils/roles.ts';

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    return (
        <div className="flex h-screen bg-background">
            <Sidebar />

            <main className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Настройки</h1>
                        <p className="text-muted-foreground">Управляйте настройками вашего аккаунта</p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-card border border-border rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-foreground mb-4">Внешний вид</h2>
                            <div>
                                <label className="block text-sm font-medium text-card-foreground mb-3">Тема оформления</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => setTheme('light')} className={`p-4 border-2 rounded-lg flex items-center gap-3 transition bg-transparent ${mounted && theme === 'light' ? 'border-primary bg-muted' : 'border-border hover:border-primary'}`}>
                                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg flex items-center justify-center"><Sun className="w-6 h-6 text-white" /></div>
                                        <div className="text-left"><p className="font-medium text-card-foreground">Светлая</p><p className="text-sm text-muted-foreground">Розовые оттенки</p></div>
                                    </button>
                                    <button onClick={() => setTheme('dark')} className={`p-4 border-2 rounded-lg flex items-center gap-3 transition bg-transparent ${mounted && theme === 'dark' ? 'border-primary bg-muted' : 'border-border hover:border-primary'}`}>
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#3B2936] via-[#7A4B63] to-[#D85D83] rounded-lg flex items-center justify-center"><Moon className="w-6 h-6 text-white" /></div>
                                        <div className="text-left"><p className="font-medium text-card-foreground">Темная</p><p className="text-sm text-muted-foreground">Мягкие винно-пудровые оттенки</p></div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-foreground mb-4">Уведомления</h2>
                            <div className="space-y-4">
                                <label className="flex items-center justify-between">
                                    <div><p className="font-medium text-card-foreground">Email уведомления</p><p className="text-sm text-muted-foreground">Получать уведомления о новых кампаниях</p></div>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary rounded" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <div><p className="font-medium text-card-foreground">Статистика</p><p className="text-sm text-muted-foreground">Еженедельные отчеты о производительности</p></div>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary rounded" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <div><p className="font-medium text-card-foreground">Новые подписчики</p><p className="text-sm text-muted-foreground">Уведомления о новых клиентах</p></div>
                                    <input type="checkbox" className="w-5 h-5 text-primary rounded" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
