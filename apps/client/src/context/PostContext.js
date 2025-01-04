import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const PostContext = createContext();
PostContext.displayName = "PostContext";

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);

    const addPost = (newPost) => {
        const id = Date.now(); // 고유한 ID 생성
        setPosts((prevPosts) => [{ ...newPost, id }, ...prevPosts]);
    };

    return (
        <PostContext.Provider value={{ posts, addPost }}>
            {children}
        </PostContext.Provider>
    );
};

PostProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const usePostsContext = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error("usePostsContext must be used within a PostProvider");
    }
    return context;
};
