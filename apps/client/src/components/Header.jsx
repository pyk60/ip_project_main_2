import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Header.css';

function Header({ isLoggedIn, logout }) {
    const { t, i18n } = useTranslation('header');
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang.toLowerCase());
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
      logout(); // 상태 업데이트
      navigate('/login'); // 로그인 페이지로 이동
    };

    return (
        <div className="header">
            <div className="nav-left">
                <Link className="user-icon" to="/mypage" title={t('mypage')}>
                    👤
                </Link>
                <Link className="community" to="/community">
                    {t('community')}
                </Link>
            </div>

            <Link className="logo" to="/">
                DramaSphere
            </Link>

            <div className="nav-right">
                {isLoggedIn ? (
                    <Link to="/" className="navbarMenu logout-btn" onClick={handleLogout}>
                        {t('logout')}
                    </Link>
                ) : (
                    <Link className="navbarMenu" to="/login">
                        {t('login')}
                    </Link>
                )}
                <input type="text" placeholder={t('search')} className="search-bar" />
                <div className="language-selector">
                    <span className="language" onClick={toggleDropdown}>
                        {i18n.language.toUpperCase()} ▼
                    </span>

                    {isDropdownOpen && (
                        <div className="dropdown">
                            {['KR', 'EN', 'VN'].map((lang) => (
                                <span
                                    key={lang}
                                    className="dropdown-item"
                                    onClick={() => handleLanguageChange(lang)}
                                >
                                    {lang}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;