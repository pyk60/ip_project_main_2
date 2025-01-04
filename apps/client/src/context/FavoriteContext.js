import React, { createContext, useContext, useState } from "react";

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    const addFavorite = (item) => {
        setFavorites((prev) => [...prev, item]);
    };

    const removeFavorite = (id) => {
        setFavorites((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <FavoriteContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
            {children}
        </FavoriteContext.Provider>
    );
};

export const useFavoriteContext = () => useContext(FavoriteContext);
