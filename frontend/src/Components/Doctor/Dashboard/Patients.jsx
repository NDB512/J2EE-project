import React from "react";
import { ScrollArea } from "@mantine/core";
import { IconUser, IconMail, IconMapPin, IconDroplet } from "@tabler/icons-react";
import { useAuth } from "../../../Content/AuthContext";

const Patients = () => {
    const [patients, setPatients] = React.useState([]);

    const { getAllPatients, user } = useAuth();

    React.useEffect(() => {
        const fetchPatients = async () => {
        try {
            const data = await getAllPatients();
            console.log("Patients Data:", data);
            setPatients(data);
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
    };
        fetchPatients();
    }, [getAllPatients]);

    const renderCard = (p) => (
        <div key={p.id} className="p-3 mb-3 border rounded-xl border-l-4 border-blue-500 shadow-md flex justify-between bg-blue-50 hover:bg-blue-100 transition-all duration-200">
            <div>
                <div className="font-semibold flex items-center gap-1 text-blue-700">
                    <IconUser size={18} /> {p.name}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                    <IconMail size={16} /> {p.email}
                </div>
            </div>

            <div className="text-right">
                <div className="text-sm text-gray-600 flex items-center justify-end gap-1">
                    <IconMapPin size={16} /> {p.address}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-end gap-1">
                    <IconDroplet size={16} /> Nhóm máu: {p.bloodType}
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-4 border rounded-xl bg-white shadow-xl flex flex-col gap-3">
            <div className="text-lg font-semibold text-blue-700">
                Danh sách bệnh nhân
            </div>

            <ScrollArea h={350} type="always" offsetScrollbars className="w-full">
                <div className="pr-2">{patients.map(renderCard)}</div>
            </ScrollArea>
        </div>
    );
};

export default Patients;
