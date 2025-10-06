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

// Interceptor response: Refresh nếu 401
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        if (err.response?.status === 401 && !err.config._retry) {
            err.config._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const res = await fetch('/user/refresh', {  // Hoặc dùng api.post
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refreshToken }),
                    });
                    const data = await res.json();
                    localStorage.setItem('accessToken', data.accessToken);
                    localStorage.setItem('refreshToken', data.refreshToken);
                    err.config.headers.Authorization = `Bearer ${data.accessToken}`;
                    return api(err.config);  // Retry request
                } catch (refreshErr) {
                    localStorage.clear();
                    window.location.href = '/login';  // Redirect login
                }
            }
        }
        return Promise.reject(err);
    }
);

export default api;