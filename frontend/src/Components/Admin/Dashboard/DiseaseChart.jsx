import React, { useEffect, useState } from "react";
import { DonutChart } from "@mantine/charts";
import { useAuth } from "../../../Content/AuthContext";

const DiseaseChart = () => {
    const { getReasonsCount } = useAuth();
    const [reasonData, setReasonData] = useState([]);

    useEffect(() => {
        const fetchReasons = async () => {
        try {
            const data = await getReasonsCount();
            setReasonData(data);
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
        };
        fetchReasons();
    }, [getReasonsCount]);

    // Danh sách màu tự động
    const colors = [
        "blue", "red", "teal", "orange", "grape", "cyan", "lime", "violet"
    ];

    // Chuyển dữ liệu API thành dữ liệu biểu đồ
    const diseaseData = reasonData.map((item, index) => ({
        name: item.reason,
        value: item.count,
        color: colors[index % colors.length],
    }));

    return (
        <div className="p-3 rounded-xl bg-green-50 shadow-xl flex flex-col gap-3">
            <div className="text-lg font-semibold">
                Phân bố các lý do khám bệnh phổ biến
            </div>
            <div className="flex justify-center">
                <DonutChart
                chartLabel={"Lý do khám"}
                thickness={25}
                withLabels
                withLabelsLine
                labelsType="percent"
                paddingAngle={10}
                data={diseaseData}
                size={200}
                />
            </div>
        </div>
    );
};

export default DiseaseChart;
