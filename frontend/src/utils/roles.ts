export const ADMIN    = 'админ';
export const MARKETER = 'маркетолог';
export const ANALYST  = 'аналитик';

export const isAdmin     = (role: string) => role === ADMIN;
export const canSeeTemplates = (role: string) => [ADMIN, MARKETER].includes(role);
export const canSeePending   = (role: string) => role === ADMIN;
export const canSeeCampaigns = (role: string) => [ADMIN, MARKETER].includes(role);
export const canSeeClients   = (role: string) => role === ADMIN;
export const canSeeSegments  = (role: string) => role === ADMIN;
export const canSeeReports   = (role: string) => [ADMIN, ANALYST].includes(role);
export const canSeeEmployees = (role: string) => role === ADMIN;
