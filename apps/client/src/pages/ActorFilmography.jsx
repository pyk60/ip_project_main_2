import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import '../styles/ActorFilmography.css';

const API_KEY = "d935fbb42d754c0a19e3c947ea1e3a93";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500/";

export default function ActorFilmography() {
    const { id } = useParams();
    const [actorDetails, setActorDetails] = useState(null);
    const [filmography, setFilmography] = useState([]);

    useEffect(() => {
        const fetchActorDetails = async () => {
            try {
                // 한국어로 배우 정보 가져오기
                const korResponse = await fetch(
                `${BASE_URL}/person/${id}?api_key=${API_KEY}&language=ko-KR`
                );
                const korData = await korResponse.json();
                
                // 영어로 약력 정보 가져오기
                const engResponse = await fetch(
                `${BASE_URL}/person/${id}?api_key=${API_KEY}&language=en-US`
                );
                const engData = await engResponse.json();
                
                // 한국어 이름과 영어 약력을 합친 데이터 설정
                setActorDetails({
                ...engData,
                name: korData.name,
                place_of_birth: korData.place_of_birth
                });
            } catch (error) {
                console.error("Error:", error);
            }
        };
    
        const fetchFilmography = async () => {
            try {
                const response = await fetch(
                `${BASE_URL}/person/${id}/combined_credits?api_key=${API_KEY}&language=ko-KR`
                );
                const data = await response.json();
                setFilmography(data.cast);
            } catch (error) {
                console.error("Error fetching filmography:", error);
            }
        };
    
        fetchActorDetails();
        fetchFilmography();
    }, [id]);

    if (!actorDetails) return <div>로딩중...</div>;
    

    return (
        <div className="actor-profile">
            <div className="actor-info">
                <img 
                src={`${IMG_BASE_URL}${actorDetails?.profile_path}`} 
                alt={actorDetails?.name}
                />
                <div className="actor-details">
                <h1>{actorDetails?.name}</h1>
                <p>생년월일: {actorDetails?.birthday}</p>
                <p>출생지: {actorDetails?.place_of_birth}</p>
                <div className="biography">
                    <h3>약력</h3>
                    <p>{actorDetails?.biography}</p>
                </div>
                </div>
            </div>
        
            <div className="filmography">
                <h2>출연작</h2>
                <div className="works-grid">
                {filmography.map(work => (
                    <div key={work.id} className="work-item">
                    <img 
                        src={`${IMG_BASE_URL}${work.poster_path}`} 
                        alt={work.title || work.name}
                    />
                    <h3>{work.title || work.name}</h3>
                    <p className="character">{work.character}</p>
                    <p className="release-date">
                        {work.first_air_date || work.release_date}
                    </p>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}