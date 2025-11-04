import React from "react";
import { AreaChart } from "@mantine/charts";
import { ThemeIcon } from "@mantine/core";
import { IconCalendarStats } from "@tabler/icons-react";
import { useAuth } from "../../../Content/AuthContext";

const Metrices = () => {
    const { user, getAppointmentCountByDoctor } = useAuth();
    const [chartData, setChartData] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
        try {
            const data = await getAppointmentCountByDoctor(user.profileId);
            console.log("Appointment Data:", data);

            // Danh sách 12 tháng tiếng Anh và tiếng Việt
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

            // Thêm các tháng còn thiếu
            const filledData = allMonths.map((m) => {
            const found = data.find((d) => d.month === m.en);
            return {
                month: m.en,
                monthVi: m.vi,
                visitCount: found ? found.visitCount : 0,
            };
            });

            setChartData(filledData);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu thống kê:", error);
        }
        };

        if (user?.profileId) fetchData();
    }, [user, getAppointmentCountByDoctor]);

    const getSum = (data) =>
        data.reduce((total, item) => total + (item.visitCount || 0), 0);

    return (
        <div className="bg-violet-50 rounded-xl border shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="flex justify-between p-5 items-center">
                <div className="flex items-center gap-3">
                    <ThemeIcon color="violet" size="lg" radius="md" className="!shadow-md">
                        <IconCalendarStats size={20} />
                    </ThemeIcon>
                    <div>
                        <div className="font-semibold text-violet-700">Các cuộc hẹn</div>
                        <div className="text-xs text-gray-500">Trong năm {new Date().getFullYear()}</div>
                    </div>
                </div>

                <div className="text-2xl font-semibold text-violet-700">
                    {getSum(chartData)}
                </div>
            </div>

            <AreaChart
                h={200}
                data={chartData.map((item) => ({
                    date: item.monthVi,
                    appointments: item.visitCount,
                }))}
                dataKey="date"
                series={[{ name: "appointments", color: "violet.6" }]}
                withGradient
                fillOpacity={0.7}
                curveType="bump"
                gridAxis="none"
                tickLine="none"
                style={{ minWidth: 0 }}
            />
        </div>
    );
};

export default Metrices;
