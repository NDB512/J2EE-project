import { useAuth } from '../../../Content/AuthContext';
import React, { useState, useEffect } from 'react';
import { Avatar } from '@mantine/core';

const Welcome = () => {
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
        <div className='p-5 border shadow-sm rounded-xl bg-blue-50 flex flex-col gap-3'>
            <div className="flex justify-between items-center">
                <div className="">
                    <h1 className="text-2xl font-semibold">Chào mừng trở lại, {userName}!</h1>
                </div>
                <Avatar variant="filled" src={avatarSrc} size={100} alt="Avatar" />
            </div>
            <div className="flex gap-5">
                <div className="p-3 rounded-xl bg-violet-200">
                    <div className="text-sm">Các cuộc hẹn</div>
                    <div className="text-lg font-semibold">51</div>
                </div>
            </div>
        </div>
    )
}

export default Welcome