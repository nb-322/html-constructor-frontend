import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRegisterUser } from '../../../../api/api.ts';
import { Mail, Eye, EyeOff, User } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Пожалуйста, заполните все поля');
            return;
        }
        if (!agreed) {
            setError('Необходимо согласиться с условиями использования');
            return;
        }

        setLoading(true);
        try {
            await apiRegisterUser({ login: email, password, role: 'маркетолог' });
            navigate('/auth');
        } catch {
            setError('Ошибка регистрации. Проверьте данные и попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <button
                        onClick={() => navigate('/auth')}
                        className="inline-flex items-center gap-2 mb-6 bg-transparent p-0 text-foreground hover:text-primary"
                    >
                        <Mail className="w-10 h-10 text-primary" />
                        <span className="text-2xl font-bold text-foreground">EmailBuilder</span>
                    </button>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Регистрация</h1>
                    <p className="text-muted-foreground">Создайте новый аккаунт</p>
                </div>

                <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2">
                                Имя
                            </label>
                            <div className="relative">
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none pl-11 text-foreground"
                                    placeholder="Иван Иванов"
                                />
                                <User className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>

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
                                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none pr-12 text-foreground"
                                    placeholder="Минимум 8 символов"
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <input
                                id="agree"
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-1 w-4 h-4 accent-primary cursor-pointer"
                            />
                            <label htmlFor="agree" className="text-sm text-muted-foreground cursor-pointer">
                                Я согласен с{' '}
                                <span className="text-primary hover:opacity-80 cursor-pointer">условиями использования</span>
                                {' '}и{' '}
                                <span className="text-primary hover:opacity-80 cursor-pointer">политикой конфиденциальности</span>
                            </label>
                        </div>

                        {error && (
                            <p className="text-destructive text-sm">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition font-medium disabled:opacity-60"
                        >
                            {loading ? 'Регистрация...' : 'Создать аккаунт'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground">
                            Уже есть аккаунт?{' '}
                            <button
                                onClick={() => navigate('/auth')}
                                className="text-primary hover:opacity-80 font-medium bg-transparent p-0"
                            >
                                Войти
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
