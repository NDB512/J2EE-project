import { Menu, Button, Text, Avatar } from '@mantine/core';
import {
  IconSettings,
  IconMessageCircle,
  IconPhoto,
  IconSearch,
  IconTrash,
  IconArrowsLeftRight,
} from '@tabler/icons-react';
import { useAuth } from '../../Content/AuthContext';
import { useEffect, useState } from 'react';

const ProfileMenu = () => {
  const { user, getMedia } = useAuth();

  const userName = user?.name || user?.email?.split('@')[0] || 'Khách';

  const [avatarSrc, setAvatarSrc] = useState('/vite.svg');

  useEffect(() => {
      if (!user) return;
      const loadAvatar = async () => {
          try {
          if (user.profileImageUrlId) {
              const mediaData = await getMedia(user.profileImageUrlId);
              const blob = new Blob([mediaData], { type: 'image/jpeg' });
              const url = URL.createObjectURL(blob);
              setAvatarSrc(url);
          } else {
              setAvatarSrc('/vite.svg');
          }
          } catch (err) {
              console.error('Lỗi load avatar:', err);
              setAvatarSrc('/vite.svg');
              }
          };
          loadAvatar();
  }, [user]);

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <div className="flex items-center gap-3 cursor-pointer">
          <span className="font-medium text-lg text-neutral-900">{userName}</span>
          <Avatar variant="filled" size={45} src={avatarSrc} />
        </div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Tài khoản</Menu.Label>
        <Menu.Item leftSection={<IconSettings size={14} />}>Cài đặt</Menu.Item>
        <Menu.Item leftSection={<IconMessageCircle size={14} />}>Tin nhắn</Menu.Item>
        <Menu.Item leftSection={<IconPhoto size={14} />}>Ảnh của bạn</Menu.Item>
        <Menu.Item
          leftSection={<IconSearch size={14} />}
          rightSection={<Text size="xs" c="dimmed">⌘K</Text>}
        >
          Tìm kiếm
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Nguy hiểm</Menu.Label>
        <Menu.Item leftSection={<IconArrowsLeftRight size={14} />}>Chuyển dữ liệu</Menu.Item>
        <Menu.Item color="red" leftSection={<IconTrash size={14} />}>
          Xóa tài khoản
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileMenu;
