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
                ['primary_release_date.gte']: '2025-04-17',
                ['primary_release_date.lte']: '2025-04-17'
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
    // console.log(movie.genre_ids[0]);  // Kiểm tra kiểu dữ liệu của genresID
    // console.log(typeof movie.genre_ids[0]);  // Kiểm tra kiểu dữ liệu của genresID
    const genresID = movie.genre_ids[0].toString().padStart(5, '0');  // Lấy genre_id đầu tiên và tạo thành chuỗi dài 5 ký tự
    const tmdbID = movie.id.toString().padStart(7, '0');  // Đảm bảo ID phim TMDB có đủ 7 chữ số

    // Cấu trúc ID theo yêu cầu
    const customID = `MV${genresID}${tmdbID}`;
    return customID;
}

// Hàm xử lý và thêm custom ID vào từng movie
async function processMovies(totalPages = 10) {
    const allMovies = []; // Mảng lưu trữ tất cả phim có ID tùy chỉnh
    
    for (let page = 1; page <= totalPages; page++) {
        const movies = await fetchMovies(2);
        console.log(`Page ${page}:`);
        console.log(movies.lenght);  // In ra danh sách phim của trang hiện tại
        movies.forEach(movie => {
            const customID = generateCustomID(movie);
            movie.custom_id = customID;  // Thêm custom_id vào movie
            allMovies.push(movie);  // Thêm movie vào mảng
            console.log(`Original TMDB ID: ${movie.id}, Custom ID: ${customID}`);
        });
    }

    // Xuất tất cả movies ra file JSON
    fs.writeFileSync('movies_with_custom_id.json', JSON.stringify(allMovies, null, 2));
    console.log('Movies have been saved to "movies_with_custom_id.json".');
}

// Chạy tool và lấy 10 trang phim
processMovies(10);