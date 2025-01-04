import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SearchResults.css';

const API_KEY = 'd935fbb42d754c0a19e3c947ea1e3a93';
const BASE_URL = 'https://api.themoviedb.org/3';

function SearchResults() {
    const { search } = useLocation(); // URL 쿼리 파라미터 가져오기
    const navigate = useNavigate();
    const query = new URLSearchParams(search).get('query'); // 'query' 파라미터 추출
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query) {
            fetchSearchResults(query);
        }
    }, [query]);

    const fetchSearchResults = async (query) => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/search/tv`, {
                params: { api_key: API_KEY, query, language: 'ko-KR' },
            });
            setResults(response.data.results);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
        setLoading(false);
    };

    const handleDetailNavigation = (id) => {
        navigate(`/detail`, { state: { id } }); // 디테일 페이지로 이동
    };

    return (
        <div className="search-results">
            <h2>"{query}"에 대한 검색 결과</h2>
            {loading ? (
                <p>검색 중...</p>
            ) : results.length > 0 ? (
                <div className="results-grid">
                    {results.map((result) => (
                        <div
                            key={result.id}
                            className="result-card"
                            onClick={() => handleDetailNavigation(result.id)}
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w500/${result.poster_path}`}
                                alt={result.name || '이미지 없음'}
                            />
                            <p className="result-title">{result.name || '제목 없음'}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>검색 결과가 없습니다.</p>
            )}
        </div>
    );
}

export default SearchResults;
