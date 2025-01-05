import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { useTranslation } from "react-i18next";

function Login({ login }) {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation('login');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('ID:', id, 'PW:', pw);

        // 로그인 성공 시 상태 업데이트 및 메인 페이지 이동
        login();
        navigate('/');
    };

    return (
        <div className="auth-container">
            <h1 className="auth-logo">DramaSphere</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
                <label htmlFor="id">{t('email')}</label>
                <input
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    id="id"
                    type="text"
                    placeholder="Email or phone number"
                />

                <label htmlFor="pw">{t('password')}</label>
                <div className="password-container">
                    <input
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        id="pw"
                        type="password"
                        placeholder="Password"
                    />
                    <button
                        type="button"
                        className="show-password-btn"
                        onClick={() => {
                            const input = document.getElementById('pw');
                            input.type = input.type === 'password' ? 'text' : 'password';
                        }}
                    >
                        SHOW
                    </button>
                </div>

                <button type="submit" className="auth-button">{t('login')}</button>

                <div className="auth-links">
                    <span>{t('signUpMessage')}</span>
                    <u
                        onClick={() => navigate('/signup')}
                        style={{ cursor: 'pointer', color: '#1e90ff' }}
                    >
                        {t('signUpButton')}
                    </u>
                </div>
            </form>
        </div>
    );
}

export default Login;
