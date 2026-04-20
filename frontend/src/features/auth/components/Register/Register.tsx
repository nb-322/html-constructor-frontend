import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from "../../../../contexts/AuthContext.tsx";
import './Register.css';

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
            register(formData.email, formData.password, "marketer");
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
        <div className="register-container">
            <h3>Регистрация</h3>
            <form onSubmit={handleSubmit} noValidate className="register-form">
                <div className="register-input-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Логин"
                        value={formData.email}
                        onChange={handleChange}
                        className="register-input"
                    />
                </div>
                <div className="register-input-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                        className="register-input"
                    />
                </div>
                <button
                    type="submit"
                    className="register-button"
                >
                    Зарегистрироваться
                </button>
            </form>
            {error && <p className="register-error">{error}</p>}
            <p className="register-link">
                <button
                    onClick={() => navigate('/auth')}
                    className="register-link-button"
                >
                    Уже есть аккаунт? Войти
                </button>
            </p>
        </div>
    );
};

export default Register;
