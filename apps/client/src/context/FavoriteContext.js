import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    // 로컬스토리지에서 찜 목록 로드
    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
    }, []);

    // 찜 추가
    const addFavorite = (drama) => {
        setFavorites((prev) => {
            const updatedFavorites = [...prev, drama];
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            return updatedFavorites;
        });
    };

    // 찜 제거
    const removeFavorite = (id) => {
        setFavorites((prev) => {
            const updatedFavorites = prev.filter((item) => item.id !== id);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            return updatedFavorites;
        });
    };

    return (
        <FavoriteContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
            {children}
        </FavoriteContext.Provider>
    );
};

export const useFavoriteContext = () => useContext(FavoriteContext);
