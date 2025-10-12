import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// Hàm decode an toàn
const safeDecode = (token) => {
    try {
        return jwtDecode(token);
    } catch {
        return null;
    }
};

// Lấy dữ liệu từ localStorage (nếu có)
const storedAccess = localStorage.getItem("accessToken");
const storedRefresh = localStorage.getItem("refreshToken");
const storedUser = localStorage.getItem("user");

// Ưu tiên user từ localStorage, fallback sang decode
const initialUser = storedUser 
    ? JSON.parse(storedUser) 
    : storedAccess 
    ? {
        id: safeDecode(storedAccess)?.id,
        name: safeDecode(storedAccess)?.name,
        email: safeDecode(storedAccess)?.email,
        role: safeDecode(storedAccess)?.role,
        profileId: safeDecode(storedAccess)?.profileId,
    }
    : null;

// Trạng thái khởi tạo
const initialState = {
    accessToken: storedAccess || null,
    refreshToken: storedRefresh || null,
    user: initialUser,
    isAuthenticated: !!(storedAccess && initialUser),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action) => {
            const { accessToken, refreshToken, user } = action.payload || {};

            // Ưu tiên user từ payload, nếu không có thì decode token
            const decoded = safeDecode(accessToken);
            const finalUser = user || {
                id: decoded?.id,
                name: decoded?.name,
                email: decoded?.email,
                role: decoded?.role,
                profileId: decoded?.profileId,
            };

            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.user = finalUser;
            state.isAuthenticated = !!(accessToken && finalUser);

            // Lưu vào localStorage
            localStorage.setItem("accessToken", accessToken || "");
            localStorage.setItem("refreshToken", refreshToken || "");
            localStorage.setItem("user", JSON.stringify(finalUser || {}));
        },

        removeAuth: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.user = null;
            state.isAuthenticated = false;

            // Xóa chỉ các key liên quan auth (tránh clear toàn bộ localStorage)
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
        },
    },
});

export const { setAuth, removeAuth } = authSlice.actions;
export default authSlice.reducer;