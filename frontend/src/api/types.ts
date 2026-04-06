// API types for future backend integration

export interface Template {
    id: string;
    name: string;
    elements: import("../features/editor/types/Editor").EditorElement[];
    createdAt: string;
    updatedAt: string;
}

export interface SaveTemplateRequest {
    name: string;
    elements: import("../features/editor/types/Editor").EditorElement[];
}

export interface SaveTemplateResponse {
    template: Template;
}

export interface GetTemplatesResponse {
    templates: Template[];
}

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface JWTPayload {
    user_id?: string;
    email?: string;
    login?: string;
    role?: string;
    exp: number;
    iat: number;
    sub?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: AuthUser;
    token: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface RegisterResponse {
    user: AuthUser;
    token: string;
}
