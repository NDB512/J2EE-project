import React from 'react';
import { ActionIcon, Button } from '@mantine/core';
import { IconBellRinging, IconLayoutSidebarLeftCollapse } from '@tabler/icons-react';
import ProfileMenu from './ProfileMenu';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="bg-cyan-100 shadow-lg w-full h-16 flex items-center px-5 justify-between">
      <ActionIcon variant="transparent" aria-label="Settings" size="lg">
        <IconLayoutSidebarLeftCollapse style={{ width: '90%', height: '90%' }} stroke={1.5} />
      </ActionIcon>

      <div className='flex gap-5 items-center'>
        <Link to={"/login"}>
            <Button>Đăng nhập</Button>
        </Link>

        <ActionIcon variant="transparent" aria-label="Settings" size="md">
            <IconBellRinging style={{ width: '90%', height: '90%' }} stroke={1.5} />
        </ActionIcon>

        <ProfileMenu />
      </div>
    </div>
  );
};

export default Header;
