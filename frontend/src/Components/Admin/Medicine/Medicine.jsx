import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, TextInput, Modal, Select, NumberInput } from "@mantine/core";
import { IconSearch, IconEye, IconPlus, IconEdit } from "@tabler/icons-react";
import { Toolbar } from "primereact/toolbar";
import { useAuth } from "../../../Content/AuthContext";
import { errorNotification, successNotification } from "../../../Utils/Notification";
import { categoryOptions, typeOptions } from "../../../Data/DropdownData";
import dayjs from "dayjs";

const Medicine = () => {
    const { getAllMedicines, getMedicineById, addMedicine, updateMedicine } = useAuth();

    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [detailModal, setDetailModal] = useState({ opened: false, data: null });
    const [createModal, setCreateModal] = useState({ opened: false });
    const [updateModal, setUpdateModal] = useState({ opened: false, data: null });

    const [newMedicine, setNewMedicine] = useState({
        name: "",
        dosage: "",
        category: "",
        type: "",
        manufacturer: "",
        unitPrice: "",
    });

    // --- Load all medicines ---
    const loadMedicines = async () => {
        setLoading(true);
        try {
        const data = await getAllMedicines();
        setMedicines(data || []);
        } catch {
        errorNotification("Không thể tải danh sách thuốc!");
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        loadMedicines();
    }, []);

    // --- Lọc tìm kiếm ---
    const filteredMedicines = medicines.filter((m) => {
        const search = globalFilterValue.toLowerCase();
        return (
        m.name?.toLowerCase().includes(search) ||
        String(m.unitPrice).includes(search) ||
        String(m.id).includes(search)
        );
    });

    // --- Body columns ---
    const idBody = (row) => <span className="font-medium">#{row.id}</span>;
    const nameBody = (row) => <span>{row.name}</span>;
    const priceBody = (row) => <span>{row.unitPrice?.toLocaleString("vi-VN")} ₫</span>;

    const actionBody = (row) => (
        <div className="flex gap-2">
        <Button
            size="xs"
            color="blue"
            variant="light"
            leftSection={<IconEye size={14} />}
            onClick={async () => {
            try {
                const detail = await getMedicineById(row.id);
                setDetailModal({ opened: true, data: detail });
            } catch {
                errorNotification("Không thể tải chi tiết thuốc!");
            }
            }}
        >
            Xem
        </Button>
        <Button
            size="xs"
            color="orange"
            variant="light"
            leftSection={<IconEdit size={14} />}
            onClick={async () => {
            try {
                const detail = await getMedicineById(row.id);
                setUpdateModal({ opened: true, data: detail });
            } catch {
                errorNotification("Không thể tải thông tin thuốc để chỉnh sửa!");
            }
            }}
        >
            Sửa
        </Button>
        </div>
    );

    // --- Submit thêm thuốc ---
    const handleAddMedicine = async () => {
        if (!newMedicine.name || !newMedicine.unitPrice) {
        errorNotification("Vui lòng nhập đầy đủ thông tin bắt buộc!");
        return;
        }

        try {
        await addMedicine(newMedicine);
        setCreateModal({ opened: false });
        setNewMedicine({
            name: "",
            dosage: "",
            category: "",
            type: "",
            manufacturer: "",
            unitPrice: "",
        });
        await loadMedicines();
        } catch (err) {
        errorNotification(err.response?.data?.message || "Thêm thuốc thất bại!");
        }
    };

    // --- Submit cập nhật thuốc ---
    const handleUpdateMedicine = async () => {
        if (!updateModal.data.name || !updateModal.data.unitPrice) {
        errorNotification("Vui lòng nhập đầy đủ thông tin bắt buộc!");
        return;
        }

        try {
        await updateMedicine(updateModal.data);
        setUpdateModal({ opened: false, data: null });
        await loadMedicines();
        } catch (err) {
        errorNotification(err.response?.data?.message || "Cập nhật thất bại!");
        }
    };

    return (
        <div className="card">
        {/* Thanh công cụ */}
        <Toolbar
            className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg shadow-sm px-4 py-3 flex justify-between items-center"
            start={
            <div className="flex items-center gap-2">
                <Button
                leftSection={<IconPlus size={14} />}
                color="green"
                onClick={() => setCreateModal({ opened: true })}
                >
                Thêm thuốc
                </Button>
            </div>
            }
            end={
            <TextInput
                leftSection={<IconSearch size={16} />}
                value={globalFilterValue}
                onChange={(e) => setGlobalFilterValue(e.target.value)}
                placeholder="Tìm kiếm thuốc..."
                className="w-64"
            />
            }
        />

        {/* Bảng danh sách */}
        <DataTable
            value={filteredMedicines}
            paginator
            rows={10}
            dataKey="id"
            loading={loading}
            emptyMessage="Không có thuốc nào."
            className="shadow-md rounded-lg"
        >
            <Column field="id" header="ID" body={idBody} sortable />
            <Column field="name" header="Tên thuốc" body={nameBody} sortable />
            <Column field="unitPrice" header="Đơn giá" body={priceBody} sortable />
            <Column header="Hành động" body={actionBody} />
        </DataTable>

        {/* Modal chi tiết */}
        <Modal
            opened={detailModal.opened}
            onClose={() => setDetailModal({ opened: false, data: null })}
            centered
            size="lg"
            title={<div className="text-lg font-semibold text-blue-600">Chi tiết thuốc</div>}
        >
            {detailModal.data && (
            <div className="space-y-2 text-sm">
                <p><b>ID:</b> #{detailModal.data.id}</p>
                <p><b>Tên thuốc:</b> {detailModal.data.name}</p>
                <p><b>Liều lượng:</b> {detailModal.data.dosage || "Không có"}</p>
                <p><b>Danh mục:</b> {detailModal.data.category || "Không xác định"}</p>
                <p><b>Loại:</b> {detailModal.data.type || "Không xác định"}</p>
                <p><b>Nhà sản xuất:</b> {detailModal.data.manufacturer || "Không có"}</p>
                <p><b>Đơn giá:</b> {detailModal.data.unitPrice?.toLocaleString("vi-VN")} ₫</p>
                <p><b>Tồn kho:</b> {detailModal.data.stock ?? "Chưa có dữ liệu"}</p>
                <p><b>Ngày tạo:</b> {dayjs(detailModal.data.createdAt).format("DD/MM/YYYY HH:mm")}</p>
            </div>
            )}
        </Modal>

        {/* Modal thêm */}
        <Modal
            opened={createModal.opened}
            onClose={() => setCreateModal({ opened: false })}
            centered
            size="lg"
            title={<div className="text-lg font-semibold text-green-600">Thêm thuốc mới</div>}
        >
            <div className="grid grid-cols-2 gap-3 text-sm">
            <TextInput
                label="Tên thuốc"
                placeholder="Ví dụ: Paracetamol"
                value={newMedicine.name}
                onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                required
            />
            <TextInput
                label="Liều lượng"
                placeholder="500mg"
                value={newMedicine.dosage}
                onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
            />
            <Select
                label="Danh mục"
                data={categoryOptions}
                value={newMedicine.category}
                onChange={(value) => setNewMedicine({ ...newMedicine, category: value })}
                placeholder="Chọn danh mục"
            />
            <Select
                label="Loại thuốc"
                data={typeOptions}
                value={newMedicine.type}
                onChange={(value) => setNewMedicine({ ...newMedicine, type: value })}
                placeholder="Chọn loại thuốc"
            />
            <TextInput
                label="Nhà sản xuất"
                placeholder="Công ty Dược ABC"
                value={newMedicine.manufacturer}
                onChange={(e) => setNewMedicine({ ...newMedicine, manufacturer: e.target.value })}
            />
            <NumberInput
                label="Đơn giá (VNĐ)"
                value={newMedicine.unitPrice}
                onChange={(value) => setNewMedicine({ ...newMedicine, unitPrice: value })}
                min={0}
                thousandSeparator
                placeholder="Nhập giá..."
            />
            </div>

            <div className="flex justify-end mt-4">
            <Button color="green" onClick={handleAddMedicine}>
                Lưu thuốc
            </Button>
            </div>
        </Modal>

        {/* Modal cập nhật */}
        <Modal
            opened={updateModal.opened}
            onClose={() => setUpdateModal({ opened: false, data: null })}
            centered
            size="lg"
            title={<div className="text-lg font-semibold text-orange-600">Cập nhật thuốc</div>}
        >
            {updateModal.data && (
            <>
                <div className="grid grid-cols-2 gap-3 text-sm">
                <TextInput
                    label="Tên thuốc"
                    value={updateModal.data.name}
                    onChange={(e) =>
                    setUpdateModal({
                        ...updateModal,
                        data: { ...updateModal.data, name: e.target.value },
                    })
                    }
                />
                <TextInput
                    label="Liều lượng"
                    value={updateModal.data.dosage || ""}
                    onChange={(e) =>
                    setUpdateModal({
                        ...updateModal,
                        data: { ...updateModal.data, dosage: e.target.value },
                    })
                    }
                />
                <Select
                    label="Danh mục"
                    data={categoryOptions}
                    value={updateModal.data.category || ""}
                    onChange={(v) =>
                    setUpdateModal({
                        ...updateModal,
                        data: { ...updateModal.data, category: v },
                    })
                    }
                />
                <Select
                    label="Loại thuốc"
                    data={typeOptions}
                    value={updateModal.data.type || ""}
                    onChange={(v) =>
                    setUpdateModal({
                        ...updateModal,
                        data: { ...updateModal.data, type: v },
                    })
                    }
                />
                <TextInput
                    label="Nhà sản xuất"
                    value={updateModal.data.manufacturer || ""}
                    onChange={(e) =>
                    setUpdateModal({
                        ...updateModal,
                        data: { ...updateModal.data, manufacturer: e.target.value },
                    })
                    }
                />
                <NumberInput
                    label="Đơn giá (VNĐ)"
                    value={updateModal.data.unitPrice}
                    onChange={(v) =>
                    setUpdateModal({
                        ...updateModal,
                        data: { ...updateModal.data, unitPrice: v },
                    })
                    }
                    min={0}
                    thousandSeparator
                />
                </div>

                <div className="flex justify-end mt-4">
                <Button color="orange" onClick={handleUpdateMedicine}>
                    Cập nhật
                </Button>
                </div>
            </>
            )}
        </Modal>
        </div>
    );
};

export default Medicine;
