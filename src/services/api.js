import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Movie APIs
export const getMovies = (params) => api.get('/movies', { params });
export const getMovieById = (id) => api.get(`/movies/${id}`);
export const getNowShowing = () => api.get('/movies/now-showing');
export const getComingSoon = () => api.get('/movies/coming-soon');

// Theater APIs
export const getTheaters = (params) => api.get('/theaters', { params });
export const getTheaterById = (id) => api.get(`/theaters/${id}`);
export const getTheatersByCity = (city) => api.get(`/theaters/city/${city}`);

// Show APIs
export const getShows = (params) => api.get('/shows', { params });
export const getShowById = (id) => api.get(`/shows/${id}`);
export const getShowsByMovieAndTheater = (movieId, theaterId, date) => 
    api.get(`/shows/movie/${movieId}/theater/${theaterId}`, { params: { date } });

// Booking APIs
export const createBooking = (bookingData) => api.post('/bookings', bookingData);
export const getBookings = () => api.get('/bookings');
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);

// User APIs
export const updateProfile = (userData) => api.put('/users/profile', userData);
export const getProfile = () => api.get('/users/profile');

export default api; 