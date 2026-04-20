import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser, JWTPayload } from '../api/types';
import { jwtDecode } from 'jwt-decode';
import {useEditorStore} from "../features/editor/store/useEditorStore.ts";
type role = "admin" | "user" | "manager" | "marketer";

const MOCK_API = true; // Set to false to use real API

interface AuthContextType {
    user: AuthUser | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (email: string, password: string, role: role) => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const clearElements = useEditorStore(s=>s.clearElements);

    // Функция для декодирования токена и установки пользователя
    const decodeTokenAndSetUser = useCallback((token: string) => {
        try {
            console.log('Decoding token:', token.substring(0, 50) + '...');
            const decoded = jwtDecode<JWTPayload>(token);
            console.log('Decoded payload:', decoded);
            
            // Проверяем, не истек ли токен
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                console.log('Token expired');
                clearElements();
                localStorage.removeItem('token');
                setUser(null);
                return false;
            }

            console.log('это декодед ',decoded);
            const userId = decoded.user_id;
            const email = '';
            const name =decoded.login || '';
            const role = decoded.role || '';
            if (!userId) {
                console.error('No user ID found in token');
                localStorage.removeItem('token');
                setUser(null);
                return false;
            }

            // Устанавливаем пользователя из декодированного токена
            setUser({
                id: userId,
                email: email,
                name: name,
                role: role
            });
            console.log('User set from token:', { id: userId, email, name });
            return true;
        } catch (error) {
            console.error('Error decoding token:', error);
            localStorage.removeItem('token');
            setUser(null);
            return false;
        }
    }, [clearElements]);

    // Инициализация при загрузке приложения
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            if (token === "mock_token") {
                // Mock user
                setUser({
                    id: "1",
                    email: 'mock@example.com',
                    name: 'Mock User',
                    role: 'user'
                });
            } else {
                decodeTokenAndSetUser(token);
            }
        }
        setIsLoading(false);
    }, [decodeTokenAndSetUser]);

    const login = async (email: string, password: string) => {
        if (MOCK_API) {
            // Mock login
            setUser({
                id: "1",
                email: email,
                name: email,
                role: 'user'
            });
            localStorage.setItem("token", "mock_token");
            return;
        }

        const res = await fetch("http://100.103.69.36:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "login": email, "password": password }),
        });

        if (!res.ok) {
            throw new Error('Login failed');
        }

        const data = await res.json();

        // Сохраняем токен
        localStorage.setItem("token", data.token);

        // Декодируем токен и устанавливаем пользователя
        decodeTokenAndSetUser(data.token);
    };

    const logout = () => {
        setUser(null);
        clearElements();
        localStorage.removeItem('token');
    };

    // eslint-disable-next-line react-refresh/only-export-components
    const register = async (email: string, password: string) => {
        if (MOCK_API) {
            // Mock register - just return, no action needed
            return;
        }

        const res = await fetch("http://100.103.69.36:8080/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "login": email, "password": password ,role:"marketer"}),
        });

        if (!res.ok) {
            throw new Error('Login failed');
        }


    }

    const isAuthenticated = user !== null;

    return (
        <AuthContext.Provider value={{ user, login, logout, register,isAuthenticated, isLoading }}>
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
