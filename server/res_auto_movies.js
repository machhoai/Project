const axios = require('axios');
const fs = require('fs');  // Thêm fs module để ghi ra file JSON

// Đặt API Key của TMDB ở đây
const API_KEY = '384ddc2c708b14f435d05114858ca4ea';
const BASE_URL = 'https://api.themoviedb.org/3';

// Hàm lấy danh sách phim theo trang
async function fetchMovies(page) {
    try {
        const response = await axios.get(`${BASE_URL}/discover/movie`, {
            params: {
                api_key: API_KEY,
                page: page,
                language: 'vi-VN',
                sort_by: 'popularity.desc',
                include_adult: false,
                include_video: true,
                ['primary_release_date.gte']: '2024-01-01',
                ['primary_release_date.lte']: '2025-04-17',
                region: 'VN',
                // with_original_language: 'es|ko|ja|vi|cn|vn',
                ['vote_count.gte']: 50,
                // ['vote_average.gte']:5,
            }
        });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
}

// Hàm tạo ID phim theo yêu cầu
function generateCustomID(movie) {
    let genresID = '00000';  // Mặc định nếu không có genre

    if (Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0) {
        genresID = movie.genre_ids[0].toString().padStart(5, '0');
    }

    const tmdbID = movie.id.toString().padStart(7, '0');
    const customID = `MV${genresID}${tmdbID}`;
    return customID;
}

// Hàm xử lý và thêm custom ID vào từng movie
async function processMovies(totalPages = 10) {
    const allMovies = []; // Mảng lưu trữ tất cả phim có ID tùy chỉnh
    
    for (let page = 1; page <= totalPages; page++) {
        const movies = await fetchMovies(page);
        console.log(`Page ${page}:`);
        console.log(movies.lenght);  // In ra danh sách phim của trang hiện tại
        movies.forEach(movie => {
            // Bỏ qua phim không có genre_ids
            if (!Array.isArray(movie.genre_ids) || movie.genre_ids.length === 0) {
                console.warn(`❌ Bỏ qua phim không có genre_ids: "${movie.title}" (ID: ${movie.id})`);
                return; // skip
            }
        
            const customID = generateCustomID(movie);
            movie.id = customID; // Ghi đè ID gốc bằng custom ID
        
            allMovies.push(movie);
            console.log(`✅ Thay thế ID bằng Custom ID: ${customID}`);
        });
    }

    // Xuất tất cả movies ra file JSON
    fs.writeFileSync('movies_with_custom_id.json', JSON.stringify(allMovies, null, 2));
    console.log('Movies have been saved to "movies_with_custom_id.json".');
}

// Chạy tool và lấy 10 trang phim
processMovies(37);