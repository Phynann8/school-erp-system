import axios from 'axios';

const API_URL = 'http://localhost:5265/api'; // Backend port from launchSettings.json

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Add Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const campusId = localStorage.getItem('campusId');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (campusId) {
        config.headers['X-Campus-Id'] = campusId;
    }

    return config;
});

// Response Interceptor: Handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
