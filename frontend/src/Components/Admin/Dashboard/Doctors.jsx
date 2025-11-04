import React from "react";
import { ScrollArea } from "@mantine/core";
import { IconUserHeart, IconMail, IconMapPin, IconStethoscope } from "@tabler/icons-react";
import { useAuth } from "../../../Content/AuthContext";

const Doctors = () => {
    const [doctors, setDoctors] = React.useState([]);

    const { getAllDoctors } = useAuth();

    React.useEffect(() => {
        const fetchDoctors = async () => {
        try {
            const data = await getAllDoctors();
            setDoctors(data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };
        fetchDoctors();
    }, [getAllDoctors]);

    const renderCard = (d) => (
        <div key={d.id} className="p-3 mb-3 border rounded-xl border-l-4 border-green-500 shadow-md flex justify-between bg-green-50 hover:bg-green-100 transition-all duration-200" >
            <div>
                <div className="font-semibold flex items-center gap-1 text-green-700">
                    <IconUserHeart size={18} /> {d.name}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                    <IconMail size={16} /> {d.email}
                </div>
            </div>

            <div className="text-right">
                <div className="text-sm text-gray-600 flex items-center justify-end gap-1">
                    <IconMapPin size={16} /> {d.location}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-end gap-1">
                    <IconStethoscope size={16} /> {d.department}
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-4 border rounded-xl bg-white shadow-xl flex flex-col gap-3">
            <div className="text-lg font-semibold text-green-700">
                Danh sách bác sĩ
            </div>

            <ScrollArea h={350} type="always" offsetScrollbars className="w-full">
                <div className="pr-2">{doctors.map(renderCard)}</div>
            </ScrollArea>
        </div>
    );
};

export default Doctors;
