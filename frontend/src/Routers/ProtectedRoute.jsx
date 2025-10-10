import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { accessToken, user } = useSelector((state) => state.auth);
    const location = useLocation();

    // Nếu chưa đăng nhập hoặc không có user info → chuyển đến trang login
    if (!accessToken || !user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Nếu có giới hạn role → kiểm tra xem role của user có hợp lệ không
    if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(user.role.toLowerCase())) {
        console.log('Debug: User role:', user.role, 'Allowed:', allowedRoles); // Thêm log để debug nếu cần
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;