import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/MyPage.css';
import { useFollow } from "./FollowContext";


export default function MyPage({ profile }) {
    const [activeTab, setActiveTab] = useState("찜");
    const [showFollowingList, setShowFollowingList] = useState(false);
    const navigate = useNavigate();
    const { followingList } = useFollow();
    

    const handleTabClick = (tab) => setActiveTab(tab);

    const dummyDramas = [
        { title: "드라마 1", rating: 4.5, review: "재미있게 봤습니다.", date: "2024-07-07" },
        { title: "드라마 2", rating: 4.0, review: "괜찮았어요.", date: "2024-07-08" },
    ];

    return (
        <div className="mypage">
            {/* 프로필 섹션 */}
            <div className="profile-section">
                <img
                    src={profile.profilePic}
                    alt="프로필 사진"
                    className="profile-pic"
                />
                <div className="profile-info">
                    <h2>
                        {profile.name}{" "}
                        <span
                            role="img"
                            aria-label="edit"
                            onClick={() => navigate("/edit-profile")}
                            className="edit-button"
                            style={{ cursor: "pointer" }}
                        >
                            ✐
                        </span>
                    </h2>
                    <p>{profile.email}</p>
                    <p>
                        <span
                            style={{ cursor: "pointer", color: "white" }}
                            onClick={() => setShowFollowingList(!showFollowingList)}
                        >
                            {followingList.length} following
                        </span>{" "}
                        {profile.follower} follower
                    </p>
                    <p>
                        <a
                            href="#"
                            className={activeTab === "게시물" ? "active-tab" : ""}
                            onClick={() => handleTabClick("게시물")}
                        >
                            게시물
                        </a>{" "}
                        |{" "}
                        <a
                            href="#"
                            className={activeTab === "찜" ? "active-tab" : ""}
                            onClick={() => handleTabClick("찜")}
                        >
                            찜
                        </a>{" "}
                        |{" "}
                        <a
                            href="#"
                            className={activeTab === "리뷰" ? "active-tab" : ""}
                            onClick={() => handleTabClick("리뷰")}
                        >
                            리뷰
                        </a>
                    </p>
                </div>
            </div>

            {/* 팔로우 목록 */}
            {showFollowingList && (
                <div className="following-list">
                    <h3>팔로우한 사용자</h3>
                    {followingList.length > 0 ? (
                        <ul>
                            {followingList.map((user, index) => (
                                <li key={index}>{user.name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>팔로우한 사용자가 없습니다.</p>
                    )}
                </div>
            )}

            {/* 컨텐츠 섹션 */}
            <div className="content-section">
                {activeTab === "찜" && (
                    <div className="wishlist">
                        <h3>찜한 드라마</h3>
                        <div className="drama-list">
                            {dummyDramas.map((drama, index) => (
                                <div key={index} className="drama-item">
                                    <img
                                        src="https://via.placeholder.com/150x200"
                                        alt={drama.title}
                                    />
                                    <p>{drama.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === "리뷰" && (
                    <div className="review-list">
                        <h3>리뷰</h3>
                        {dummyDramas.map((drama, index) => (
                            <div key={index} className="review-item">
                                <h4>{drama.title}</h4>
                                <p>⭐ {drama.rating}</p>
                                <p>{drama.review}</p>
                                <p>{drama.date}</p>
                                <button>👍 1</button>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === "게시물" && (
                    <div className="posts">
                        <h3>게시물이 없습니다.</h3>
                    </div>
                )}
            </div>
        </div>
    );
}