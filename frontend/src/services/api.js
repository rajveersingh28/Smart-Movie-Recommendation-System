import axios from 'axios';

// Global Axios configuration pointed to your Flask instance
const API = axios.create({
    baseURL: 'http://127.0.0.1:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// 1. Authentication Endpoints
export const authAPI = {
    login: (credentials) => API.post('/auth/login', credentials),
    register: (userData) => API.post('/auth/register', userData)
};

// 2. Movie Information Endpoints
export const movieAPI = {
    getAll: () => API.get('/movies/'),
    getDetails: (id) => API.get(`/movies/${id}`)
};

// 3. Personal User Watchlist Endpoints
export const watchlistAPI = {
    get: (userId) => API.get(`/watchlist/${userId}`),
    add: (userId, movieId) => API.post('/watchlist/add', { user_id: userId, movie_id: movieId }),
    remove: (userId, movieId) => API.delete('/watchlist/remove', { data: { user_id: userId, movie_id: movieId } })
};

// 4. Smart Recommendation Analytics Endpoints
export const recommendationAPI = {
    get: (userId) => API.get(`/recommendations/${userId}`)
};

export default API;