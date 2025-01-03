import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login({ login }) {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const navigate = useNavigate();

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
                <label htmlFor="id">아이디</label>
                <input
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    id="id"
                    type="text"
                    placeholder="Email or phone number"
                />

                <label htmlFor="pw">비밀번호</label>
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

                <button type="submit" className="auth-button">로그인</button>

                <div className="auth-links">
                    <span>아직 회원이 아니에요. </span>
                    <u
                        onClick={() => navigate('/signup')}
                        style={{ cursor: 'pointer', color: '#1e90ff' }}
                    >
                        회원가입하기.
                    </u>
                </div>
            </form>
        </div>
    );
}

export default Login;
