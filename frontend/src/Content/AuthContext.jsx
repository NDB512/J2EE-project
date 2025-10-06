import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load token từ localStorage lúc init
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        if (token && refreshToken) {
            setUser({ token, refreshToken });  // Hoặc decode token để lấy user info
        }
        setLoading(false);
    }, []);

    const login = (accessToken, refreshToken, userData) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setUser({ token: accessToken, refreshToken, ...userData });
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
    };

    const refresh = async () => {
        try {
            const res = await fetch('http://localhost:9000/user/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: user.refreshToken }),
            });
            const data = await res.json();
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                setUser(prev => ({ ...prev, token: data.accessToken, refreshToken: data.refreshToken }));
                return data.accessToken;
            }
        } catch (err) {
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refresh, loading }}>
            {children}
        </AuthContext.Provider>
    );
};