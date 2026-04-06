import { useState } from 'react';
import {useAuth} from "../../../../contexts/AuthContext.tsx";
import { useNavigate } from 'react-router-dom';

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
        <div>
            <h3>Авторизация</h3>
            <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Логин"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '5px' }}
                        disabled={isLoading}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '5px' }}
                        disabled={isLoading}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{ width: '100%', padding: '8px' }}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            <p style={{ marginTop: '10px' }}>
                <button
                    onClick={() => navigate('/register')}
                    style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
                >
                    Нет аккаунта? Зарегистрироваться
                </button>
            </p>
        </div>
    );
};

export default Auth;
