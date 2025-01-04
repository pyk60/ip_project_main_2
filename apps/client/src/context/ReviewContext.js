import React, { createContext, useContext, useState } from "react";

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
    const [reviews, setReviews] = useState([]);

    const addReview = (review) => {
        setReviews((prev) => [...prev, review]);
    };

    return (
        <ReviewContext.Provider value={{ reviews, addReview }}>
            {children}
        </ReviewContext.Provider>
    );
};

export const useReviewContext = () => useContext(ReviewContext);
