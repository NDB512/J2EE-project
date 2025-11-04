import React from 'react'
import { AreaChart } from '@mantine/charts';
import { ThemeIcon } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';
import { useAuth } from "../../../Content/AuthContext";

const TopCards = () => {
    const { getAppointmentCount, getMonthlyRegistrations } = useAuth();

    const [apData, setApData] = React.useState([]);
    const [patData, setPatData] = React.useState([]);
    const [docData, setDocData] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const appointments = await getAppointmentCount();
                setApData(appointments);

                const registrations = await getMonthlyRegistrations();

                // Gán dữ liệu
                setDocData(registrations.doctorCounts || []);
                setPatData(registrations.patientCounts || []);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };
        fetchData();
    }, [getAppointmentCount, getMonthlyRegistrations]);

    // Danh sách 12 tháng
    const allMonths = [
        { en: "January", vi: "Tháng 1" },
        { en: "February", vi: "Tháng 2" },
        { en: "March", vi: "Tháng 3" },
        { en: "April", vi: "Tháng 4" },
        { en: "May", vi: "Tháng 5" },
        { en: "June", vi: "Tháng 6" },
        { en: "July", vi: "Tháng 7" },
        { en: "August", vi: "Tháng 8" },
        { en: "September", vi: "Tháng 9" },
        { en: "October", vi: "Tháng 10" },
        { en: "November", vi: "Tháng 11" },
        { en: "December", vi: "Tháng 12" },
    ];

    // Tự động thêm tháng thiếu (count = 0)
    const fillMissingMonths = (data) => {
        return allMonths.map((month) => {
            const found = data.find((d) => d.month === month.en);
            return {
                month: month.en,
                monthVi: month.vi,
                count: found ? (found.count ?? found.visitCount ?? 0) : 0,
            };
        });
    };

    const getSum = (data) => data.reduce((total, item) => total + (item.count || item.visitCount || 0), 0);

    const card = (name, id, color, bg, icon, data) => {
        const filledData = fillMissingMonths(data);

        return (
            <div className={`${bg} rounded-xl`}>
                <div className="flex justify-between p-5 items-center gap-5">
                    <ThemeIcon className="!shadow-xl" size="xl" radius="md" color={color}>
                        {icon}
                    </ThemeIcon>
                    <div className="flex flex-col font-medium items-end">
                        <div>{name}</div>
                        <div>{getSum(filledData)}</div>
                    </div>
                </div>

                <AreaChart
                    h={200}
                    data={filledData.map((item) => ({
                        date: item.monthVi,
                        [name]: item.count || item.visitCount || 0,
                    }))}
                    style={{ minWidth: 0 }}
                    dataKey="date"
                    series={[{ name, color }]}
                    withGradient
                    fillOpacity={0.7}
                    curveType="bump"
                    tickLine="none"
                    gridAxis="none"
                />
            </div>
        );
    };

    const cards = [
        {
            name: "Cuộc hẹn",
            id: "appointments",
            color: "blue",
            bg: "bg-blue-100/20",
            icon: <IconPhoto />,
            data: apData,
        },
        {
            name: "Bệnh nhân",
            id: "patients",
            color: "green",
            bg: "bg-green-100/20",
            icon: <IconPhoto />,
            data: patData,
        },
        {
            name: "Bác sĩ",
            id: "doctors",
            color: "red",
            bg: "bg-red-100/20",
            icon: <IconPhoto />,
            data: docData,
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-5">
            {cards.map((cardData) =>
                card(
                cardData.name,
                cardData.id,
                cardData.color,
                cardData.bg,
                cardData.icon,
                cardData.data
                )
            )}
        </div>
    );
};

export default TopCards;
