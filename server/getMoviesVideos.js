const axios = require('axios');
const fs = require('fs');

const API_KEY = '384ddc2c708b14f435d05114858ca4ea';
const BASE_URL = 'https://api.themoviedb.org/3';

// Lấy danh sách video cho 1 phim
async function fetchVideos(tmdbID) {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${tmdbID}/videos`, {
            params: {
                api_key: API_KEY,
                language: 'en-US'
            }
        });
        // Lọc ra các video có type là "Trailer" hoặc "Teaser"
        const filteredVideos = response.data.results.filter(video => 
            video.type === 'Trailer' || video.type === 'Teaser'
        );
        return filteredVideos; // Trả về chỉ các video là Trailer/Teaser
    } catch (error) {
        console.warn(`❌ Không thể lấy video cho ID ${tmdbID}: ${error.message}`);
        return [];
    }
}

// Hàm xử lý toàn bộ và tạo file collection video
async function createVideoCollection() {
    const raw = fs.readFileSync('movies_with_custom_id.json', 'utf-8');
    const movies = JSON.parse(raw);

    const videoCollection = [];

    for (const movie of movies) {
        const customID = movie.id;
        const tmdbID = Number(customID.slice(-7));
        const videos = await fetchVideos(tmdbID);

        videoCollection.push({
            movie_id: tmdbID,
            custom_id: customID,
            title: movie.title,
            videos: videos
        });

        console.log(`🎬 ${movie.title} (${tmdbID}): có ${videos.length} video`);
    }

    fs.writeFileSync('video_collection.json', JSON.stringify(videoCollection, null, 2));
    console.log('✅ File "video_collection.json" đã được tạo!');
}

// Gọi hàm chính
createVideoCollection();
