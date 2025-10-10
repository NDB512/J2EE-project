// src/Layout/Doctor/Sidebar.jsx
import React from "react";
import {
  IconHeartbeat,
  IconLayoutGrid,
  IconMoodHeart,
  IconCalendarCheck,
} from "@tabler/icons-react";
import { Avatar, Text } from "@mantine/core";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../Content/AuthContext";

// Cấu hình menu cho doctor
const doctorLinks = [
    { name: "Bảng điều khiển", href: "/doctor/dashboard", icon: <IconLayoutGrid size={20} /> },
    { name: "Bệnh nhân", href: "/doctor/patients", icon: <IconMoodHeart size={20} /> },
    { name: "Cuộc hẹn", href: "/doctor/appointments", icon: <IconCalendarCheck size={20} /> },
];

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 h-screen bg-red-100 flex flex-col justify-between py-6 border-r border-red-300">
        {/* --- Logo + User Info --- */}
        <div className="flex flex-col gap-8 items-center">
            {/* Logo */}
            <div className="text-red-600 flex gap-2 items-center">
                <IconHeartbeat size={36} stroke={2.5} />
                <span className="font-serif font-bold text-2xl">NDB</span>
            </div>

            {/* Avatar + Tên */}
            <div className="flex flex-col items-center gap-2">
                <div className="p-1 bg-white rounded-full shadow">
                    <Avatar
                    variant="filled"
                    size={48}
                    src={user?.avatar || "/vite.svg"}
                    alt="User Avatar"
                    />
                </div>

                <div className="text-center">
                    <h1 className="font-semibold text-lg text-neutral-900">
                    {user?.name || "Bác sĩ"}
                    </h1>
                    <Text c="dimmed" size="xs" className="capitalize">
                    {user?.role || "doctor"}
                    </Text>
                </div>
            </div>
        </div>

        {/* --- Menu điều hướng --- */}
        <nav className="flex flex-col gap-2 px-4 mt-6">
            {doctorLinks.map((link, index) => (
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
