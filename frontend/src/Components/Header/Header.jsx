// src/Components/Header/Header.jsx
import React from 'react';
import { ActionIcon, Button } from '@mantine/core';
import { IconBellRinging, IconLayoutSidebarLeftCollapse } from '@tabler/icons-react';
import ProfileMenu from './ProfileMenu';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Content/AuthContext';
import { successNotification } from '../../Utils/Notification';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    successNotification('Đăng xuất thành công!');
  };

  return (
    <div className="bg-cyan-100 shadow-lg w-full h-16 flex items-center px-5 justify-between sticky top-0 z-50">
      {/* Nút mở/đóng Sidebar */}
      <ActionIcon
        variant="light"
        aria-label="Toggle sidebar"
        size="lg"
        color="cyan"
        onClick={toggleSidebar}
      >
        <IconLayoutSidebarLeftCollapse
          style={{ width: '90%', height: '90%' }}
          stroke={1.5}
        />
      </ActionIcon>

      <div className="flex gap-5 items-center">
        {!user ? (
          <Link to="/login">
            <Button>Đăng nhập</Button>
          </Link>
        ) : (
          // Nếu đã đăng nhập thì hiện nút đăng xuất
          <Button color="red" variant="filled" onClick={handleLogout}>
            Đăng xuất
          </Button>
        )}

        <ActionIcon variant="light" aria-label="Notifications" size="md" color="cyan">
          <IconBellRinging style={{ width: '90%', height: '90%' }} stroke={1.5} />
        </ActionIcon>

        <ProfileMenu />
      </div>
    </div>
  );
};

export default Header;
