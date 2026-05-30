import { useAuth } from './contexts/AuthContext';
import { Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './features/auth/components/ProtectedRoute/ProtectedRoute.tsx';
import Editor from './features/editor/components/Editor/Editor.tsx';
import Auth from './features/auth/components/Auth/Auth.tsx';
import MainPage from './features/main/components/MainPage/MainPage.tsx';
import PendingTemplatesPage from './pages/PendingTemplatesPage.tsx';
import CampaignsPage from './pages/CampaignsPage.tsx';
import ClientsPage from './pages/ClientsPage.tsx';
import ReportsPage from './pages/ReportsPage.tsx';
import EmployeesPage from './pages/EmployeesPage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';
import SegmentsPage from './pages/SegmentsPage.tsx';
import {
    canSeeTemplates, canSeePending, canSeeCampaigns,
    canSeeClients, canSeeSegments, canSeeReports, canSeeEmployees,
} from './utils/roles.ts';

// Перенаправляет на первую доступную страницу по роли
const defaultRoute = (role: string) => {
    if (canSeeTemplates(role))  return '/templates';
    if (canSeeReports(role))    return '/reports';
    return '/settings';
};

function App() {
    const { user, isLoading } = useAuth();
    const role = user?.role ?? '';

    const protect = (element: React.ReactElement, allowed?: boolean): React.ReactElement => (
        <ProtectedRoute user={user} isLoading={isLoading}>
            {allowed === false ? <Navigate to={defaultRoute(role)} replace /> : element}
        </ProtectedRoute>
    );

    return (
        <Routes>
            <Route path="/auth" element={<Auth />} />

            <Route path="/"                  element={protect(<MainPage />,             canSeeTemplates(role))} />
            <Route path="/templates"         element={protect(<MainPage />,             canSeeTemplates(role))} />
            <Route path="/pending-templates" element={protect(<PendingTemplatesPage />, canSeePending(role))} />
            <Route path="/campaigns"         element={protect(<CampaignsPage />,        canSeeCampaigns(role))} />
            <Route path="/clients"           element={protect(<ClientsPage />,          canSeeClients(role))} />
            <Route path="/segments"          element={protect(<SegmentsPage />,         canSeeSegments(role))} />
            <Route path="/reports"           element={protect(<ReportsPage />,          canSeeReports(role))} />
            <Route path="/employees"         element={protect(<EmployeesPage />,        canSeeEmployees(role))} />
            <Route path="/settings"          element={protect(<SettingsPage />)} />
            <Route path="/editor"            element={protect(<Editor />)} />
            <Route path="/editor/:id"        element={protect(<Editor />)} />
        </Routes>
    );
}

export default App;
