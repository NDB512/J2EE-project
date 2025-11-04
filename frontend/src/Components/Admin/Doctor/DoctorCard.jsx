import { Avatar, Divider } from "@mantine/core";
import React from "react";
import { IconMail, IconUserHeart,IconPhone, IconMapPin, IconBriefcase } from "@tabler/icons-react";

const DoctorCard = ({
    id,
    name,
    email,
    gender,
    phone,
    address,
    yearsOfExperience,
    specialization,
    department,
}) => {
    return (
        <div className="border p-4 flex flex-col hover:bg-green-50 transition duration-300 ease-in-out rounded-xl hover:shadow-[0_2px_10px_rgba(0,0,0,0.1)] !shawdow-green-500 cursor-pointer space-y-2">
            <div className="flex items-center gap-4 mb-4">
                {/* Avatar */}
                <Avatar size="lg" color="initial" radius="xl">
                    {name?.[0]?.toUpperCase()}
                </Avatar>

                {/* Thông tin */}
                <div className="flex flex-col">
                    {/* Tên + Giới tính */}
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg text-gray-800">{name}</span>
                        <span className="flex items-center gap-1 text-gray-600 text-sm">
                            <IconUserHeart size={14} className="text-pink-500" />
                            {gender}
                        </span>
                    </div>

                    {/* Chuyên khoa + Khoa */}
                    <div className="text-xs text-gray-500 mt-0.5">
                        {specialization} &bull; {department}
                    </div>
                </div>
            </div>

            <Divider size="sm"/>

            <div className="space-y-1 text-sm text-gray-700">
                <div className="flex items-center gap-2 text-xs">
                    <IconMail size={24} className="text-green-500 bg-white p-1 rounded-full" />
                    <span className="font-medium">{email || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <IconPhone size={24} className="text-green-500 bg-white p-1 rounded-full" />
                    <span className="font-medium">{phone || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <IconMapPin size={24} className="text-green-500 bg-white p-1 rounded-full" />
                    <span className="font-medium text-right">{address || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <IconBriefcase size={24} className="text-green-500 bg-white p-1 rounded-full" />
                    <span className="font-medium text-red-600">{yearsOfExperience || "—"} năm kinh nghiệm</span>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;
