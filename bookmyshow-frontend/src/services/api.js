import axios from 'axios';

// Create API client with the correct backend URL
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000, // 10 second timeout
    withCredentials: true // Include cookies in cross-site requests
});

// Add request interceptor for authentication
api.interceptors.request.use(
    (config) => {
        // Add auth token to requests if available
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error);
        
        // Handle network errors
        if (!error.response) {
            console.error('Network Error: Could not connect to the server');
            return Promise.reject({
                message: 'Could not connect to the server. Please check your internet connection or try again later.',
                originalError: error
            });
        }
        
        // Handle authentication errors
        if (error.response.status === 401) {
            console.error('Authentication Error: User not authenticated');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

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
export const getShowsByMovie = (movieId, date) => 
    api.get(`/shows/movie/${movieId}`, { params: { date } });
export const getShowsByTheater = (theaterId, date) => 
    api.get(`/shows/theater/${theaterId}`, { params: { date } });
export const getShowsByMovieAndTheater = (movieId, theaterId, date) => 
    api.get(`/shows/movie/${movieId}/theater/${theaterId}`, { params: { date } });

// Booking APIs
export const createBooking = (bookingData) => api.post('/bookings', bookingData);
export const getMyBookings = () => api.get('/bookings/me');
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);

// User APIs
export const updateUserProfile = (userData) => api.put('/auth/updatedetails', userData);
export const updatePassword = (data) => api.put('/auth/updatepassword', data);

export default api; 