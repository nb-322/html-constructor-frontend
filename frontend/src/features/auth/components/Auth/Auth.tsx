import { useState } from 'react';
import {useAuth} from "../../../../contexts/AuthContext.tsx";
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Валидация
        if (!email.trim()) {
            setError('Пожалуйста, введите логин');
            return;
        }

        if (!password.trim()) {
            setError('Пожалуйста, введите пароль');
            return;
        }

        try {
            await login(email, password);
            console.log('Login successful');
            setEmail('');
            setPassword('');
            setError('');
            navigate('/', { replace: true });
        } catch (err) {
            setError('Login failed. Check console for details.');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="auth-container">
            <h3>Авторизация</h3>
            <form onSubmit={handleSubmit} noValidate className="auth-form">
                <div className="auth-input-group">
                    <input
                        type="text"
                        placeholder="Логин"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="auth-input"
                        disabled={isLoading}
                    />
                </div>
                <div className="auth-input-group">
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="auth-input"
                        disabled={isLoading}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="auth-button"
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            {error && <p className="auth-error">{error}</p>}
            <p className="auth-link">
                <button
                    onClick={() => navigate('/register')}
                    className="auth-link-button"
                >
                    Нет аккаунта? Зарегистрироваться
                </button>
            </p>
        </div>
    );
};

export default Auth;
