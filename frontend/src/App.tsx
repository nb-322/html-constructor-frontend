import { useAuth } from './contexts/AuthContext';
import { Route, Routes } from 'react-router-dom';
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

function App() {
    const { user, isLoading } = useAuth();

    return (
        <Routes>
            <Route path="/auth" element={<Auth />} />

            <Route path="/" element={<ProtectedRoute user={user} isLoading={isLoading}><MainPage /></ProtectedRoute>} />
            <Route path="/templates" element={<ProtectedRoute user={user} isLoading={isLoading}><MainPage /></ProtectedRoute>} />
            <Route path="/pending-templates" element={<ProtectedRoute user={user} isLoading={isLoading}><PendingTemplatesPage /></ProtectedRoute>} />
            <Route path="/campaigns" element={<ProtectedRoute user={user} isLoading={isLoading}><CampaignsPage /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute user={user} isLoading={isLoading}><ClientsPage /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute user={user} isLoading={isLoading}><ReportsPage /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute user={user} isLoading={isLoading}><EmployeesPage /></ProtectedRoute>} />
            <Route path="/segments" element={<ProtectedRoute user={user} isLoading={isLoading}><SegmentsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute user={user} isLoading={isLoading}><SettingsPage /></ProtectedRoute>} />
            <Route path="/editor" element={<ProtectedRoute user={user} isLoading={isLoading}><Editor /></ProtectedRoute>} />
            <Route path="/editor/:id" element={<ProtectedRoute user={user} isLoading={isLoading}><Editor /></ProtectedRoute>} />
        </Routes>
    );
}

export default App;
