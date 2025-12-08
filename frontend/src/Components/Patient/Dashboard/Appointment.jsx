import React, { useEffect, useState } from "react";
import { ScrollArea, Loader } from "@mantine/core";
import { getTodaysAppointmentsByPatientApi } from "../../../Api/AppointmentApi";
import { useAuth } from "../../../Content/AuthContext";

const Appointments = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadAppointments = async () => {
        if (!user?.profileId) return;
        try {
            const data = await getTodaysAppointmentsByPatientApi(user.profileId);
            setAppointments(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAppointments();
    }, [user]);

    const renderCard = (app) => (
        <div
            key={app.id}
            className="p-3 mb-3 border rounded-xl items-center border-l-4 border-violet-500 shadow-md flex justify-between bg-violet-50 hover:bg-violet-100 transition-all duration-200"
        >
            <div>
                <div className="font-semibold">{app.doctorName}</div>
                <div className="text-sm text-gray-500">{app.reason}</div>
            </div>

            <div className="text-right">
                <div className="text-sm text-gray-500">
                    {new Date(app.appointmentDate).toLocaleDateString("vi-VN")}
                </div>
                <div className="text-sm font-medium text-gray-600">
                    {new Date(app.appointmentDate).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-4 border rounded-xl bg-white shadow-xl flex flex-col gap-3">
            <div className="text-lg font-semibold">
                Các cuộc hẹn hôm nay
            </div>

            {loading ? (
                <div className="flex justify-center p-5">
                    <Loader size="lg" />
                </div>
            ) : (
                <ScrollArea h={350} type="always" offsetScrollbars className="w-full">
                    <div className="pr-2">
                        {appointments.length > 0 ? (
                            appointments.map(renderCard)
                        ) : (
                            <div className="text-gray-500 text-sm text-center py-3">
                                Không có cuộc hẹn nào hôm nay.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
};

export default Appointments;
