import axios from "axios";

const API_KEY = "d935fbb42d754c0a19e3c947ea1e3a93";
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchDramaDetails = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=ko-KR`);
        const creditsResponse = await axios.get(`${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}&language=ko-KR`);
        const details = response.data;
        const credits = creditsResponse.data;

        return {
            id: details.id,
            name: details.name,
            overview: details.overview || "",
            genres: details.genres.map((genre) => genre.id),
            vote_average: details.vote_average,
            popularity: details.popularity,
            cast: credits.cast.slice(0, 5).map((actor) => actor.name), // 주요 배우 5명
            crew: credits.crew
                .filter((member) => member.job === "Director")
                .map((director) => director.name), // 감독 이름
        };
    } catch (error) {
        console.error(`Error fetching details for drama ${id}:`, error);
        return null;
    }
};
