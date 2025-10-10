import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:9000',
});

// Interceptor request: Add token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;
            if (
            err.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/user/refresh')) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                const res = await axios.post('http://localhost:9000/user/refresh', { refreshToken });
                const data = res.data;
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
                } catch {
                localStorage.clear();
                window.location.href = '/login';
                }
            }
        }
        return Promise.reject(err);
    }
);

export default api;