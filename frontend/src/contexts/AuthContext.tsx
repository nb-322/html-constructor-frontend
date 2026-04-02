import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../api/types';

interface AuthContextType {
    user: AuthUser | null;
    login: (user: AuthUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);

    const login = (user: AuthUser) => {
        setUser(user);
        // TODO: Store token in localStorage
    };

    const logout = () => {
        setUser(null);
        // TODO: Remove token from localStorage
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
