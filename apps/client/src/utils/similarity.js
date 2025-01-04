import axios from "axios";

const API_KEY = "d935fbb42d754c0a19e3c947ea1e3a93";
const BASE_URL = "https://api.themoviedb.org/3";

// Fetch drama details
const fetchDramaDetails = async (id) => {
    const response = await axios.get(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=ko-KR`);
    return response.data;
};

// Calculate cosine similarity
export const cosineSimilarity = (featuresA, featuresB) => {
    const dotProduct = featuresA.genres.reduce((acc, genre) => acc + (featuresB.genres.includes(genre) ? 1 : 0), 0);
    const magnitudeA = Math.sqrt(featuresA.genres.length);
    const magnitudeB = Math.sqrt(featuresB.genres.length);
    return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
};

// Get recommended dramas
export const getRecommendedDramas = async (selectedDrama, allDramas) => {
    const selectedDetails = await fetchDramaDetails(selectedDrama.id);

    const selectedFeatures = {
        genres: selectedDetails.genres.map((genre) => genre.id),
        vote_average: selectedDetails.vote_average,
        popularity: selectedDetails.popularity,
    };

    const similarities = await Promise.all(
        allDramas.map(async (drama) => {
            const details = await fetchDramaDetails(drama.id);

            const features = {
                genres: details.genres.map((genre) => genre.id),
                vote_average: details.vote_average,
                popularity: details.popularity,
            };

            const similarity = cosineSimilarity(selectedFeatures, features);
            return { ...drama, similarity };
        })
    );

    return similarities.sort((a, b) => b.similarity - a.similarity);
};
