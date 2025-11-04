// src/Layout/Patient/Sidebar.jsx
import React, {useEffect, useState} from "react";
import {
    IconHeartbeat,
    IconLayoutGrid,
    IconMoodHeart,
    IconCalendarCheck,
    IconVaccine,  
} from "@tabler/icons-react";
import { Avatar } from "@mantine/core";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../Content/AuthContext";

const Sidebar = ({ isOpen }) => {
    const { user, getMedia } = useAuth();

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

    // Các menu cố định cho bệnh nhân
    const links = [
        { name: "Trang chủ", href: "/patient/dashboard", icon: <IconLayoutGrid size={20} /> },
        { name: "Hồ sơ y tế", href: "/patient/profile", icon: <IconMoodHeart size={20} /> },
        { name: "Cuộc hẹn", href: "/patient/appointments", icon: <IconCalendarCheck size={20} /> },
        { name: "Nhà thuốc", href: "/patient/pharmacy", icon: <IconVaccine size={20} /> },
    ];

    if (!isOpen) return null;

    return (
        <aside className="w-64 h-screen bg-red-100 flex flex-col justify-between py-6 border-r border-red-300 overflow-y-auto">
            {/* --- Logo & thông tin người dùng --- */}
            <div className="flex flex-col gap-8 items-center">
                {/* Logo */}
                <div className="text-red-600 flex gap-2 items-center">
                    <IconHeartbeat size={36} stroke={2.5} />
                    <span className="font-serif font-bold text-2xl">NDB</span>
                </div>

                {/* Avatar & tên người dùng */}
                <div className="flex flex-col items-center gap-2">
                    <div className="p-1 bg-white rounded-full shadow">
                        <Avatar
                        variant="filled"
                        size={48}
                        src={avatarSrc}
                        alt="User Avatar"
                        />
                    </div>

                <h1 className="font-semibold text-lg text-neutral-900">
                    {user?.name || "Khách"}
                </h1>
                </div>
            </div>

            {/* --- Menu điều hướng --- */}
            <nav className="flex flex-col gap-2 px-4 mt-6">
                {links.map((link, index) => (
                <NavLink
                    key={index}
                    to={link.href}
                    className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition-all duration-150
                    ${
                        isActive
                        ? "bg-red-500 text-white shadow"
                        : "text-gray-700 hover:bg-red-300 hover:text-white"
                    }`
                    }
                >
                    {link.icon}
                    <span>{link.name}</span>
                </NavLink>
                ))}
            </nav>

            {/* --- Footer nhỏ --- */}
            <div className="text-center text-xs text-gray-500 mt-auto pb-2">
                © 2025 NDB Health
            </div>
        </aside>
    );
};

export default Sidebar;
