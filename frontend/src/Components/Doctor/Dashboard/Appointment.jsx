import React from "react";
import { ScrollArea } from "@mantine/core";

const Appointments = () => {
    const appointments = [
        { id: 1, patient: "Nguyễn Văn A", doctor: "BS. Trần Thị B", time: "08:30", reason: "Khám tổng quát" },
        { id: 2, patient: "Lê Thị C", doctor: "BS. Nguyễn Hữu D", time: "09:15", reason: "Đau đầu, chóng mặt" },
        { id: 3, patient: "Phạm Văn E", doctor: "BS. Lê Thị F", time: "10:45", reason: "Khám da liễu" },
        { id: 4, patient: "Trần Thị G", doctor: "BS. Hoàng Minh H", time: "14:00", reason: "Tái khám tim mạch" },
        { id: 5, patient: "Lê Hồng I", doctor: "BS. Nguyễn Thị K", time: "15:30", reason: "Đau bụng nhẹ" },
        { id: 6, patient: "Phạm Anh L", doctor: "BS. Trần Văn M", time: "16:10", reason: "Khám nội tổng hợp" },
    ];

    const renderCard = (app) => (
        <div key={app.id} className="p-3 mb-3 border rounded-xl items-center border-l-4 border-violet-500 shadow-md flex justify-between bg-violet-50 hover:bg-violet-100 transition-all duration-200">
            <div>
                <div className="font-semibold">{app.patient}</div>
                {/* <div className="text-sm text-gray-500">{app.doctor}</div> */}
            </div>
            <div className="text-right">
                <div className="text-sm text-gray-500">{app.time}</div>
                <div className="text-sm text-gray-500">{app.reason}</div>
            </div>
        </div>
    );

    return (
        <div className="p-4 border rounded-xl bg-white shadow-xl flex flex-col gap-3">
            <div className="text-lg font-semibold">
                Cuộc hẹn hôm nay
            </div>

            <ScrollArea h={350} type="always" offsetScrollbars className="w-full">
                <div className="pr-2">{appointments.map(renderCard)}</div>
            </ScrollArea>
        </div>
    );
};

export default Appointments;
