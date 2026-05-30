import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Mail, User, LogOut, Settings, FileText, Users,
    BarChart3, Send, Shield, Clock, Tag,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
    canSeeTemplates, canSeePending, canSeeCampaigns,
    canSeeClients, canSeeSegments, canSeeReports, canSeeEmployees,
} from '../utils/roles';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const role = user?.role ?? '';

    const navLink = (to: string, label: string, Icon: React.ElementType) => (
        <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                pathname === to
                    ? 'bg-muted text-primary'
                    : 'text-card-foreground hover:bg-accent'
            }`}
        >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
        </Link>
    );

    return (
        <aside className="w-64 bg-card border-r border-border flex flex-col flex-shrink-0">
            <Link to="/templates" className="p-6 border-b border-border flex items-center gap-2">
                <Mail className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold">EmailBuilder</span>
            </Link>

            <div className="flex-1 p-4 overflow-y-auto">
                <nav className="space-y-2">
                    {canSeeTemplates(role) && navLink('/templates', 'Шаблоны', FileText)}
                    {canSeePending(role)   && navLink('/pending-templates', 'Шаблоны на утверждении', Clock)}
                    {canSeeCampaigns(role) && navLink('/campaigns', 'Кампании', Send)}
                    {canSeeClients(role)   && navLink('/clients', 'Клиенты', Users)}
                    {canSeeSegments(role)  && navLink('/segments', 'Сегменты', Tag)}
                    {canSeeReports(role)   && navLink('/reports', 'Отчеты', BarChart3)}
                    {canSeeEmployees(role) && navLink('/employees', 'Сотрудники', Shield)}
                    {navLink('/settings', 'Настройки', Settings)}
                </nav>
            </div>

            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                        <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-card-foreground truncate">{user?.name || 'Пользователь'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.role || ''}</p>
                    </div>
                    <button
                        onClick={() => { logout(); navigate('/auth', { replace: true }); }}
                        className="text-muted-foreground hover:text-foreground p-0 bg-transparent flex-shrink-0"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
