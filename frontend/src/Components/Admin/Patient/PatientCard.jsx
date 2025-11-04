import { Avatar } from "@mantine/core";
import React from "react";
import { IconUserHeart } from "@tabler/icons-react";
import dayjs from "dayjs";
import { IconMail, IconPhone, IconMapPin } from "@tabler/icons-react";
import { Divider } from "@mantine/core";

const PatientCard = ({
    id,
    name,
    email,
    gender,
    phone,
    address,
    bloodType,
    dateOfBirth,
}) => {
    return (
        <div className="border p-4 flex flex-col hover:bg-green-50 transition duration-300 ease-in-out rounded-xl hover:shadow-[0_2px_10px_rgba(0,0,0,0.1)] !shawdow-green-500 cursor-pointer space-y-2">
            <div className="flex items-center gap-4 mb-4">
                <Avatar size="lg" color="green" radius="xl">
                    {name?.[0]?.toUpperCase()}
                </Avatar>
                <div className="flex flex-col">
                   <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg text-gray-800">{name}</span>
                        <span className="flex items-center gap-1 text-gray-600 text-sm">
                            <IconUserHeart size={14} className="text-pink-500" /> {gender}
                       </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                        {dayjs(dateOfBirth).format("DD-MM-YYYY")} &bull; {bloodType || "Nhóm máu không xác định"}
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
            </div>
        </div>
    );
};

export default PatientCard;
