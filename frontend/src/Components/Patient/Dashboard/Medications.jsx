import React from "react";
import { ScrollArea } from "@mantine/core";
import { IconPill, IconBuildingFactory2, IconArchive } from "@tabler/icons-react";

const Medications = () => {
    const Medications = [
        {
            id: 1,
            name: "Paracetamol 500mg",
            dosage: "1 viên x 3 lần/ngày",
            stock: 120,
            manufacturer: "DHG Pharma",
        },
        {
            id: 2,
            name: "Amoxicillin 500mg",
            dosage: "1 viên x 2 lần/ngày",
            stock: 85,
            manufacturer: "Traphaco",
        },
        {
            id: 3,
            name: "Vitamin C 1000mg",
            dosage: "1 viên/ngày",
            stock: 200,
            manufacturer: "Mega We Care",
        },
        {
            id: 4,
            name: "Aspirin 81mg",
            dosage: "1 viên/ngày sau ăn",
            stock: 50,
            manufacturer: "Sanofi",
        },
        {
            id: 5,
            name: "Cefuroxime 250mg",
            dosage: "1 viên x 2 lần/ngày",
            stock: 65,
            manufacturer: "Imexpharm",
        },
    ];

    // Hàm render 1 thẻ thuốc
    const renderCard = (med) => (
        <div
        key={med.id}
        className="p-3 mb-3 border rounded-xl border-l-4 border-orange-500 shadow-md flex justify-between bg-orange-50 hover:bg-orange-100 transition-all duration-200"
        >
            {/* Cột trái */}
            <div>
                <div className="font-semibold flex items-center gap-1">
                    <IconPill size={18} className="text-orange-600" /> {med.name}
                </div>
                <div className="text-sm text-gray-500 italic">{med.dosage}</div>
            </div>

            {/* Cột phải */}
            <div className="text-right">
                <div className="text-sm flex items-center justify-end gap-1 text-gray-600">
                    <IconArchive size={16} /> {med.stock} viên
                </div>
                <div className="text-sm text-gray-500 flex items-center justify-end gap-1">
                    <IconBuildingFactory2 size={16} /> {med.manufacturer}
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-4 border rounded-xl bg-white shadow-xl flex flex-col gap-3">
        <div className="text-lg font-semibold text-orange-700">
            Danh sách thuốc trong kho
        </div>

        <ScrollArea
            h={350}
            type="always"
            offsetScrollbars
            className="w-full"
        >
            <div className="pr-2">{Medications.map(renderCard)}</div>
        </ScrollArea>
        </div>
    );
};

export default Medications;