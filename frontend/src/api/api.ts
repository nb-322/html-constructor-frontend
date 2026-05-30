const BASE_URL = 'http://185.207.66.181:8081';

const getToken = () => localStorage.getItem('token');

const authHeaders = (): HeadersInit => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken() || ''}`,
});

const request = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(`${BASE_URL}${url}`, options);
    if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try { const body = await res.json(); msg = body.error || body.message || msg; } catch { /* ignore */ }
        throw new Error(msg);
    }
    return res.json();
};

const get = (url: string) => request(url, { headers: authHeaders() });
const post = (url: string, body?: unknown) => request(url, {
    method: 'POST', headers: authHeaders(), body: body !== undefined ? JSON.stringify(body) : undefined,
});
const patch = (url: string, body?: unknown) => request(url, {
    method: 'PATCH', headers: authHeaders(), body: body !== undefined ? JSON.stringify(body) : undefined,
});

// Auth
export const apiLogin = (login: string, password: string) =>
    request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
    });

// Templates
export const apiGetTemplates = () => get('/api/templates');
export const apiGetUserTemplates = () => get('/api/templates/user');
export const apiGetPendingTemplates = () => get('/api/templates/pending');
export const apiGetArchivedTemplates = () => get('/api/templates/archive');
export const apiGetTemplate = (id: number) => get(`/api/templates/${id}`);
export const apiCreateTemplate = (data: { name: string; html_body: string; status?: string }) => post('/api/templates', data);
export const apiUpdateTemplate = (id: number, data: { name: string; html_body: string; status?: string }) => patch(`/api/templates/${id}`, data);
export const apiGetTemplateReviews = (id: number) => get(`/api/templates/${id}/reviews`);
export const apiArchiveTemplate = (id: number) => patch(`/api/templates/${id}/archive`);
export const apiRestoreTemplate = (id: number) => patch(`/api/templates/${id}/restore`);
export const apiApproveTemplate = (id: number) => patch(`/api/templates/${id}/approve`);
export const apiRejectTemplate = (id: number, comment: string) => patch(`/api/templates/${id}/reject`, { comment });
export const apiSubmitTemplate  = (id: number) => patch(`/api/templates/${id}/submit`, {});
export const apiRevokeTemplate  = (id: number) => patch(`/api/templates/${id}/revoke`, {});

// Campaigns
export const apiGetCampaigns = () => get('/api/campaigns');
export const apiGetArchivedCampaigns = () => get('/api/campaigns/archive');
export const apiCreateCampaign = (data: { scheduled_at: string; segment: string; tpl_id: number }) => post('/api/campaigns', data);
export const apiUpdateCampaign = (id: number, status: string) => patch(`/api/campaigns/${id}`, { status });
export const apiArchiveCampaign = (id: number) => patch(`/api/campaigns/${id}/archive`);
export const apiRestoreCampaign = (id: number) => patch(`/api/campaigns/${id}/restore`);
export const apiLaunchCampaign = (id: number) => post(`/api/campaigns/${id}/launch`);

// Clients
export const apiGetClients = () => get('/api/clients');
export const apiGetArchivedClients = () => get('/api/clients/archive');
export const apiCreateClient = (data: { email: string; consent_flag: boolean; segment: string }) => post('/api/clients', data);
export const apiUpdateClient = (id: number, data: { email: string; consent_flag: boolean; segment: string }) => patch(`/api/clients/${id}`, data);
export const apiArchiveClient = (id: number) => patch(`/api/clients/${id}/archive`);
export const apiRestoreClient = (id: number) => patch(`/api/clients/${id}/restore`);

// Segments
export const apiGetSegments = () => get('/api/segments');
export const apiGetArchivedSegments = () => get('/api/segments/archive');
export const apiCreateSegment = (data: { name: string; description: string }) => post('/api/segments', data);
export const apiUpdateSegment = (name: string, data: { description: string }) => patch(`/api/segments/${name}`, data);
export const apiArchiveSegment = (name: string) => patch(`/api/segments/${name}/archive`);
export const apiRestoreSegment = (name: string) => patch(`/api/segments/${name}/restore`);

// Users
export const apiGetUsers = () => get('/api/users');
export const apiGetArchivedUsers = () => get('/api/users/archive');
export const apiRegisterUser = (data: { login: string; password: string; role: string }) =>
    request('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
export const apiUpdateUser = (id: number, data: { login: string; role: string }) => patch(`/api/users/${id}`, data);
export const apiArchiveUser = (id: number) => patch(`/api/users/${id}/archive`);
export const apiRestoreUser = (id: number) => patch(`/api/users/${id}/restore`);
