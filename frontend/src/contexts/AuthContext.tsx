import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser, JWTPayload } from '../api/types';
import { jwtDecode } from 'jwt-decode';
import {useEditorStore} from "../features/editor/store/useEditorStore.ts";
type role = "admin" | "user" | "manager";
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

    // Функция для декодирования токена и установки пользователя
    const decodeTokenAndSetUser = (token: string) => {
        try {
            console.log('Decoding token:', token.substring(0, 50) + '...');
            const decoded = jwtDecode<JWTPayload>(token);
            console.log('Decoded payload:', decoded);
            
            // Проверяем, не истек ли токен
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                console.log('Token expired');
                // Токен истек
                localStorage.removeItem('token');
                setUser(null);
                return false;
            }

            // Извлекаем данные пользователя с учетом разных возможных названий полей
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
    };

    // Инициализация при загрузке приложения
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            decodeTokenAndSetUser(token);
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
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
        localStorage.removeItem('token');
    };
    const register = async (email: string, password: string) => {
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
