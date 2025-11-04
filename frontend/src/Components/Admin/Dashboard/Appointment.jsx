import React from "react";
import { ScrollArea } from "@mantine/core";
import { useAuth } from "../../../Content/AuthContext";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

const Appointments = () => {
    const { getTodaysAppointments } = useAuth();
    const [appointments, setAppointments] = React.useState([]);

    React.useEffect(() => {
        const fetchAppointments = async () => {
            const data = await getTodaysAppointments();
            setAppointments(data);
        };
        fetchAppointments();
    }, [getTodaysAppointments]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        // format 12h với AM/PM
        return dayjs(dateString).format("hh:mm A - DD/MM/YYYY");
    };

    const renderCard = (app) => (
        <div
            key={app.id}
            className="p-3 mb-3 border rounded-xl border-l-4 border-violet-500 shadow-md flex justify-between bg-violet-50 hover:bg-violet-100 transition-all duration-200"
        >
            <div>
                <div className="font-semibold">{app.patientName}</div>
                <div className="text-sm text-gray-500">BS: {app.doctorName}</div>
            </div>
            <div className="text-right">
                <div className="text-sm text-gray-500">
                    {formatDate(app.appointmentDate)}
                </div>
                <div className="text-sm text-gray-500">{app.reason}</div>
            </div>
        </div>
    );

    return (
        <div className="p-4 border rounded-xl bg-white shadow-xl flex flex-col gap-3">
            <div className="text-lg font-semibold">Cuộc hẹn hôm nay</div>

            <ScrollArea h={300} type="always" offsetScrollbars className="w-full">
                <div className="pr-2">{appointments.map(renderCard)}</div>
            </ScrollArea>
        </div>
    );
};

export default Appointments;
