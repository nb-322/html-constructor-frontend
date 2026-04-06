import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from "../../../../contexts/AuthContext.tsx";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const {register} = useAuth()
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Валидация
        if (!formData.email.trim() || !formData.password.trim() ) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        try {
            console.log('Registration data:', formData);
            register(formData.email, formData.password);
            navigate('/auth');
        } catch (err) {
            setError('Registration failed');
            console.error('Registration error:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h3>Регистрация</h3>
            <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Логин"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '5px' }}
                    />
                </div>
                <button
                    type="submit"
                    style={{ width: '100%', padding: '8px' }}
                >
                    Зарегистрироваться
                </button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            <p style={{ marginTop: '10px' }}>
                <button
                    onClick={() => navigate('/auth')}
                    style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
                >
                    Уже есть аккаунт? Войти
                </button>
            </p>
        </div>
    );
};

export default Register;