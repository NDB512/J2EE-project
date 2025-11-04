import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Content/AuthContext";
import DoctorCard from "./DoctorCard";
import { Loader } from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";

const Doctor = () => {
    const { getAllDoctors } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllDoctors().then((data) => {
        // console.log("Doctors Data:", data);
        setDoctors(data);
        setLoading(false);
        });
    }, []);

    return (
        <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
                <IconUsers size={28} className="text-green-500" />
                <h1 className="text-2xl font-semibold text-green-600">Danh sách bác sĩ</h1>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader color="green" />
                </div>
            ) : doctors.length === 0 ? (
                <div className="text-center text-gray-500 italic py-10">
                    Chưa có bác sĩ nào.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                    {doctors.map((doctor) => (
                        <DoctorCard key={doctor.id} {...doctor} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Doctor;
