import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyPage from './pages/MyPage';
import Detail from './pages/Detail';
import Login from './components/Login';
import SignUp from './components/SignUp';
import MainPage from './components/MainPage';
import EditProfile from './pages/EditProfile';
import ActorFilmography from './pages/ActorFilmography';
import Community from './pages/Community';
import QueryProvider from './libs/react-query-provider';
import { Toaster } from 'sonner';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { FollowProvider } from './pages/FollowContext'; // FollowProvider 가져오기
import { ReviewProvider } from './context/ReviewContext';
import { FavoriteProvider } from './context/FavoriteContext';
import SearchResults from './pages/SearchResults';

function App() {
  // 프로필 정보를 상태로 관리
  const [profile, setProfile] = useState({
    name: '닉네임',
    email: 'oooooo@gmail.com',
    profilePic: 'https://via.placeholder.com/100',
    following: 53,
    follower: 53
  });

  // 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <FavoriteProvider>
      <ReviewProvider>
        <QueryProvider>
          <I18nextProvider i18n={i18n}>
            <FollowProvider> {/* FollowProvider로 감싸기 */}
              <BrowserRouter>
                {/* 로그인 상태와 로그아웃 함수를 Header에 전달 */}
                <Header isLoggedIn={isLoggedIn} logout={logout} />
                <Routes>
                  <Route path="/" element={<MainPage />} />
                  <Route
                    path="/mypage"
                    element={<MyPage profile={profile} />}
                  />
                  <Route
                    path="/edit-profile"
                    element={
                      <EditProfile profile={profile} setProfile={setProfile} />
                    }
                  />
                  <Route
                    path="/community"
                    element={<Community profile={profile} />}
                  />
                  <Route path="/drama/:name" element={<Detail />} />
                  <Route path="/actor/:id" element={<ActorFilmography />} />
                  <Route
                    path="/login"
                    element={<Login login={login} />}
                  />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/detail" element={<Detail />} />

                </Routes>
              </BrowserRouter>
              <Toaster position="bottom-right" />
            </FollowProvider>
          </I18nextProvider>
        </QueryProvider>
      </ReviewProvider>
    </FavoriteProvider>
  );
}

export default App;