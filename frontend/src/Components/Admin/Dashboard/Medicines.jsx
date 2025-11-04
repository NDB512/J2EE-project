import React from "react";
import { ScrollArea } from "@mantine/core";
import { IconPill, IconBuildingFactory2, IconArchive } from "@tabler/icons-react";
import { useAuth } from "../../../Content/AuthContext";

const Medicines = () => {
    const [medicines, setMedicines] = React.useState([]);

    const { getAllMedicines } = useAuth();

    React.useEffect(() => {
        const fetchMedicines = async () => {
        try {
            const data = await getAllMedicines();
            setMedicines(data);
        } catch (error) {
            console.error("Error fetching medicines:", error);
        }
    };
        fetchMedicines();
    }, [getAllMedicines]);

    // Hàm render 1 thẻ thuốc
    const renderCard = (medicines) => (
        <div
        key={medicines.id}
        className="p-3 mb-3 border rounded-xl border-l-4 border-orange-500 shadow-md flex justify-between bg-orange-50 hover:bg-orange-100 transition-all duration-200"
        >
            {/* Cột trái */}
            <div>
                <div className="font-semibold flex items-center gap-1">
                    <IconPill size={18} className="text-orange-600" /> {medicines.name}
                </div>
                <div className="text-sm text-gray-500 italic">{medicines.dosage}</div>
            </div>

            {/* Cột phải */}
            <div className="text-right">
                <div className="text-sm flex items-center justify-end gap-1 text-gray-600">
                    <IconArchive size={16} /> {medicines.stock} viên
                </div>
                <div className="text-sm text-gray-500 flex items-center justify-end gap-1">
                    <IconBuildingFactory2 size={16} /> {medicines.manufacturer}
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
            h={300}
            type="always"
            offsetScrollbars
            className="w-full"
        >
            <div className="pr-2">{medicines.map(renderCard)}</div>
        </ScrollArea>
        </div>
    );
};

export default Medicines;
