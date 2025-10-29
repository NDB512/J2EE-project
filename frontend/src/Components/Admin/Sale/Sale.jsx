import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
    Button,
    TextInput,
    Modal,
    NumberInput,
    Select,
    ActionIcon,
    Tooltip,
} from "@mantine/core";
import {
    IconSearch,
    IconEye,
    IconPlus,
    IconEdit,
    IconTrash,
} from "@tabler/icons-react";
import { Toolbar } from "primereact/toolbar";
import { useAuth } from "../../../Content/AuthContext";
import {
    errorNotification,
} from "../../../Utils/Notification";
import dayjs from "dayjs";

const Sale = () => {
    const {
        getAllSales,
        getSaleById,
        getSaleItemsBySaleId,
        createSale,
        updateSale,
        getMedicineDropdown,
        getAllPrescriptions,
        getMedicinesByPrescriptionId,
    } = useAuth();

    const [sales, setSales] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [detailModal, setDetailModal] = useState({
        opened: false,
        data: null,
        items: [],
    });
    const [createModal, setCreateModal] = useState({ opened: false });
    const [updateModal, setUpdateModal] = useState({ opened: false, data: null });

    const [medicines, setMedicines] = useState([]);

    // ---------- STATE CỦA FORM TẠO ----------
    const [newSale, setNewSale] = useState({
        buyerName: "",
        buyerContact: "",
        saleDate: dayjs().toDate(),
        totalAmount: 0,
        saleItems: [],
        prescriptionId: null,
    });

    const [selectedPrescription, setSelectedPrescription] = useState(null);

    // Map dosagePattern sang số lần uống/ngày (frequency)
    const dosagePatternOptions = [
        // Uống 1 lần/ngày
        { value: "Sáng", label: "Sáng", frequency: 1 },
        { value: "Trưa", label: "Trưa", frequency: 1 },
        { value: "Tối", label: "Tối", frequency: 1 },
        { value: "Khuya", label: "Khuya", frequency: 1 },
        { value: "1 lần/ngày", label: "1 lần/ngày", frequency: 1 },

        // Uống 2 lần/ngày
        { value: "Sáng - Trưa", label: "Sáng - Trưa", frequency: 2 },
        { value: "Sáng - Tối", label: "Sáng - Tối", frequency: 2 },
        { value: "Trưa - Tối", label: "Trưa - Tối", frequency: 2 },
        { value: "Trưa - Khuya", label: "Trưa - Khuya", frequency: 2 },
        { value: "Tối - Khuya", label: "Tối - Khuya", frequency: 2 },
        { value: "2 lần/ngày", label: "2 lần/ngày", frequency: 2 },

        // Uống 3 lần/ngày
        { value: "Sáng - Trưa - Tối", label: "Sáng - Trưa - Tối", frequency: 3 },
        { value: "3 lần/ngày", label: "3 lần/ngày", frequency: 3 },

        // Uống 4 lần/ngày
        { value: "Sáng - Trưa - Tối - Khuya", label: "Sáng - Trưa - Tối - Khuya", frequency: 4 },
        { value: "4 lần/ngày", label: "4 lần/ngày", frequency: 4 },

        // Đặc biệt
        { value: "Sáng - Tối (bỏ trưa, khuya)", label: "Sáng - Tối (bỏ trưa, khuya)", frequency: 2 },
        { value: "Trưa - Khuya", label: "Trưa - Khuya", frequency: 2 },
        { value: "Sáng - Khuya", label: "Sáng - Khuya", frequency: 2 },

        // Theo chỉ định
        { value: "Theo chỉ định bác sĩ", label: "Theo chỉ định bác sĩ", frequency: 1 },
    ];

    const getFrequencyFromDosage = (dosagePattern) => {
        const option = dosagePatternOptions.find(opt => opt.value === dosagePattern);
        return option ? option.frequency : 1;
    };

    // --- Load dữ liệu ---
    const loadSales = async () => {
        setLoading(true);
        try {
            const data = await getAllSales();
            // console.log("Loaded sales:", data);
            setSales(data || []);
        } finally {
            setLoading(false);
        }
    };

    const loadMedicines = async () => {
        try {
            const meds = await getMedicineDropdown();
            setMedicines(meds || []);
        } catch {
        }
    };

    const loadPrescriptions = async () => {
        try {
            const pres = await getAllPrescriptions();
            // console.log("Loaded prescriptions:", pres);
            setPrescriptions(pres || []);
        } catch (err) {
            console.error("Lỗi tải đơn thuốc:", err);
        }
    };

    useEffect(() => {
        loadSales();
        loadMedicines();
        loadPrescriptions();
    }, []);

    // --- Lọc ---
    const filteredSales = sales.filter((s) => {
        const search = globalFilterValue.toLowerCase();
        return (
            s.buyerName?.toLowerCase().includes(search) ||
            s.buyerContact?.toLowerCase().includes(search) ||
            String(s.id).includes(search)
        );
    });

    // --- Body Columns ---
    const idBody = (row) => <span className="font-medium">#{row.id}</span>;
    const totalBody = (row) => <span>{row.totalAmount?.toLocaleString()} ₫</span>;
    const dateBody = (row) => dayjs(row.saleDate).format("DD/MM/YYYY HH:mm");

    // --- Tính tổng tiền ---
    const recalcTotal = (items, setter) => {
        const total = items.reduce(
            (sum, i) => sum + (i.unitPrice || 0) * (i.quantity || 0),
            0
        );
        setter((prev) => ({ ...prev, totalAmount: total }));
    };

    // --- Thêm/xóa dòng thuốc ---
    const addItem = (state, setter) => {
        setter((prev) => ({
            ...prev,
            saleItems: [
                ...prev.saleItems,
                { medicineId: null, medicineName: "", quantity: 1, unitPrice: 0 },
            ],
        }));
    };

    const removeItem = (state, setter, index) => {
        const updated = [...state.saleItems];
        updated.splice(index, 1);
        setter((prev) => ({ ...prev, saleItems: updated }));
        recalcTotal(updated, setter);
    };

    const handleMedicineChange = (index, value, state, setter) => {
        const med = medicines.find((m) => m.id === value);
        const updated = [...state.saleItems];
        updated[index].medicineId = value;
        updated[index].medicineName = med ? `${med.name} (${med.dosage})` : "";
        updated[index].unitPrice = med ? med.unitPrice : 0;
        setter((prev) => ({ ...prev, saleItems: updated }));
        recalcTotal(updated, setter);
    };

    const handleQuantityChange = (index, value, state, setter) => {
        const updated = [...state.saleItems];
        updated[index].quantity = value;
        setter((prev) => ({ ...prev, saleItems: updated }));
        recalcTotal(updated, setter);
    };

    // --- Xử lý chọn prescription ---
    const handlePrescriptionChange = async (prescriptionId) => {
        if (!prescriptionId) {
            setSelectedPrescription(null);
            setNewSale(prev => ({ ...prev, buyerName: "", buyerContact: "", saleItems: [], prescriptionId: null }));
            return;
        }

        try {
            const selectedPres = prescriptions.find(p => p.id === Number(prescriptionId));
            if (selectedPres) {
                setNewSale(prev => ({
                    ...prev,
                    buyerName: selectedPres.patientName || "",
                    buyerContact: selectedPres.patientPhone || "",
                    prescriptionId: selectedPres.id,
                }));
                setSelectedPrescription(selectedPres);

                const prescriptionMedicines = await getMedicinesByPrescriptionId(prescriptionId);
                const newItems = prescriptionMedicines.map(med => {
                    // Tìm bằng id trước
                    let fullMed = medicines.find(m => m.id === med.medicineId);
                    
                    // Nếu không có, tìm bằng name, dosage, type (giả sử fields tồn tại)
                    if (!fullMed) {
                        fullMed = medicines.find(m => 
                            m.name.toLowerCase().trim() === (med.medicineName || med.name || '').toLowerCase().trim() &&
                            m.dosage === (med.dosage || '') &&
                            (m.type || '').toLowerCase() === (med.type || '').toLowerCase()
                        );
                    }

                    const freq = getFrequencyFromDosage(med.frequency || med.dosagePattern || "Sáng");
                    const quantity = freq * (med.duration || 1);

                    if (fullMed) {
                        return {
                            medicineId: fullMed.id,
                            medicineName: `${fullMed.name} (${fullMed.dosage})`,
                            quantity,
                            unitPrice: fullMed.unitPrice,
                        };
                    } else {
                        // Không tìm thấy, dùng tên tạm
                        const tempName = (med.medicineName || med.name || 'Thuốc không xác định') + 
                            ` (${med.dosage || ''})`;
                        return {
                            medicineId: null,
                            medicineName: tempName,
                            quantity,
                            unitPrice: med.unitPrice || 0,
                        };
                    }
                });

                setNewSale(prev => ({
                    ...prev,
                    saleItems: newItems,
                }));
                recalcTotal(newItems, setNewSale);
            }
        } catch (err) {
            console.error("Lỗi tải thuốc từ đơn:", err);
            errorNotification("Không thể tải thuốc từ đơn thuốc!");
        }
    };

    // --- Thêm mới ---
    const handleAddSale = async () => {
        if (!newSale.buyerName || !newSale.buyerContact) {
            errorNotification("Vui lòng nhập thông tin người mua!");
            return;
        }
        if (newSale.saleItems.length === 0) {
            errorNotification("Vui lòng chọn ít nhất 1 thuốc!");
            return;
        }

        // Kiểm tra nếu có item không có medicineId, có thể cần handle ở backend
        const hasUnassigned = newSale.saleItems.some(it => !it.medicineId);
        if (hasUnassigned) {
            const confirm = window.confirm("Có thuốc chưa gán vào hệ thống. Tiếp tục lưu?");
            if (!confirm) return;
        }

        try {
            await createSale(newSale);
            setCreateModal({ opened: false });
            setSelectedPrescription(null);
            await loadSales();
            setNewSale({
                buyerName: "",
                buyerContact: "",
                saleDate: dayjs().toDate(),
                totalAmount: 0,
                saleItems: [],
                prescriptionId: null,
            });
        } catch (err) {
            console.error("Lỗi tạo hóa đơn:", err);
        }
    };

    // --- Cập nhật ---
    const handleUpdateSale = async () => {
        try {
            await updateSale(updateModal.data);
            setUpdateModal({ opened: false, data: null });
            await loadSales();
        } catch (err) {
            console.error("Lỗi cập nhật:", err);
        }
    };

    // --- Cột hành động ---
    const actionBody = (row) => (
        <div className="flex gap-2">
            <Button
                size="xs"
                color="blue"
                variant="light"
                leftSection={<IconEye size={14} />}
                onClick={async () => {
                    try {
                        const detail = await getSaleById(row.id);
                        const items = await getSaleItemsBySaleId(row.id);
                        setDetailModal({ opened: true, data: detail, items });
                    } catch (err) {
                        console.error("Lỗi tải chi tiết:", err);
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
                        const detail = await getSaleById(row.id);
                        const items = await getSaleItemsBySaleId(row.id);
                        // Thêm medicineName cho update nếu cần, giả sử items từ db có medicineId
                        setUpdateModal({
                            opened: true,
                            data: { ...detail, saleItems: items.map(it => ({ ...it, medicineName: getMedicineName(it.medicineId) })) },
                        });
                    } catch (err) {
                        console.error("Lỗi tải dữ liệu sửa:", err);
                    }
                }}
            >
                Sửa
            </Button>
        </div>
    );

    // Helper để lấy tên thuốc từ ID hoặc name
    const getMedicineName = (medicineId, medicineName = null) => {
        if (medicineName) return medicineName;
        const med = medicines.find((m) => m.id === medicineId);
        return med ? `${med.name} (${med.dosage})` : `Thuốc ID: ${medicineId}`;
    };

    // Data cho Select prescriptions
    const prescriptionOptions = prescriptions.map(p => ({
        value: String(p.id),
        label: `${p.patientName || "N/A"} - ${p.doctorName || "N/A"}`,
    }));

    // Component cho cột thuốc trong grid
    const MedicineColumn = ({ item, index, state, setter }) => (
        <div className="flex flex-col gap-1">
            {item.medicineId ? (
                <Select
                    label="Thuốc"
                    data={medicines.map((m) => ({
                        value: String(m.id),
                        label: `${m.name} (${m.dosage})`,
                    }))}
                    value={String(item.medicineId)}
                    onChange={(v) =>
                        handleMedicineChange(index, Number(v), state, setter)
                    }
                    searchable
                    clearable
                    size="sm"
                />
            ) : (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                    <Tooltip label="Thuốc chưa có trong hệ thống. Click để gán.">
                        <span className="text-sm text-gray-700 truncate max-w-[150px]">
                            {item.medicineName} <span className="text-red-500">(chưa có)</span>
                        </span>
                    </Tooltip>
                    <ActionIcon
                        size="xs"
                        variant="light"
                        color="blue"
                        onClick={() => {
                            // Switch sang Select mode bằng cách set medicineId tạm = null nhưng cho phép chọn
                            // Thực tế, set medicineId = '' để Select clear, user có thể chọn
                            const updated = [...state.saleItems];
                            updated[index].medicineId = null; // Giữ null, nhưng onClick mở Select
                            // Để đơn giản, chỉ clear và user có thể thêm mới, nhưng ở đây ta có thể set to Select
                            // Thay đổi: Khi click, set medicineId = undefined or '', và render Select luôn nếu click
                            // Nhưng để code đơn giản, khi click, set item.medicineId = '', để Select render với value=''
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            const updated = [...state.saleItems];
                            updated[index].medicineId = ''; // Force render Select
                            setter((prev) => ({ ...prev, saleItems: updated }));
                        }}
                    >
                        <IconEdit size={14} />
                    </ActionIcon>
                </div>
            )}
        </div>
    );

    return (
        <div className="card">
            <Toolbar
                className="mb-4 border border-blue-100 rounded-lg shadow-sm px-4 py-3 flex justify-between items-center"
                start={
                    <Button
                        leftSection={<IconPlus size={14} />}
                        color="green"
                        onClick={() => setCreateModal({ opened: true })}
                    >
                        Tạo đơn bán
                    </Button>
                }
                end={
                    <TextInput
                        leftSection={<IconSearch size={16} />}
                        value={globalFilterValue}
                        onChange={(e) => setGlobalFilterValue(e.target.value)}
                        placeholder="Tìm kiếm hóa đơn..."
                        className="w-64"
                    />
                }
            />

            <DataTable
                value={filteredSales}
                paginator
                rows={10}
                dataKey="id"
                loading={loading}
                emptyMessage="Không có hóa đơn bán thuốc."
                className="shadow-md rounded-lg"
            >
                <Column field="id" header="Mã" body={idBody} sortable />
                <Column field="buyerName" header="Người mua" sortable />
                <Column field="buyerContact" header="Liên hệ" sortable />
                <Column field="totalAmount" header="Tổng tiền" body={totalBody} sortable />
                <Column field="saleDate" header="Ngày" body={dateBody} sortable />
                <Column header="Hành động" body={actionBody} />
            </DataTable>

            {/* Modal chi tiết */}
            <Modal
                opened={detailModal.opened}
                onClose={() => setDetailModal({ opened: false, data: null, items: [] })}
                centered
                size="lg"
                title="Chi tiết hóa đơn"
            >
                {detailModal.data && (
                    <div className="space-y-2 text-sm">
                        <p><b>Mã:</b> #{detailModal.data.id}</p>
                        <p><b>Người mua:</b> {detailModal.data.buyerName}</p>
                        <p><b>Liên hệ:</b> {detailModal.data.buyerContact}</p>
                        <p>
                            <b>Tổng tiền:</b>{" "}
                            {detailModal.data.totalAmount?.toLocaleString()} ₫
                        </p>

                        <div className="mt-2 border-t pt-2">
                            <p className="font-semibold text-blue-600 mb-1">
                                Danh sách thuốc:
                            </p>
                            {detailModal.items.map((it) => (
                                <div
                                    key={it.id}
                                    className="flex justify-between border-b py-1 text-sm"
                                >
                                    <span>
                                        {getMedicineName(it.medicineId)} - Lô {it.batchNo || 'N/A'} ({it.quantity})
                                    </span>
                                    <span>{it.unitPrice?.toLocaleString()} ₫</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal thêm mới */}
            <Modal
                opened={createModal.opened}
                onClose={() => {
                    setCreateModal({ opened: false });
                    setSelectedPrescription(null);
                    setNewSale({
                        buyerName: "",
                        buyerContact: "",
                        saleDate: dayjs().toDate(),
                        totalAmount: 0,
                        saleItems: [],
                        prescriptionId: null,
                    });
                }}
                centered
                size="lg"
                title="Tạo đơn bán mới"
            >
                <div className="mb-3">
                    {/* Spotlight: Chọn đơn thuốc */}
                    <div className="border border-blue-200 bg-blue-50 p-3 rounded-lg mb-3">
                        <p className="font-semibold text-blue-600 mb-2">Chọn đơn thuốc để tự động điền thông tin</p>
                        <Select
                            label="Chọn đơn thuốc"
                            data={prescriptionOptions}
                            value={String(selectedPrescription?.id || "")}
                            onChange={handlePrescriptionChange}
                            placeholder="Chọn một đơn thuốc..."
                            searchable
                            clearable
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <TextInput
                            label="Người mua"
                            value={newSale.buyerName}
                            onChange={(e) =>
                                setNewSale({ ...newSale, buyerName: e.target.value })
                            }
                        />
                        <TextInput
                            label="Liên hệ"
                            value={newSale.buyerContact}
                            onChange={(e) =>
                                setNewSale({ ...newSale, buyerContact: e.target.value })
                            }
                        />
                    </div>
                </div>

                {/* Danh sách thuốc */}
                <div className="border-t pt-2">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-blue-600">Thuốc bán ra</p>
                        <Button
                            size="xs"
                            color="green"
                            variant="light"
                            onClick={() => addItem(newSale, setNewSale)}
                        >
                            + Thêm thuốc
                        </Button>
                    </div>

                    {newSale.saleItems.map((it, i) => (
                        <div key={i} className="grid grid-cols-4 gap-2 mb-2 items-end">
                            <MedicineColumn 
                                item={it} 
                                index={i} 
                                state={newSale} 
                                setter={setNewSale} 
                            />

                            <NumberInput
                                label="SL"
                                min={1}
                                value={it.quantity}
                                onChange={(v) =>
                                    handleQuantityChange(i, v, newSale, setNewSale)
                                }
                            />
                            <NumberInput label="Giá" value={it.unitPrice} readOnly />
                            <Button
                                color="red"
                                variant="light"
                                size="xs"
                                leftSection={<IconTrash size={14} />}
                                onClick={() => removeItem(newSale, setNewSale, i)}
                            >
                                Xóa
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between mt-4 font-semibold text-lg text-blue-700">
                    <span>Tổng cộng:</span>
                    <span>{newSale.totalAmount.toLocaleString()} ₫</span>
                </div>

                <div className="flex justify-end mt-4">
                    <Button color="green" onClick={handleAddSale}>
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
                title="Cập nhật hóa đơn"
            >
                {updateModal.data && (
                    <>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <TextInput
                                label="Người mua"
                                value={updateModal.data.buyerName}
                                onChange={(e) =>
                                    setUpdateModal({
                                        ...updateModal,
                                        data: {
                                            ...updateModal.data,
                                            buyerName: e.target.value,
                                        },
                                    })
                                }
                            />
                            <TextInput
                                label="Liên hệ"
                                value={updateModal.data.buyerContact}
                                onChange={(e) =>
                                    setUpdateModal({
                                        ...updateModal,
                                        data: {
                                            ...updateModal.data,
                                            buyerContact: e.target.value,
                                        },
                                    })
                                }
                            />
                        </div>

                        <div className="border-t pt-2">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-semibold text-blue-600">Danh sách thuốc</p>
                                <Button
                                    size="xs"
                                    color="green"
                                    variant="light"
                                    onClick={() => addItem(updateModal.data, (data) =>
                                        setUpdateModal({
                                            ...updateModal,
                                            data,
                                        })
                                    )}
                                >
                                    + Thêm thuốc
                                </Button>
                            </div>

                            {updateModal.data.saleItems.map((it, i) => (
                                <div
                                    key={i}
                                    className="grid grid-cols-4 gap-2 mb-2 items-end"
                                >
                                    <MedicineColumn
                                        item={it}
                                        index={i}
                                        state={updateModal.data}
                                        setter={(data) => setUpdateModal({ ...updateModal, data })}
                                    />
                                    <NumberInput
                                        label="SL"
                                        min={1}
                                        value={it.quantity}
                                        onChange={(v) =>
                                            handleQuantityChange(
                                                i,
                                                v,
                                                updateModal.data,
                                                (data) =>
                                                    setUpdateModal({ ...updateModal, data })
                                            )
                                        }
                                    />
                                    <NumberInput label="Giá" value={it.unitPrice} readOnly />
                                    <Button
                                        color="red"
                                        variant="light"
                                        size="xs"
                                        leftSection={<IconTrash size={14} />}
                                        onClick={() =>
                                            removeItem(updateModal.data, (data) =>
                                                setUpdateModal({ ...updateModal, data }), i
                                            )
                                        }
                                    >
                                        Xóa
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between mt-4 font-semibold text-lg text-blue-700">
                            <span>Tổng cộng:</span>
                            <span>
                                {updateModal.data.totalAmount?.toLocaleString()} ₫
                            </span>
                        </div>

                        <div className="flex justify-end mt-4">
                            <Button color="orange" onClick={handleUpdateSale}>
                                Lưu thay đổi
                            </Button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default Sale;