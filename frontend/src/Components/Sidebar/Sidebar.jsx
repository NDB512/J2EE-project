import React from 'react'
import { IconHeartbeat, IconLayoutGrid, IconStethoscope, IconMoodHeart, IconCalendarCheck, IconVaccine, IconSettings } from '@tabler/icons-react'
import { Avatar, Text } from '@mantine/core'
import { NavLink } from 'react-router-dom'

const links = [
    { name: 'Bảng điều khiển', href: '/dashboard', icon: <IconLayoutGrid stroke={1.5} /> },
    { name: 'Bác sĩ', href: '/doctor', icon: <IconStethoscope stroke={1.5} /> },
    { name: 'Hồ sơ y tế gia đình', href: '/patients', icon: <IconMoodHeart stroke={1.5} /> },
    { name: 'Cuộc hẹn', href: '/appointments', icon: <IconCalendarCheck stroke={1.5} /> },
    { name: 'Nhà thuốc', href: '/pharmacy', icon: <IconVaccine stroke={1.5} /> },
]

const allLinks = {
    admin: [
        { name: 'Bảng điều khiển', href: '/dashboard', icon: <IconLayoutGrid /> },
        { name: 'Bác sĩ', href: '/doctor', icon: <IconStethoscope /> },
        { name: 'Hồ sơ y tế gia đình', href: '/patients', icon: <IconMoodHeart /> },
        { name: 'Cuộc hẹn', href: '/appointments', icon: <IconCalendarCheck /> },
        { name: 'Nhà thuốc', href: '/pharmacy', icon: <IconVaccine /> },
    ],
    doctor: [
        { name: 'Bảng điều khiển', href: '/dashboard', icon: <IconLayoutGrid /> },
        { name: 'Bệnh nhân', href: '/patients', icon: <IconMoodHeart /> },
        { name: 'Cuộc hẹn', href: '/appointments', icon: <IconCalendarCheck /> },
    ],
    pharmacy: [
        { name: 'Đơn thuốc', href: '/prescriptions', icon: <IconVaccine /> },
        { name: 'Kho thuốc', href: '/inventory', icon: <IconLayoutGrid /> },
    ]
}

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-red-200 flex flex-col justify-between py-6">
        {/* --- Phần trên --- */}
        <div className="flex flex-col gap-8 items-center">
            {/* Logo */}
            <div className="text-red-500 flex gap-1 items-center">
                <IconHeartbeat size={40} stroke={2.5} />
                <span className="font-serif font-bold text-3xl">NDB</span>
            </div>

            {/* Avatar + Tên */}
            <div className="flex flex-col items-center gap-2">
                <div className="p-1 bg-white rounded-full drop-shadow-xl">
                    <Avatar variant="filled" size={45} src="/vite.svg" />
                </div>

                <div className="text-center">
                    <h1 className="font-semibold text-lg text-neutral-900">NDB</h1>
                    <Text c="dimmed" size="xs">Vai trò</Text>
                </div>
            </div>
        </div>

        {/* --- Phần menu dưới --- */}
        <div className="flex flex-col flex-1 justify-between w-full px-3 mt-6">
            {/* Các link chính */}
            <div className="flex flex-col gap-2">
                {links.map((link, index) => (
                <NavLink
                    key={index}
                    to={link.href}
                    className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm
                    hover:bg-red-300 hover:text-white
                    ${isActive ? 'bg-red-500 text-white' : ''}`
                    }
                >
                    {link.icon && <span>{link.icon}</span>}
                    <span>{link.name}</span>
                </NavLink>
                ))}
            </div>

            {/* Nút cài đặt */}
            {/* <NavLink
                to="/settings"
                className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm
                hover:bg-red-300 hover:text-white
                ${isActive ? 'bg-red-500 text-white' : ''}`
                }
            >
                <IconSettings stroke={1.5} />
                <span>Cài đặt</span>
            </NavLink> */}
        </div>
    </div>
  )
}

export default Sidebar
