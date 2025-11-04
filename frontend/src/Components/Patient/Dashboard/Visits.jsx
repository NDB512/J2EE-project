import React from 'react';
import { AreaChart } from '@mantine/charts';

const data = [
    { ngày: '2024-10-01', lần_khám: 12 },
    { ngày: '2024-10-02', lần_khám: 19 },
    { ngày: '2024-10-03', lần_khám: 3 },
    { ngày: '2024-10-04', lần_khám: 5 },
    { ngày: '2024-10-05', lần_khám: 2 },
    { ngày: '2024-10-06', lần_khám: 3 },
    { ngày: '2024-10-07', lần_khám: 7 },
];

const Visits = () => {
    const getSum = (data, key) => data.reduce((tổng, item) => tổng + item[key], 0);

    return (
        <div className="bg-violet-50 rounded-xl border">
        {/* Tiêu đề */}
        <div className="flex justify-between p-5 items-center">
            <div>
            <div className="font-semibold">Các lần khám</div>
            <div className="text-xs text-gray-500">Trong 7 ngày qua</div>
            </div>
            <div className="text-2xl font-semibold">{getSum(data, 'lần_khám')}</div>
        </div>

        {/* Biểu đồ */}
        <AreaChart
            h={200}
            data={data}
            dataKey="ngày"
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
