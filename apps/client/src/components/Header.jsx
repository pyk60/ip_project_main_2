import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Header.css';

function Header({ isLoggedIn, logout }) {
    const { t, i18n } = useTranslation('header');
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState(""); // 검색 상태 관리
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // 언어 변경 핸들러
    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang.toLowerCase());
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // 로그아웃 핸들러
    const handleLogout = () => {
        logout(); // 상태 업데이트
        navigate('/login'); // 로그인 페이지로 이동
    };

    // 검색 실행 핸들러
    const handleSearch = () => {
        if (searchText.trim() !== "") {
            navigate(`/search?query=${searchText.trim()}`); // 검색 결과 페이지로 이동
            setSearchText(""); // 검색 후 입력 값 초기화
        }
    };

    // 키보드 이벤트 핸들러
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
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
                <input
                    type="text"
                    placeholder={t('search')} // 다국어 지원
                    className="search-bar"
                    value={searchText} // 상태 값 바인딩
                    onChange={(e) => setSearchText(e.target.value)} // 상태 업데이트
                    onKeyDown={handleKeyDown} // 엔터키 입력 처리
                />
                
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
