import React, { createContext, useContext, useState } from 'react';

// FollowContext 생성
const FollowContext = createContext();

export const FollowProvider = ({ children }) => {
    // 팔로우 상태 관리
    const [followingList, setFollowingList] = useState([]);

    // 새로운 사용자를 팔로우 리스트에 추가하는 함수
    const addFollowing = (user) => {
        setFollowingList((prevList) => [
            ...prevList,
            {
                name: user.name || "Unknown User",
                avatar: user.avatar || "https://via.placeholder.com/100", // 기본값 설정
            },
        ]);
    };
    

    // 사용자를 언팔로우 리스트에서 제거하는 함수
    const removeFollowing = (userName) => {
        setFollowingList((prevList) =>
            prevList.filter((item) => item.name !== userName)
        );
    };

    // 팔로우 리스트 초기화
    const resetFollowing = () => {
        setFollowingList([]);
    };

    // 팔로우 컨텍스트 제공
    return (
        <FollowContext.Provider
            value={{ followingList, addFollowing, removeFollowing, resetFollowing }}
        >
            {children}
        </FollowContext.Provider>
    );
};

// 커스텀 훅
export const useFollow = () => {
    const context = useContext(FollowContext);
    if (!context) {
        throw new Error('useFollow must be used within a FollowProvider');
    }
    return context;
};
