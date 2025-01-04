import React from "react";
import { IMG_BASE_URL } from "../constants";

export default function RecommendedDramas({ selectedDrama, recommendedDramas }) {
    return (
        <div className="recommended-dramas">
            <h2>추천 드라마: {selectedDrama.name}</h2>
            <div className="dramas-list">
                {recommendedDramas.map((item) => (
                    <div key={item.id} className="drama-container">
                        <img
                            src={`${IMG_BASE_URL}${item.poster_path}`}
                            alt={item.name}
                        />
                        <div className="drama-info">
                            <h4>{item.name}</h4>
                            <span>유사도: {item.similarity.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
