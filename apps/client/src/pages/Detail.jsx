import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import axios from "axios";
import YouTube from "react-youtube"; // YouTube 트레일러 표시
import '../styles/Detail.css'

const API_KEY = "d935fbb42d754c0a19e3c947ea1e3a93";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500/";

export default function Detail() {
    const { state } = useLocation(); // state로 전달된 데이터
    const [details, setDetails] = useState(null); // 드라마 세부 정보
    const [trailer, setTrailer] = useState(""); // 트레일러 ID
    const [highlights, setHighlights] = useState([]);
    const [cast, setCast] = useState([]); // 출연진 데이터
    const [reviews, setReviews] = useState([]); // 사용자 리뷰
    const [newReview, setNewReview] = useState(""); // 새 리뷰 입력 값
    const [showInfo, setShowInfo] = useState(false);
    const [crew, setCrew] = useState([]); // 제작진 정보
    const [ottProviders, setOTTProviders] = useState([]); // OTT 제공자 상태
    const [isFavorite, setIsFavorite] = useState(false); // 찜 상태 관리
    const playerRef = useRef(null); // 유튜브 플레이어 레퍼런스

    const toggleFavorite = () => {
        setIsFavorite((prev) => !prev); // 상태를 토글
    };


    const fetchOTTProviders = async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/tv/${id}/watch/providers`, {
                params: { api_key: API_KEY },
            });
    
            const providers = response.data.results.KR; // 한국 지역 OTT 정보 가져오기
            if (providers && providers.flatrate) {
                setOTTProviders(providers.flatrate); // 사용 가능한 OTT 데이터 저장
            } else {
                setOTTProviders([]); // OTT 데이터가 없을 경우 빈 배열
            }
        } catch (error) {
            console.error("Error fetching OTT providers:", error);
            setOTTProviders([]); // 에러 발생 시 빈 데이터
        }
    };
    

    // 드라마 세부 정보 가져오기
    const fetchDetails = async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/tv/${id}`, {
                params: { api_key: API_KEY, language: "ko-KR" },
            });
            setDetails(response.data);
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    };

    // 트레일러 정보 가져오기
    const fetchTrailer = async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/tv/${id}/videos`, {
                params: { api_key: API_KEY, language: "ko-KR" },
            });

            // 한국어 트레일러 및 티저 찾기
            let trailerVideo = response.data.results.find(
                (video) =>
                    (video.type === "Trailer" || video.type === "Teaser") &&
                    video.iso_639_1 === "ko"
            );

            // 한국어 트레일러가 없으면 기본 영어 버전을 찾기
            if (!trailerVideo) {
                const fallbackResponse = await axios.get(`${BASE_URL}/tv/${id}/videos`, {
                    params: { api_key: API_KEY, language: "en-US" },
                });
                trailerVideo = fallbackResponse.data.results.find(
                    (video) =>
                        video.type === "Trailer" || video.type === "Teaser"
                );
            }

            // 트레일러 ID 설정
            if (trailerVideo) {
                setTrailer(trailerVideo.key);
            } else {
                setTrailer(null); // 영상이 없는 경우
            }
        } catch (error) {
            console.error("Error fetching trailer:", error);
        }
    };

    const onPlayerReady = (event) => {
        playerRef.current = event.target; // 유튜브 플레이어 인스턴스 저장
    };

    const handleTrailerClick = (event) => {
        // 클릭이 찜 버튼에서 발생한 경우 전체화면을 막음
        if (event.target.closest(".favorite-button")) {
            return; // 찜 버튼 클릭 시에는 아무 동작도 하지 않음
        }
    
        if (playerRef.current) {
            playerRef.current.playVideo(); // 클릭 시 영상 재생
            const iframe = playerRef.current.getIframe();
            iframe.requestFullscreen(); // 전체 화면 모드로 전환
        }
    };
    

    const onStateChange = (event) => {
        if (event.data === 0) {
            console.log("영상이 끝났습니다."); // 재생 종료 시 추가 작업 가능
        }
    };


    // 출연진, 제작진 정보 가져오기
    const fetchCastAndCrew = async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/tv/${id}/credits`, {
                params: { api_key: API_KEY, language: "ko-KR" },
            });
            setCast(response.data.cast);
    
            // 제작진 정보 중 주요 인물만 필터링
            const filteredCrew = response.data.crew.filter(
                (member) =>
                    member.job === "Director" ||
                    member.job === "Executive Producer" ||
                    member.job === "Writer"
            );
            setCrew(filteredCrew);
        } catch (error) {
            console.error("Error fetching cast and crew:", error);
        }
    };

    const fetchHighlight = async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/tv/${id}/videos`, {
                params: { api_key: API_KEY, language: "ko-KR" },
            });
            
            let highlightVideos = response.data.results.filter(
                (video) => 
                (video.type === "Clip" || video.type === "Featurette") && 
                video.iso_639_1 === "ko"
            );
            
            if (highlightVideos.length === 0) {
                const fallbackResponse = await axios.get(`${BASE_URL}/tv/${id}/videos`, {
                params: { api_key: API_KEY, language: "en-US" },
                });
                highlightVideos = fallbackResponse.data.results.filter(
                (video) => video.type === "Clip" || video.type === "Featurette"
                );
            }
            
            setHighlights(highlightVideos);
        } catch (error) {
            console.error("Error fetching highlights:", error);
        }
    };

    // 모든 데이터를 가져오는 함수
    const fetchAllData = async () => {
        await fetchDetails(state.id);
        await fetchTrailer(state.id);
        await fetchHighlight(state.id);
        await fetchCastAndCrew(state.id);
    };

    // 컴포넌트 마운트 시 데이터 가져오기
    useEffect(() => {
        fetchAllData();
        fetchOTTProviders(state.id);
        window.scrollTo(0, 0);
    }, [state.id]);

    // 새 리뷰 추가
    const handleAddReview = () => {
        if (newReview.content.trim() === "" || newReview.rating === 0) return; // 내용과 별점이 모두 입력되어야 함
        const newReviewObj = {
            id: Date.now(),
            author: "익명",
            content: newReview.content,
            rating: newReview.rating,
        };
        setReviews((prev) => [...prev, newReviewObj]);
        setNewReview({ content: "", rating: 0, hoverRating: 0 }); // 입력 필드 초기화
    };

    const handleStarClick = (rating) => {
        setNewReview((prev) => ({ ...prev, rating: prev.rating === rating ? 0 : rating }));
    };

    const handleMouseEnter = (rating) => {
        setNewReview((prev) => ({ ...prev, hoverRating: rating }));
    };

    const handleMouseLeave = () => {
        setNewReview((prev) => ({ ...prev, hoverRating: 0 }));
    };



    return (
        <div className="page-container">
            {/* 상단 배너 */}
            {trailer ? (
                <div className="trailer-banner" onClick={handleTrailerClick}>
                    <YouTube
                        videoId={trailer}
                        className="trailer-video"
                        opts={{
                            width: "100%",
                            height: "450px",
                            playerVars: { autoplay: 1, mute: 1 }, // 자동 재생 및 음소거
                        }}
                        onReady={onPlayerReady}
                        onStateChange={onStateChange}
                    />
                    <div className="overlay">
                        <div className="title-info">
                            <h1>{details.name || details.original_name}</h1>
                            <p>
                                <strong>☆</strong> {details.vote_average}
                            </p>
                            <p>
                            <button
                                onClick={toggleFavorite}
                                className={`favorite-button ${isFavorite ? 'active' : ''}`}
                                >
                                {isFavorite ? "⚑" : "⚐"}
                                </button>
                                <span className="favorite-text">찜</span>
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                details && (
                    <div
                        className="trailer-placeholder"
                        style={{
                            backgroundImage: `url(${IMG_BASE_URL}${details.backdrop_path})`,
                            backgroundSize: "cover",
                            height: "450px",
                        }}
                    ></div>
                )
            )}


            {/* OTT 플랫폼 */}
            <div className="ott-section">
                <h2>OTT 플랫폼</h2>
                <div className="ott-links">
                    {ottProviders.length > 0 ? (
                        ottProviders.map((provider, index) => (
                            <div key={index} className="ott-item">
                                <div className="ott-info">
                                    <p>{provider.provider_name}</p> {/* TMDB에서 제공하는 플랫폼 이름 */}
                                </div>
                                <button
                                    className="ott-button"
                                    onClick={() => window.open(provider.link, "_blank")}
                                >
                                    보러가기
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>OTT 플랫폼 정보가 없습니다.</p>
                    )}
                </div>
            </div>



            {/* 드라마 정보 토글 버튼 */}
             <div className="toggle-info-section">
                 <span className="toggle-info-text">드라마 정보</span>
                 <button 
                    className="toggle-info-button" 
                    onClick={() => setShowInfo(!showInfo)}
                    aria-label={showInfo ? "정보 닫기" : "정보 열기"}>
                    {showInfo ? "△" : "▽"}
                </button>
            </div>

            {/* 드라마 정보 */}
            {showInfo && details && (
                <div className="drama-info">
                    <p>
                        <strong>편성:</strong>{" "}
                        {details.networks && details.networks.length > 0
                            ? details.networks.map((network) => network.name).join(", ")
                            : "정보 없음"}
                    </p>
                    <p>
                        <strong>방영일:</strong>{" "}
                        {details.first_air_date
                            ? details.last_air_date && details.last_air_date !== details.first_air_date
                                ? `${details.first_air_date} ~ ${details.last_air_date}` // 시작일 ~ 종료일
                                : `${details.first_air_date} (방영 중)` // 시작일만 표시, 방영 중 표시
                            : "정보 없음"}
                    </p>


                    <p>
                        <strong>장르:</strong>{" "}
                        {details.genres && details.genres.length > 0
                            ? details.genres.map((genre) => genre.name).join(", ")
                            : "정보 없음"}
                    </p>
                    <p>
                        <strong>소개:</strong> {details.overview || "정보 없음"}
                    </p>
                    <p>
                        <strong>제작사:</strong>{" "}
                        {details.production_companies && details.production_companies.length > 0
                            ? details.production_companies.map((company) => company.name).join(", ")
                            : "정보 없음"}
                    </p>
                    <p>
                        <strong>제작진:</strong>
                    </p>
                    <ul>
                        {crew && crew.length > 0 ? (
                            crew.map((member) => (
                                <li key={member.credit_id}>
                                    {member.name} ({member.job})
                                </li>
                            ))
                        ) : (
                            <li>제작진 정보가 없습니다.</li>
                        )}
                    </ul>
                </div>
            )}

            {/* 출연진 */}
            <div className="drama-cast">
                <h2>출연진</h2>
                <div className="cast-slider">
                    {cast.length > 0 ? (
                        cast.map((member) => (
                            <Link to={`/actor/${member.id}`} key={member.id} className="cast-card">
                                <img
                                    className="cast-image"
                                    src={
                                        member.profile_path
                                            ? `${IMG_BASE_URL}${member.profile_path}`
                                            : "https://via.placeholder.com/100x100?text=No+Image"
                                    }
                                    alt={member.name}
                                />
                                <p className="cast-name">{member.name}</p>
                                <p className="cast-character">
                                    {member.character || "역할 정보 없음"}
                                </p>
                            </Link>
                        ))
                    ) : (
                        <p>출연진 정보가 없습니다.</p>
                    )}
                </div>
            </div>

            {/* 하이라이트 */}
            <div className="highlights-section">
                <h2>하이라이트</h2>
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={4}
                    navigation
                    className="highlights-swiper"
                >
                    {highlights.map((video) => (
                        <SwiperSlide key={video.key}>
                            <div className="highlight-video">
                                <YouTube
                                    videoId={video.key}
                                    opts={{
                                        width: '100%',
                                        height: '200',
                                        playerVars: {
                                            autoplay: 0,
                                        },
                                    }}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>


            {/* 리뷰 섹션 */}
            <div className="reviews-section">
                <h2>Reviews</h2>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div className="review" key={review.id}>
                            <h3>{review.author}</h3>
                            <p>평점: {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}</p>
                            <p>{review.content}</p>
                        </div>
                    ))
                ) : (
                    <p>등록된 리뷰가 없습니다.</p>
                )}

                <div className="add-review">
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={
                                    newReview.hoverRating >= star || newReview.rating >= star
                                        ? "star selected"
                                        : "star"
                                }
                                onClick={() => handleStarClick(star)}
                                onMouseEnter={() => handleMouseEnter(star)}
                                onMouseLeave={handleMouseLeave}
                                role="button"
                                aria-label={`${star}점 선택`}
                            >
                                {newReview.hoverRating >= star || newReview.rating >= star
                                    ? "★"
                                    : "☆"}
                            </span>
                        ))}
                    </div>
                    <textarea
                        placeholder="리뷰를 작성해주세요..."
                        value={newReview.content}
                        onChange={(e) =>
                            setNewReview((prev) => ({ ...prev, content: e.target.value }))
                        }
                    />
                    <button onClick={handleAddReview}>리뷰 등록</button>
                </div>
            </div>
        </div>
    );
}