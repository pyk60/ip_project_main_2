import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from "react-router-dom";
import '../styles/MainPage.css';
import { useTranslation } from "react-i18next";

export const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500/";
const API_KEY = "d935fbb42d754c0a19e3c947ea1e3a93";
const BASE_URL = "https://api.themoviedb.org/3";

export default function MainPage() {
    const { t, i18n } = useTranslation('mainpage'); // 번역 함수 가져오기
    const [dramas, setDramas] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();
    const [recommendedDramas, setRecommendedDramas] = useState([]);
    const [selectedDrama, setSelectedDrama] = useState(null);
    const [popularDramas, setPopularDramas] = useState([]); // 인기 드라마 상태
    
    

    // 중복 제거 함수
    const removeDuplicates = (dramas) => {
        const seen = new Set();
        return dramas.filter((drama) => {
            const duplicate = seen.has(drama.id);
            seen.add(drama.id);
            return !duplicate;
        });
    };

    // 드라마 데이터 가져오기
    const fetchKoreanDramas = async (pageNum) => {
        if (loading || !hasMore) return;
        try {
            setLoading(true);

            // 여러 페이지 데이터 요청
            const maxPagesToFetch = 3; // 원하는 페이지 수 조절 가능
            const fetchedDramas = [];
            for (let i = pageNum; i < pageNum + maxPagesToFetch; i++) {
                const response = await fetch(
                    `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_original_language=ko&language=ko-KR&with_genres=18&sort_by=popularity.desc&page=${i}`
                );
                const data = await response.json();
                if (data && Array.isArray(data.results)) {
                    fetchedDramas.push(...data.results);
                    if (data.page >= data.total_pages) {
                        setHasMore(false); // 더 이상 페이지가 없으면 종료
                        break;
                    }
                }
            }

            // 중복 제거 후 상태 업데이트
            setDramas((prev) => removeDuplicates([...prev, ...fetchedDramas]));
        } catch (error) {
            console.error("Error fetching dramas:", error);
        } finally {
            setLoading(false);
        }
    };

    // 인기 데이터 가져오기
    const fetchPopularDramas = async () => {
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        const formattedToday = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식
        const formattedOneYearAgo = oneYearAgo.toISOString().split('T')[0];
    
        try {
            setLoading(true);
            const response = await fetch(
                `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_original_language=ko&language=ko-KR&with_genres=18&sort_by=popularity.desc&first_air_date.gte=${formattedOneYearAgo}&first_air_date.lte=${formattedToday}&page=1`
            );
            const data = await response.json();
            if (data && Array.isArray(data.results)) {
                setPopularDramas(data.results); // 최근 인기 드라마만 저장
            }
        } catch (error) {
            console.error('Error fetching popular dramas:', error);
        } finally {
            setLoading(false);
        }
    };
    
    
    

    // 초기 드라마 데이터 로드
    useEffect(() => {
        fetchKoreanDramas(1); // 기존 드라마 데이터 로드
        fetchPopularDramas(); // 인기 드라마 데이터 로드
    }, []);

    // 추천 드라마 목록 업데이트
    useEffect(() => {
        if (dramas.length > 0) {
            if (!selectedDrama) {
                const firstDrama = dramas[0];
                setSelectedDrama(firstDrama);

                const recommendations = dramas
                    .filter((item) => item.id !== firstDrama.id)
                    .map((item) => ({
                        ...item,
                        similarity: calculateSimilarity(firstDrama, item),
                    }))
                    .sort((a, b) => b.similarity - a.similarity);

                setRecommendedDramas(removeDuplicates(recommendations));
            } else {
                const recommendations = dramas
                    .filter((item) => item.id !== selectedDrama.id)
                    .map((item) => ({
                        ...item,
                        similarity: calculateSimilarity(selectedDrama, item),
                    }))
                    .sort((a, b) => b.similarity - a.similarity);

                setRecommendedDramas(removeDuplicates(recommendations));
            }
        }
    }, [dramas, selectedDrama]);

    useEffect(() => {
        const savedDrama = localStorage.getItem("selectedDrama");
        if (savedDrama) {
            const parsedDrama = JSON.parse(savedDrama);
            setSelectedDrama(parsedDrama);
    
            // 추천 목록 업데이트
            const recommendations = dramas
                .filter((item) => item.id !== parsedDrama.id)
                .map((item) => ({
                    ...item,
                    similarity: calculateSimilarity(parsedDrama, item),
                }))
                .sort((a, b) => b.similarity - a.similarity);
    
            setRecommendedDramas(removeDuplicates(recommendations));
        }
    }, [dramas]);
    

    // 스크롤 이벤트로 추가 데이터 로드
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop
                >= document.documentElement.offsetHeight - 1000
            ) {
                if (!loading && hasMore) {
                    setPage((prev) => prev + 3);
                    fetchKoreanDramas(page);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [page, loading, hasMore]);

    // 유사도 계산 함수
    const calculateSimilarity = (dramaA, dramaB) => {
        const genresA = new Set(dramaA.genre_ids);
        const genresB = new Set(dramaB.genre_ids);
        const commonGenres = [...genresA].filter((genre) => genresB.has(genre));
        const ratingDiff = Math.abs(dramaA.vote_average - dramaB.vote_average);
        const genreSimilarity = commonGenres.length / Math.max(genresA.size, genresB.size);
        return genreSimilarity - ratingDiff * 0.1;
    };

    // 드라마 클릭 이벤트
    const onClickDramaItem = (drama) => {
        setSelectedDrama(drama);
    
        // 로컬 스토리지에 선택된 드라마 저장
        localStorage.setItem("selectedDrama", JSON.stringify(drama));
    
        const recommendations = dramas
            .map((item) => ({
                ...item,
                similarity: calculateSimilarity(drama, item),
            }))
            .sort((a, b) => b.similarity - a.similarity);

    
        setRecommendedDramas(removeDuplicates(recommendations));
    
        navigate(`/drama/${drama.name}`, { state: drama });
    };
    

    return (
        <div>
            <div className="main-image-slider">
                <Swiper
                    spaceBetween={30}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    modules={[Navigation, Pagination, Autoplay]}
                    loop
                    className="main-swiper-container"
                >
                    {dramas.slice(0, 5).map((drama) => (
                        <SwiperSlide key={drama.id}>
                            <img
                                src={`${IMG_BASE_URL}${drama.backdrop_path}`}
                                alt={drama.name}
                                className="main-slide-image"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="section">
                <h2>{t('popular_rank')}</h2>
                <Swiper
                    spaceBetween={10}
                    slidesPerView={5}
                    navigation
                    pagination={false}
                    modules={[Navigation, Pagination, Autoplay]}
                    loop
                    className="swiper-container"
                >
                    {popularDramas.slice(0, 10).map((item, index) => (
                        <SwiperSlide key={item.id}>
                            <div
                                className="rank-container"
                                onClick={() => onClickDramaItem(item)}
                            >
                                <span className="rank-number">{index + 1}</span>
                                <img
                                    src={IMG_BASE_URL + item.poster_path}
                                    alt={item.name}
                                />
                                <div className="drama-info">
                                    <h4>{item.name}</h4>
                                    <span>{item.vote_average.toFixed(1)}</span>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>


            {selectedDrama && recommendedDramas.length > 0 ? (
                <div className="recommendation-section">
                    <h2>{t('recommended_dramas')}</h2>
                    <div className="recommendation-list">
                        {recommendedDramas.map((item) => (
                            <div
                                key={item.id}
                                className="drama-container"
                                onClick={() => onClickDramaItem(item)}
                            >
                                <img
                                    src={IMG_BASE_URL + item.poster_path}
                                    alt={item.name}
                                />
                                <div className="drama-info">
                                    <h4>{item.name}</h4>
                                    <span>{item.vote_average.toFixed(1)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                !loading && <div className="no-recommendation">추천할 드라마가 없습니다.</div>
            )}

            {loading && <div className="loading">Loading...</div>}
        </div>
    );
}
