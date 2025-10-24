import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, Modal } from "@mantine/core";
import { useAuth } from "../../../Content/AuthContext";
import dayjs from "dayjs";

const Prescriptions = ({ patientId }) => {
    const { getPrescriptionsByPatientId } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [opened, setOpened] = useState(false);

    useEffect(() => {
        if (!patientId) return;

        const fetchData = async () => {
        try {
            const prescriptions = await getPrescriptionsByPatientId(patientId);
            setData(prescriptions);
        } finally {
            setLoading(false);
        }
        };
        fetchData();
    }, [patientId, getPrescriptionsByPatientId]);

    // Cột hiển thị ngày
    const dateBodyTemplate = (rowData) => dayjs(rowData.prescriptionDate).format("DD/MM/YYYY");

    // Cột đếm số thuốc
    const countBodyTemplate = (rowData) => rowData.medicines?.length || 0;

    // Cột nút chi tiết
    const actionBodyTemplate = (rowData) => (
        <Button
        size="xs"
        color="indigo"
        variant="light"
        onClick={() => {
            setSelected(rowData);
            setOpened(true);
        }}
        >
        Xem
        </Button>
    );

    return (
        <div className="p-4">
        <h2 className="text-xl font-semibold mb-3 text-indigo-600">
            Danh sách đơn thuốc của bệnh nhân
        </h2>

        <DataTable
            value={data}
            loading={loading}
            paginator
            rows={5}
            stripedRows
            showGridlines
            emptyMessage="Không có đơn thuốc nào"
        >
            <Column field="doctorName" header="Bác sĩ" />
            <Column field="prescriptionDate" header="Ngày tạo" body={dateBodyTemplate} />
            <Column header="Số thuốc" body={countBodyTemplate} />
            <Column header="Chi tiết" body={actionBodyTemplate} />
        </DataTable>

        {/* Modal chi tiết */}
        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title={<div className="text-lg font-semibold text-indigo-600">Chi tiết đơn thuốc</div>}
            centered
            size="lg"
        >
            {selected && (
            <div className="space-y-3">
                <div>
                <p><strong>Bác sĩ:</strong> {selected.doctorName}</p>
                <p><strong>Ngày tạo:</strong> {dayjs(selected.prescriptionDate).format("DD/MM/YYYY")}</p>
                <p><strong>Ghi chú:</strong> {selected.notes || "Không có"}</p>
                </div>

                <h3 className="text-md font-semibold mt-4">Danh sách thuốc</h3>
                <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                    <tr>
                    <th className="border px-2 py-1 text-left">Tên thuốc</th>
                    <th className="border px-2 py-1 text-left">Liều lượng</th>
                    <th className="border px-2 py-1 text-left">Tần suất</th>
                    <th className="border px-2 py-1 text-left">Thời gian</th>
                    <th className="border px-2 py-1 text-left">Hướng dẫn</th>
                    </tr>
                </thead>
                <tbody>
                    {selected.medicines?.map((m) => (
                    <tr key={m.id}>
                        <td className="border px-2 py-1">{m.name}</td>
                        <td className="border px-2 py-1">{m.dosage}</td>
                        <td className="border px-2 py-1">{m.frequency}</td>
                        <td className="border px-2 py-1">{m.duration} ngày</td>
                        <td className="border px-2 py-1">{m.instruction}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
        </Modal>
        </div>
    );
};

export default Prescriptions;
