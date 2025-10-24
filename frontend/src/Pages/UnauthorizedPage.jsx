import React from "react";
import { Button } from "@mantine/core";
import { useAuth } from "../Content/AuthContext";
import { successNotification } from "../Utils/Notification";

const UnauthorizedPage = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    successNotification('Đăng xuất thành công!');
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-2">Không có quyền truy cập</h1>
        <p className="text-gray-600 mb-4">Bạn không được phép xem trang này.</p>
        <Button color="red" variant="filled" onClick={handleLogout}>
          Đăng xuất
        </Button>

    </div>
    );
};

export default UnauthorizedPage;
