import { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff } from 'lucide-react';

const Auth = () => {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email.trim()) { setError('Пожалуйста, введите логин'); return; }
        if (!password.trim()) { setError('Пожалуйста, введите пароль'); return; }
        try {
            await login(email, password);
            setEmail('');
            setPassword('');
            navigate('/', { replace: true });
        } catch {
            setError('Неверный логин или пароль');
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <Mail className="w-10 h-10 text-primary" />
                        <span className="text-2xl font-bold text-foreground">EmailBuilder</span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Вход в систему</h1>
                    <p className="text-muted-foreground">Войдите в свой аккаунт</p>
                </div>

                <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-foreground"
                                placeholder="ivan@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-card-foreground mb-2">
                                Пароль
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none pr-12 text-foreground"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground bg-transparent p-0"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 text-primary rounded border-border" />
                                <span className="text-sm text-muted-foreground">Запомнить меня</span>
                            </label>
                            <a href="#" className="text-sm text-primary hover:opacity-80">
                                Забыли пароль?
                            </a>
                        </div>

                        {error && <p className="text-destructive text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition font-medium disabled:opacity-50"
                        >
                            {isLoading ? 'Вход...' : 'Войти'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Auth;
