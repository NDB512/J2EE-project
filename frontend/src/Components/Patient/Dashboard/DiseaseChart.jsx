import React from "react";
import { DonutChart } from "@mantine/charts";

const DiseaseChart = () => {
    // Dữ liệu mẫu cho biểu đồ tròn
    const diseaseData = [
        { name: "Cảm cúm", value: 40, color: "blue" },
        { name: "Sốt xuất huyết", value: 25, color: "red" },
        { name: "Viêm phổi", value: 20, color: "teal" },
        { name: "Covid-19", value: 15, color: "orange" },
    ];

    return (
        <div className="p-3 rounded-xl bg-green-50 shadow-xl flex flex-col gap-3">
            <div className="text-lg font-semibold">
                Phân bố các loại bệnh của bạn
            </div>
            <div className="flex justify-center">
                <DonutChart chartLabel={"Các bệnh"} thickness={25} withLabels paddingAngle={10} withLabelsLine labelsType="percent" data={diseaseData} size={200} />
            </div>
        </div>
    );
};

export default DiseaseChart;
