import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Content/AuthContext";
import PatientCard from "./PatientCard";
import { Loader } from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";

const Patient = () => {
    const { getAllPatients } = useAuth();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllPatients().then((data) => {
        // console.log("Patients Data:", data);
        setPatients(data);
        setLoading(false);
        });
    }, []);

    return (
        <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
                <IconUsers size={28} className="text-green-500" />
                <h1 className="text-2xl font-semibold text-green-600">Danh sách bệnh nhân</h1>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader color="green" />
                </div>
            ) : patients.length === 0 ? (
                <div className="text-center text-gray-500 italic py-10">
                    Chưa có bệnh nhân nào.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                    {patients.map((patient) => (
                        <PatientCard key={patient.id} {...patient} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Patient;
