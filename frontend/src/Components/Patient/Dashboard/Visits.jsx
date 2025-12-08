import React from 'react';
import { AreaChart } from '@mantine/charts';
import { useAuth } from "../../../Content/AuthContext";

const Visits = () => {
    const { getAppointmentCountByPatient, user } = useAuth();

    const [data, setData] = React.useState([]);

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

    // Fill tháng thiếu từ API
    const fillMonths = (apiData) => {
        return allMonths.map((m) => {
            const found = apiData.find((d) => d.month === m.en);
            return {
                tháng: m.vi,
                lần_khám: found ? found.visitCount : 0,
            };
        });
    };

    // Tổng số lần khám
    const getSum = (data) =>
        data.reduce((total, item) => total + item.lần_khám, 0);

    React.useEffect(() => {
        const loadData = async () => {
            try {
                const res = await getAppointmentCountByPatient(user.profileId);
                // res là array MonthlyVisitDto
                const formatted = fillMonths(res);
                setData(formatted);
            } catch (err) {
                console.error("Load visits error:", err);
            }
        };

        if (user?.id) loadData();
    }, [user]);

    return (
        <div className="bg-violet-50 rounded-xl border">
            
            {/* HEADER */}
            <div className="flex justify-between p-5 items-center">
                <div>
                    <div className="font-semibold">Các lần khám</div>
                    <div className="text-xs text-gray-500">
                        Trong năm nay
                    </div>
                </div>
                <div className="text-2xl font-semibold">
                    {getSum(data)}
                </div>
            </div>

            {/* CHART */}
            <AreaChart
                h={200}
                data={data}
                dataKey="tháng"
                series={[
                    { name: 'lần_khám', label: 'Số lần khám', color: '#7C3AED' },
                ]}
                curveType="monotone"
                withGradient
                fillOpacity={0.7}
                withTooltip
                tooltipAnimationDuration={200}
            />
        </div>
    );
};

export default Visits;
