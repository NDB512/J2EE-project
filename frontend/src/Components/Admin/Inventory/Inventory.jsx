import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, TextInput, Modal, NumberInput, Select } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconSearch, IconEye, IconPlus, IconEdit } from "@tabler/icons-react";
import { Toolbar } from "primereact/toolbar";
import { useAuth } from "../../../Content/AuthContext";
import { errorNotification, successNotification } from "../../../Utils/Notification";
import dayjs from "dayjs";

const Inventory = () => {
    const {
        getAllMedicineInventories,
        getMedicineInventoryById,
        addMedicineInventory,
        updateMedicineInventory,
        deleteMedicineInventory,
        getAllMedicines
    } = useAuth();

    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [detailModal, setDetailModal] = useState({ opened: false, data: null });
    const [createModal, setCreateModal] = useState({ opened: false });
    const [updateModal, setUpdateModal] = useState({ opened: false, data: null });
    const [medicineOptions, setMedicineOptions] = useState([]);

    const [newInventory, setNewInventory] = useState({
        medicineId: "",
        batchNo: "",
        quantity: 0,
        expiryDate: null,
        addDate: dayjs().format("YYYY-MM-DD"),
        initialQuantity: 0,
    });

    // --- Load all inventories ---
    const loadInventories = async () => {
        setLoading(true);
        try {
        const data = await getAllMedicineInventories();
        setInventories(data || []);
        } catch {
        errorNotification("Không thể tải danh sách tồn kho!");
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        loadInventories();
    }, []);

    // --- Lọc tìm kiếm ---
    const filteredInventories = inventories.filter((inv) => {
        const search = globalFilterValue.toLowerCase();
        return (
        inv.medicineName?.toLowerCase().includes(search) ||
        inv.batchNo?.toLowerCase().includes(search) ||
        String(inv.id).includes(search)
        );
    });

    // --- Body columns ---
    const idBody = (row) => <span className="font-medium">#{row.id}</span>;
    const medicineBody = (row) => <span>{row.medicineName}</span>;
    const qtyBody = (row) => <span>{row.quantity}</span>;
    const statusBody = (row) => {
        const statusMap = {
        // IN_STOCK: "Còn hàng",
        // LOW_STOCK: "Sắp hết",
        OUT_OF_STOCK: "Hết hàng",
        ACTIVE: "Còn hạn",
        EXPIRIED: "Hết hạn"
        };
        return <span>{statusMap[row.stockStatus] || "Không xác định"}</span>;
    };

    const actionBody = (row) => (
        <div className="flex gap-2">
        <Button
            size="xs"
            color="blue"
            variant="light"
            leftSection={<IconEye size={14} />}
            onClick={async () => {
            try {
                const detail = await getMedicineInventoryById(row.id);
                setDetailModal({ opened: true, data: detail });
            } catch {
                errorNotification("Không thể tải chi tiết tồn kho!");
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
                const detail = await getMedicineInventoryById(row.id);
                setUpdateModal({ opened: true, data: detail });
            } catch {
                errorNotification("Không thể tải dữ liệu tồn kho!");
            }
            }}
        >
            Sửa
        </Button>
        </div>
    );

    // --- Submit thêm ---
    const handleAddInventory = async () => {
        if (!newInventory.medicineId || !newInventory.batchNo) {
        errorNotification("Vui lòng nhập đầy đủ thông tin bắt buộc!");
        return;
        }

        try {
        await addMedicineInventory(newInventory);
        setCreateModal({ opened: false });
        setNewInventory({
            medicineId: "",
            batchNo: "",
            quantity: 0,
            expiryDate: null,
            addDate: dayjs().format("YYYY-MM-DD"),
            initialQuantity: 0,
            stockStatus: "IN_STOCK",
        });
        await loadInventories();
        } catch (err) {
        errorNotification(err.response?.data?.message || "Thêm tồn kho thất bại!");
        }
    };

    // --- Submit cập nhật ---
    const handleUpdateInventory = async () => {
        if (!updateModal.data.batchNo) {
        errorNotification("Vui lòng nhập mã lô!");
        return;
        }

        try {
        await updateMedicineInventory(updateModal.data);
        setUpdateModal({ opened: false, data: null });
        await loadInventories();
        } catch (err) {
        errorNotification(err.response?.data?.message || "Cập nhật tồn kho thất bại!");
        }
    };

    useEffect(() => {
        if (createModal.opened) {
            (async () => {
                const meds = await getAllMedicines();
                setMedicineOptions(
                    meds.map((m) => ({
                        value: String(m.id),
                    label: m.name,
                    }))
                );
            })();
        }
    }, [createModal.opened]);

    return (
        <div className="card">
        {/* Thanh công cụ */}
        <Toolbar
            className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg shadow-sm px-4 py-3 flex justify-between items-center"
            start={
            <Button
                leftSection={<IconPlus size={14} />}
                color="green"
                onClick={() => setCreateModal({ opened: true })}
            >
                Thêm tồn kho
            </Button>
            }
            end={
            <TextInput
                leftSection={<IconSearch size={16} />}
                value={globalFilterValue}
                onChange={(e) => setGlobalFilterValue(e.target.value)}
                placeholder="Tìm kiếm theo tên hoặc lô..."
                className="w-64"
            />
            }
        />

        {/* Bảng danh sách */}
        <DataTable
            value={filteredInventories}
            paginator
            rows={10}
            dataKey="id"
            loading={loading}
            emptyMessage="Không có dữ liệu tồn kho."
            className="shadow-md rounded-lg"
        >
            <Column field="id" header="ID" body={idBody} sortable />
            <Column field="medicineName" header="Tên thuốc" body={medicineBody} sortable />
            <Column field="batchNo" header="Mã lô" sortable />
            <Column field="quantity" header="Số lượng" body={qtyBody} sortable />
            <Column field="expiryDate" header="Hạn sử dụng" body={(r) => dayjs(r.expiryDate).format("DD/MM/YYYY")} />
            <Column field="stockStatus" header="Trạng thái" body={statusBody} />
            <Column header="Hành động" body={actionBody} />
        </DataTable>

        {/* Modal chi tiết */}
        <Modal
            opened={detailModal.opened}
            onClose={() => setDetailModal({ opened: false, data: null })}
            centered
            size="lg"
            title={<div className="text-lg font-semibold text-blue-600">Chi tiết tồn kho</div>}
        >
            {detailModal.data && (
            <div className="space-y-2 text-sm">
                <p><b>ID:</b> #{detailModal.data.id}</p>
                <p><b>Tên thuốc:</b> {detailModal.data.medicineName}</p>
                <p><b>Mã lô:</b> {detailModal.data.batchNo}</p>
                <p><b>Số lượng hiện tại:</b> {detailModal.data.quantity}</p>
                <p><b>Số lượng ban đầu:</b> {detailModal.data.initialQuantity}</p>
                <p><b>Ngày nhập:</b> {dayjs(detailModal.data.addDate).format("DD/MM/YYYY")}</p>
                <p><b>Hạn sử dụng:</b> {dayjs(detailModal.data.expiryDate).format("DD/MM/YYYY")}</p>
                <p><b>Trạng thái:</b> {statusBody(detailModal.data)}</p>
            </div>
            )}
        </Modal>

        {/* Modal thêm */}
        <Modal
            opened={createModal.opened}
            onClose={() => setCreateModal({ opened: false })}
            centered
            size="lg"
            title={<div className="text-lg font-semibold text-green-600">Thêm tồn kho mới</div>}
        >
            <div className="grid grid-cols-2 gap-3 text-sm">
            <Select
                label="Tên thuốc"
                placeholder="Chọn thuốc..."
                searchable
                data={medicineOptions}
                value={String(newInventory.medicineId || "")} // luôn là string
                onChange={(v) =>
                    setNewInventory({ ...newInventory, medicineId: v ? Number(v) : "" })
                }
            />

            <TextInput
                label="Mã lô"
                value={newInventory.batchNo}
                onChange={(e) => setNewInventory({ ...newInventory, batchNo: e.target.value })}
            />
            <NumberInput
                label="Số lượng"
                value={newInventory.quantity}
                onChange={(v) => setNewInventory({ ...newInventory, quantity: v })}
                min={0}
            />
            <DateInput
                label="Ngày nhập"
                value={newInventory.addDate}
                onChange={(v) => setNewInventory({ ...newInventory, addDate: v })}
            />
            <DateInput
                label="Hạn sử dụng"
                value={newInventory.expiryDate}
                onChange={(v) => setNewInventory({ ...newInventory, expiryDate: v })}
            />
            </div>

            <div className="flex justify-end mt-4">
            <Button color="green" onClick={handleAddInventory}>
                Lưu
            </Button>
            </div>
        </Modal>

        {/* Modal cập nhật */}
        <Modal
            opened={updateModal.opened}
            onClose={() => setUpdateModal({ opened: false, data: null })}
            centered
            size="lg"
            title={<div className="text-lg font-semibold text-orange-600">Cập nhật tồn kho</div>}
        >
            {updateModal.data && (
            <>
                <div className="grid grid-cols-2 gap-3 text-sm">
                <TextInput
                    label="Mã lô"
                    value={updateModal.data.batchNo}
                    onChange={(e) =>
                    setUpdateModal({
                        ...updateModal,
                        data: { ...updateModal.data, batchNo: e.target.value },
                    })
                    }
                />
                <DateInput
                    label="Hạn sử dụng"
                    value={updateModal.data.expiryDate}
                    onChange={(v) =>
                    setUpdateModal({
                        ...updateModal,
                        data: { ...updateModal.data, expiryDate: v },
                    })
                    }
                />
                </div>

                <div className="flex justify-end mt-4">
                <Button color="orange" onClick={handleUpdateInventory}>
                    Cập nhật
                </Button>
                </div>
            </>
            )}
        </Modal>
        </div>
    );
};

export default Inventory;
