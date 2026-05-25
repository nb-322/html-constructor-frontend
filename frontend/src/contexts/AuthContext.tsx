import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser, JWTPayload } from '../api/types';
import { jwtDecode } from 'jwt-decode';
import { useEditorStore } from '../features/editor/store/useEditorStore.ts';
import { apiLogin } from '../api/api.ts';

type Role = 'admin' | 'user' | 'manager' | 'marketer';

interface AuthContextType {
    user: AuthUser | null;
    login: (login: string, password: string) => Promise<void>;
    logout: () => void;
    register: (login: string, password: string, role: Role) => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const clearElements = useEditorStore(s => s.clearElements);

    const decodeTokenAndSetUser = useCallback((token: string): boolean => {
        try {
            const decoded = jwtDecode<JWTPayload>(token);
            if (decoded.exp < Date.now() / 1000) {
                localStorage.removeItem('token');
                setUser(null);
                return false;
            }
            const userId = decoded.user_id;
            if (!userId) {
                localStorage.removeItem('token');
                setUser(null);
                return false;
            }
            setUser({ id: userId, email: '', name: decoded.login || '', role: decoded.role || '' });
            return true;
        } catch {
            localStorage.removeItem('token');
            setUser(null);
            return false;
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) decodeTokenAndSetUser(token);
        setIsLoading(false);
    }, [decodeTokenAndSetUser]);

    const login = async (loginValue: string, password: string) => {
        const data = await apiLogin(loginValue, password);
        localStorage.setItem('token', data.token);
        decodeTokenAndSetUser(data.token);
    };

    const logout = () => {
        setUser(null);
        clearElements();
        localStorage.removeItem('token');
    };

    const register = async (_login: string, _password: string, _role: Role) => {
        // Registration is handled via EmployeesPage (admin creates users)
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: user !== null, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
