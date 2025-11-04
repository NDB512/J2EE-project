import React from 'react';
import { AreaChart } from '@mantine/charts';

const data = [
    { tháng: 'Tháng 1', bệnh_nhân: 34 },
    { tháng: 'Tháng 2', bệnh_nhân: 45 },
    { tháng: 'Tháng 3', bệnh_nhân: 31 },
    { tháng: 'Tháng 4', bệnh_nhân: 50 },
];

const PatientMetrices = () => {
    // Hàm tính tổng số bệnh nhân
    const getSum = (data, key) => data.reduce((tổng, item) => tổng + item[key], 0);

    return (
        <div className="bg-violet-50 rounded-xl border">
        {/* Phần tiêu đề */}
        <div className="flex justify-between p-5 items-center">
            <div>
            <div className="font-semibold">Bệnh nhân</div>
            <div className="text-xs text-gray-500">Trong 4 tháng gần đây</div>
            </div>
            <div className="text-2xl font-semibold">{getSum(data, 'bệnh_nhân')}</div>
        </div>

        {/* Biểu đồ */}
        <AreaChart
            h={300}
            data={data}
            dataKey="tháng"
            series={[
            { name: 'bệnh_nhân', label: 'Số lượng bệnh nhân', color: '#F97316' },
            ]}
            curveType="monotone"
            withGradient
            fillOpacity={0.7}
            withXAxis
            withYAxis
            withTooltip
            tooltipAnimationDuration={200}
        />
        </div>
    );
};

export default PatientMetrices;
