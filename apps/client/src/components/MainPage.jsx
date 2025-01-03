import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from "react-router-dom";
import '../styles/MainPage.css'

export const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500/";
const API_KEY = "d935fbb42d754c0a19e3c947ea1e3a93";
const BASE_URL = "https://api.themoviedb.org/3";


export default function MainPage() {
    const [dramas, setDramas] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchKoreanDramas(1);
    }, []);

    const fetchKoreanDramas = async (pageNum) => {
        if (loading || !hasMore) return;
        
        try {
            setLoading(true);
            const response = await fetch(
                `${BASE_URL}/discover/tv?api_key=${API_KEY}`
                + `&with_original_language=ko`
                + `&language=ko-KR`
                + `&with_genres=18`
                + `&sort_by=popularity.desc`
                + `&page=${pageNum}`
            );
            const data = await response.json();
            
            if (data && Array.isArray(data.results)) {
                if (pageNum === 1) {
                    setDramas(data.results);
                } else {
                    setDramas(prev => [...prev, ...data.results]);
                }
                
                // 더 이상 불러올 데이터가 없으면 hasMore를 false로 설정
                if (data.page >= data.total_pages) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error("Error fetching dramas:", error);
        } finally {
            setLoading(false);
        }
    };

    // 스크롤 이벤트 핸들러
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop
                >= document.documentElement.offsetHeight - 1000
            ) {
                if (!loading && hasMore) {
                    setPage(prev => prev + 1);
                    fetchKoreanDramas(page + 1);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [page, loading, hasMore]);

    const onClickDramaItem = (drama) => {
        navigate(`/drama/${drama.name}`, {
            state: drama
        });
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

            {/* 섹션 2: 인기순위 */}
            <div className="section">
                <h2>인기순위</h2>
                <Swiper
                    spaceBetween={10}
                    slidesPerView={5}
                    navigation
                    pagination={ false }
                    modules={[Navigation, Pagination, Autoplay]}
                    loop
                    className="swiper-container"
                >
                {dramas.slice(0, 10).map((item, index) => (
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

            
            <div className="app-container">
                {dramas.map((item) => (
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
    
            {loading && <div className="loading">Loading...</div>}
        </div>
    );
}