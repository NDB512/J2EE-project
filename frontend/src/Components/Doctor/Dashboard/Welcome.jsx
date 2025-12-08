import { useAuth } from '../../../Content/AuthContext';
import React, { useState, useEffect } from 'react';
import { Avatar } from '@mantine/core';
import { IconCalendar, IconUserPlus, IconCash } from '@tabler/icons-react';

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

    const stats = [
        { label: 'Các cuộc hẹn', value: '7', color: 'from-blue-400 to-indigo-400', icon: <IconCalendar size={22} /> },
        { label: 'Bệnh nhân mới', value: '4', color: 'from-green-400 to-emerald-400', icon: <IconUserPlus size={22} /> },
    ];

    return (
        <div className="p-6 border shadow-md rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col gap-6 transition-all">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">
                        Chào mừng trở lại, <span className="text-indigo-600">{userName}</span>!
                    </h1>
                    <p className="text-sm text-gray-500">Chúc bạn một ngày làm việc hiệu quả</p>
                </div>
                <div className="rounded-full ring-4 ring-indigo-100 shadow-sm hover:scale-105 transition-transform duration-300">
                    <Avatar src={avatarSrc} size={100} alt="Avatar" />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-4 p-4 rounded-xl shadow-md bg-gradient-to-r ${item.color} text-white cursor-pointer transform hover:scale-105 transition duration-300`}
                    >
                        <div className="p-2 bg-white/30 rounded-lg">{item.icon}</div>
                        <div>
                            <div className="text-sm opacity-90">{item.label}</div>
                            <div className="text-lg font-semibold">{item.value}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Welcome;
