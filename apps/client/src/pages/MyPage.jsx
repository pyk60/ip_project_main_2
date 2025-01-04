import React, { useState } from "react";
import "../styles/MyPage.css";
import { usePostsContext } from "../context/PostContext";
import { useReviewContext } from "../context/ReviewContext";
import { useFavoriteContext } from "../context/FavoriteContext";
import { useNavigate } from "react-router-dom";

export default function MyPage({ profile }) {
    const [activeTab, setActiveTab] = useState("게시물");
    const { posts } = usePostsContext(); // Context에서 posts 가져오기
    const { reviews } = useReviewContext();
    const { favorites } = useFavoriteContext();
    const navigate = useNavigate();

    const [showFollowingList, setShowFollowingList] = useState(false);
    const [followingList, setFollowingList] = useState([]); // 초기값 빈 배열
    const [followersList, setFollowersList] = useState([]); // 초기값 빈

    // 기본값 설정
    const dummyDramas = [
        { id: 1, title: "드라마 1", poster: "https://via.placeholder.com/150x200" },
        { id: 2, title: "드라마 2", poster: "https://via.placeholder.com/150x200" },
    ];
    const defaultProfile = {
        profilePic: "https://via.placeholder.com/150",
        name: "기본 사용자",
        email: "default@example.com",
    };

    const userProfile = profile || defaultProfile; // 전달된 프로필이 없으면 기본값 사용

    const handleTabClick = (tab) => setActiveTab(tab);

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

            {/* 콘텐츠 섹션 */}
            <div className="content-section">
                {/* 찜 탭 */}
                {activeTab === "찜" && (
                <div className="wishlist">
                    <h3>찜한 드라마</h3>
                    <div className="drama-list">
                        {favorites.length > 0 ? (
                            favorites.map((drama) => (
                                <div key={drama.id} className="drama-item">
                                    <img
                                        src={drama.poster}
                                        alt={drama.title}
                                    />
                                    <p>{drama.title}</p>
                                </div>
                            ))
                        ) : (
                            <p>찜한 드라마가 없습니다.</p>
                        )}
                    </div>
                </div>
                )}

                {/* 게시물 탭 */}
                {activeTab === "게시물" && (
                    <div className="posts">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div className="post" key={post.id}>
                                    <div className="channel-info">
                                        <div className="channel-profile">
                                            <img
                                                src={
                                                    post.avatar ||
                                                    require("../img/default-avatar.jpg")
                                                }
                                                alt="채널 아바타"
                                                className="channel-avatar"
                                            />
                                            <span className="channel-name">
                                                {post.channelName}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 게시물 내용 */}
                                    <div className="post-content">
                                        {post.image && (
                                            <img
                                                src={post.image}
                                                alt="게시물 이미지"
                                                className="content-image"
                                            />
                                        )}
                                        <p className="content-text">
                                            {post.contentText}
                                        </p>
                                    </div>

                                    {/* 좋아요/댓글 카운트 */}
                                    <div className="interaction-counts">
                                        <span
                                            className="like-count"
                                            onClick={() =>
                                                console.log(`Like clicked on ${post.id}`)
                                            }
                                        >
                                            ❤️ {post.likeCount}
                                        </span>
                                        <span
                                            className="comment-count"
                                            onClick={() =>
                                                console.log(`Comment clicked on ${post.id}`)
                                            }
                                        >
                                            💬 {post.commentCount}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h3>게시물이 없습니다.</h3>
                        )}
                    </div>
                )}

                {/* 리뷰 탭 */}
                {activeTab === "리뷰" && (
                    <div className="review-list">
                        <h3>리뷰</h3>
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div className="review" key={review.id}>
                                    <h3>{review.author}</h3>
                                    <p>드라마: {review.dramaTitle || "제목 없음"}</p>
                                    <p>
                                        평점: {"★".repeat(review.rating) +
                                            "☆".repeat(5 - review.rating)}
                                    </p>
                                    <p>{review.content}</p>
                                </div>
                            ))
                        ) : (
                            <p>등록된 리뷰가 없습니다.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
