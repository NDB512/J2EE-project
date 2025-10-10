import { createContext, useContext, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuth, removeAuth } from "../Slices/AuthSlices";
import api from "../Utils/api";
import { successNotification, errorNotification } from "../Utils/Notification";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, accessToken, refreshToken } = useSelector((state) => state.auth);

    const decodeToken = (token) => {
        try {
            return jwtDecode(token);
        } catch {
            return null;
        }
    };

    // ✅ Login qua email + password
    const login = async (email, password) => {
        try {
            const res = await api.post("/user/login", { email, password });
            const data = res.data;

            if (data.accessToken && data.refreshToken) {
                // Decode JWT để lấy user info
                const decoded = decodeToken(data.accessToken);
                const userData = {
                    id: decoded?.id,
                    name: decoded?.name,
                    email: decoded?.email,
                    role: decoded?.role,
                };

                dispatch(setAuth({ ...data, user: userData }));
                successNotification("Đăng nhập thành công!");

                // Return data với user để component sử dụng (ví dụ redirect)
                return { ...data, user: userData, role: userData.role };
            }
        } catch (err) {
            errorNotification(err.response?.data?.message || "Đăng nhập thất bại!");
            throw err;
        }
    };

    // ✅ Login qua Google (sửa: không cần truyền user nữa, decode bên trong)
    const googleLogin = (accessToken, refreshToken, user) => { // Giữ param user cho tương thích, nhưng ưu tiên decode nếu cần
        const decoded = decodeToken(accessToken);
        const userData = user || {
            id: decoded?.id,
            name: decoded?.name,
            email: decoded?.email,
            role: decoded?.role,
        };

        dispatch(setAuth({ accessToken, refreshToken, user: userData }));
        successNotification("Đăng nhập Google thành công!");
    };

    // ✅ Hàm thêm mới — lưu token & user (dùng khi đăng ký)
    const saveLoginData = (accessToken, refreshToken, user) => { // Tương tự, ưu tiên decode
        const decoded = decodeToken(accessToken);
        const userData = user || {
            id: decoded?.id,
            name: decoded?.name,
            email: decoded?.email,
            role: decoded?.role,
        };

        dispatch(setAuth({ accessToken, refreshToken, user: userData }));
        successNotification("Đăng ký thành công!");
    };

    // ✅ Logout
    const logout = useCallback(() => {
        dispatch(removeAuth());
        navigate("/login", { replace: true });
    }, [dispatch, navigate]);

    // ✅ Refresh token
    const refresh = useCallback(async () => {
        try {
            if (!refreshToken) return logout();
            const res = await api.post("/user/refresh", { refreshToken });
            const data = res.data;

            if (data.accessToken) {
                // Decode new accessToken để cập nhật user (nếu info thay đổi)
                const decoded = decodeToken(data.accessToken);
                const updatedUser = {
                    ...user,
                    id: decoded?.id,
                    name: decoded?.name,
                    email: decoded?.email,
                    role: decoded?.role,
                };

                dispatch(
                    setAuth({
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        user: updatedUser,
                    })
                );
                return data.accessToken;
            }
        } catch {
            logout();
        }
    }, [refreshToken, user, dispatch, logout]);

    // ✅ Auto refresh trước khi token hết hạn
    useEffect(() => {
        if (!accessToken) return;
        const decoded = decodeToken(accessToken);
        if (!decoded?.exp) return;

        const expiresIn = decoded.exp * 1000 - Date.now();
        if (expiresIn > 0) {
            const timeout = setTimeout(() => refresh(), expiresIn - 10000);
            return () => clearTimeout(timeout);
        }
    }, [accessToken, refresh]);

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                refreshToken,
                login,
                googleLogin,
                saveLoginData, // ✅ thêm vào context
                logout,
                refresh,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};