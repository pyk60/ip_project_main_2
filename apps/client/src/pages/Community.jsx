import React, { useState } from "react";
import "../styles/Community.css";
import { useFollow } from "./FollowContext";
import { usePostsContext } from "../context/PostContext";

function Community() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [posts, setPosts] = useState([
        {
            id: 1,
            channelName: "Channel Name",
            avatar: "../img/default-avatar.jpg",
            contentText: "아니 노란 우산 쓰고 달려오던 임솔...",
            likeCount: 5,
            commentCount: 28,
            comments: [],
            image: require("../img/post-image.png"),
            isFollowed: false,
        },
    ]);
    const [newPost, setNewPost] = useState({ title: "", content: "" });
    const [newImage, setNewImage] = useState(null); // 새 이미지 상태 추가
    const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기 상태 추가
    const [isFollowed, setIsFollowed] = useState(false);
    const { followingList } = useFollow();

    const { addFollowing } = useFollow();
    const { posts: contextPosts, addPost } = usePostsContext(); // Context에서 posts와 addPost 가져오기

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleFollow = (postId, user) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId
                    ? { ...post, isFollowed: !post.isFollowed }
                    : post
            )
        );
    
        // 중복 방지: 이미 팔로우된 사용자인지 확인 후 추가
        if (!followingList.some((item) => item.name === user.name)) {
            addFollowing(user); // 올바르게 사용자 정보 추가
        }
    };
    
    
    // 좋아요 클릭 시 숫자 증가
    const handleLike = (postId) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId ? { ...post, likeCount: post.likeCount + 1 } : post
            )
        );
    };
    

    // 댓글 입력 토글
    const handleCommentInputToggle = (postId) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId
                    ? { ...post, showCommentInput: !post.showCommentInput }
                    : post
            )
        );
    };
    
    

    // 댓글 추가
    const handleAddComment = (postId, commentText) => {
        if (!commentText.trim()) return; // 빈 댓글 방지
    
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId
                    ? {
                          ...post,
                          comments: [...post.comments, { username: "익명", text: commentText }],
                          commentCount: post.commentCount + 1,
                      }
                    : post
            )
        );
    };
    
    
    

    // 이미지 파일 선택 시 처리
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // 미리보기 이미지 설정
            };
            reader.readAsDataURL(file); // 파일을 base64로 읽어들임
            setNewImage(file); // 선택된 파일 상태 설정
        }
    };

    // 새 글 추가
    const handlePostSubmit = () => {
        const contentText = newPost.content || ""; // newPost.content를 참조
        if (!contentText.trim()) {
            alert("내용을 입력하세요.");
            return;
        }

        const newPostData = {
            id: Date.now(),
            channelName: "New Channel Name",
            avatar: require("../img/default-avatar.jpg"),
            contentText: contentText, // contentText 사용
            likeCount: 0,
            commentCount: 0,
            comments: [],
            image: newImage ? URL.createObjectURL(newImage) : null, // 새 이미지가 없을 경우 null로 설정
        };

        addPost(newPostData); // Context에 새 게시물 추가
        setNewPost({ title: "", content: "" }); // 입력창 초기화
        setNewImage(null); // 이미지 초기화
        setImagePreview(null); // 미리보기 초기화
        handleCloseModal(); // 모달 닫기
    };

    return (
        <div className="community-container">
            {[...posts, ...contextPosts].map((post) => ( // 기존 게시물과 새 게시물 병합
                <div className="post" key={post.id}>
                    <div className="channel-info">
                        <div className="channel-profile">
                            <img
                                src={require("../img/default-avatar.jpg")}
                                alt="Channel"
                                className="channel-avatar"
                            />
                            <span className="channel-name">{post.channelName}</span>
                        </div>
                        <button
                            className={`follow-btn ${post.isFollowed ? "followed" : ""}`}
                            onClick={() =>
                                handleFollow(post.id, {
                                    name: post.channelName,
                                    avatar: post.avatar || "https://via.placeholder.com/100", // 기본값 설정
                                })
                            }
                        >
                            {post.isFollowed ? "Unfollow" : "Follow"}
                        </button>
                    </div>

                    {/* 게시물 내용 */}
                    <div className="post-content">
                        {post.image && (
                            <img
                                src={post.image} // 새 이미지가 있을 경우 해당 이미지 보여주기
                                alt="Post content"
                                className="content-image"
                            />
                        )}
                        <p className="content-text">{post.contentText}</p>
                    </div>

                     {/* 좋아요/댓글 카운트 */}
                     <div className="interaction-counts">
                        <span className="like-count" onClick={() => handleLike(post.id)}>
                            ❤️ {post.likeCount}
                        </span>
                        <span className="comment-count" onClick={() => handleCommentInputToggle(post.id)}>
                            💬 {post.commentCount}
                        </span>
                    </div>

                    <div className="comments-section">
                        {post.showCommentInput && (
                            <div className="comment-input">
                                <textarea
                                    className="comment-textarea"
                                    placeholder="댓글을 입력하세요..."
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && e.target.value.trim()) {
                                            handleAddComment(post.id, e.target.value.trim());
                                            e.target.value = ""; // 입력창 초기화
                                        }
                                    }}
                                />
                            </div>
                        )}

                        <div className="comments-list">
                            {post.comments.map((comment, index) => (
                                <div key={index} className="comment-item">
                                    <strong>{comment.username}:</strong> {comment.text}
                                </div>
                            ))}
                        </div>
                    </div>


                </div>
            ))}

            <button className="post-create-btn" onClick={handleOpenModal}>
                <span className="material-icons">✏️</span>
            </button>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>새 글</h2>
                            <div className="modal-buttons">
                                <button className="control-btn" onClick={handleCloseModal}>
                                    ×
                                </button>
                            </div>
                        </div>
                        <div className="modal-body">
                            <textarea
                                className="modal-textarea"
                                placeholder="내용을 입력하세요"
                                value={newPost.content}
                                onChange={(e) =>
                                    setNewPost({ ...newPost, content: e.target.value })
                                }
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange} // 이미지 파일 변경 시 처리
                                className="modal-file-input"
                            />
                            {imagePreview && (
                                <div className="image-preview">
                                    <img src={imagePreview} alt="Preview" className="preview-img" />
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="submit-btn" onClick={handlePostSubmit}>
                                등록
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Community;
