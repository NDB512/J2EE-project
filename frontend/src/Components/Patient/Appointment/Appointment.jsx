import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button, Textarea, TextInput, Modal, LoadingOverlay, Tooltip, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconSearch, IconEdit, IconX } from '@tabler/icons-react';
import { useAuth } from '../../../Content/AuthContext';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import dayjs from 'dayjs';
import { visitReasons } from "../../../Data/DropdownData";
import { Tag } from 'primereact/tag';
import { Toolbar } from 'primereact/toolbar';

const cancelReasons = [
    { value: "Bệnh nhân bận", label: "Bệnh nhân bận" },
    { value: "Đổi lịch khám", label: "Đổi lịch khám" },
    { value: "Nhầm lịch hẹn", label: "Nhầm lịch hẹn" },
    { value: "Khác", label: "Khác" },
];

const Appointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);
    const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
    const [visible, { open: showOverlay, close: hideOverlay }] = useDisclosure(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [cancelConfirmOpened, setCancelConfirmOpened] = useState(false);
    const [cancelId, setCancelId] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [filterMode, setFilterMode] = useState('TODAY'); // TODAY | UPCOMING | FINISHED

    const { 
        getDoctorDropdown, 
        getAppointmentsByPatient, 
        user, 
        createAppointment,
        updateAppointment,
        cancelAppointment
    } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getAppointmentsByPatient(user?.profileId);
                setAppointments(data);
            } catch (err) {
                console.error("Lỗi khi tải danh sách lịch hẹn:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchDoctors = async () => {
            const data = await getDoctorDropdown();
            setDoctors(data.map(d => ({
                label: `${d.name} (${d.specialization})`,
                value: d.id
            })));
        };

        if (user?.profileId) {
            fetchData();
            fetchDoctors();
        }
    }, [user]);

    const reloadAppointments = async () => {
        const data = await getAppointmentsByPatient(user?.profileId);
        setAppointments(data);
    };

    const getStatusSeverity = (status) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'SCHEDULED': return 'info';
            case 'RESCHEDULED': return 'help';
            case 'CANCELLED': return 'danger';
            case 'COMPLETED': return 'success';
            case 'NO_SHOW': return 'secondary';
            default: return null;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'PENDING': return 'Chờ xác nhận';
            case 'SCHEDULED': return 'Đã lên lịch';
            case 'RESCHEDULED': return 'Đổi lịch';
            case 'CANCELLED': return 'Đã hủy';
            case 'COMPLETED': return 'Hoàn thành';
            case 'NO_SHOW': return 'Không đến';
            default: return 'Không xác định';
        }
    };

    const filteredAppointments = appointments.filter((appt) => {
        const apptDate = dayjs(appt.appointmentDate);
        const now = dayjs();

        if (filterMode === 'TODAY') {
            return apptDate.isSame(now, 'day');
        }
        if (filterMode === 'UPCOMING') {
            return apptDate.isAfter(now, 'day') && appt.status !== 'COMPLETED' && appt.status !== 'CANCELLED';
        }
        if (filterMode === 'FINISHED') {
            return appt.status === 'COMPLETED' || appt.status === 'CANCELLED';
        }
        return true;
    });

    const leftToolbarTemplate = () => (
        <div className="flex gap-2">
            <Button
                leftSection={<IconPlus size={16} />}
                onClick={open}
                color="green"
                variant="filled"
            >
                Đặt lịch
            </Button>
        </div>
    );

    const centerToolbarTemplate = () => (
        <div className="flex gap-2 items-center">
            <Button
                color={filterMode === 'TODAY' ? 'green' : 'gray'}
                variant={filterMode === 'TODAY' ? 'filled' : 'outline'}
                onClick={() => setFilterMode('TODAY')}
            >
                Hôm nay
            </Button>

            <Button
                color={filterMode === 'UPCOMING' ? 'blue' : 'gray'}
                variant={filterMode === 'UPCOMING' ? 'filled' : 'outline'}
                onClick={() => setFilterMode('UPCOMING')}
            >
                Sắp tới
            </Button>

            <Button
                color={filterMode === 'FINISHED' ? 'red' : 'gray'}
                variant={filterMode === 'FINISHED' ? 'filled' : 'outline'}
                onClick={() => setFilterMode('FINISHED')}
            >
                Đã xong / Hủy
            </Button>
        </div>
    );

    const endToolbarTemplate = () => (
        <div className="flex items-center">
            <TextInput
                leftSection={<IconSearch size={16} />}
                value={globalFilterValue}
                onChange={(e) => setGlobalFilterValue(e.target.value)}
                placeholder="Tìm kiếm..."
            />
        </div>
    );

    const form = useForm({
        initialValues: {
            doctorId: '',
            appointmentDate: null,
            reason: '',
            notes: '',
        },
        validate: {
            doctorId: (value) => (!value ? 'Vui lòng chọn bác sĩ' : null),
            appointmentDate: (value) => (!value ? 'Vui lòng chọn ngày giờ' : null),
            reason: (value) => (!value.trim() ? 'Vui lòng nhập lý do' : null),
        },
    });

    const handleSubmit = async (values) => {
        try {
        setLoading(true);
        showOverlay();

        const dto = {
            doctorId: values.doctorId,
            patientId: user?.profileId,
            appointmentDate: dayjs(values.appointmentDate).format('YYYY-MM-DDTHH:mm:ss'),
            reason: values.reason,
            notes: values.notes,
        };

            await createAppointment(dto);
            close();
            form.reset();
            await reloadAppointments();
        } finally {
            setLoading(false);
            hideOverlay();
        }
    };

    const editForm = useForm({
        initialValues: {
            appointmentDate: null,
            reason: '',
            notes: '',
        },
    });

    const handleEdit = (row) => {
        setSelectedAppointment(row);
        editForm.setValues({
            appointmentDate: new Date(row.appointmentDate),
            reason: row.reason,
            notes: row.notes || '',
        });
        openEdit();
    };

    const handleUpdate = async (values) => {
        try {
            await updateAppointment(selectedAppointment.id, {
                appointmentDate: dayjs(values.appointmentDate).format('YYYY-MM-DDTHH:mm:ss'),
                reason: values.reason,
                notes: values.notes,
            });
            closeEdit();
            await reloadAppointments();
        } catch (e) {
            console.error(e);
        }
    };

    const openCancelConfirm = (id) => {
        setCancelId(id);
        setCancelReason('');
        setCustomReason('');
        setCancelConfirmOpened(true);
    };

    const handleConfirmCancel = async () => {
        const reason = cancelReason === 'Khác' ? customReason.trim() : cancelReason;
        if (!reason) {
            alert("Vui lòng chọn hoặc nhập lý do hủy lịch hẹn!");
            return;
        }
        await cancelAppointment(cancelId, reason);
        await reloadAppointments();
        setCancelConfirmOpened(false);
    };

    const actionBody = (row) => {
        const disabled = row.status === 'CANCELLED' || row.status === 'NO_SHOW';

        return (
            <div className="flex gap-2">
                <Tooltip label={disabled ? "Không thể chỉnh sửa lịch hẹn đã hủy/không đến" : "Sửa lịch hẹn"}>
                    <Button
                        color="blue"
                        size="xs"
                        onClick={() => handleEdit(row)}
                        leftSection={<IconEdit size={16} />}
                        disabled={disabled}
                    >
                        Sửa
                    </Button>
                </Tooltip>

                <Tooltip label={disabled ? "Lịch hẹn này đã bị hủy hoặc không đến" : "Hủy lịch hẹn"}>
                    <Button
                        color="red"
                        size="xs"
                        onClick={() => openCancelConfirm(row.id)}
                        leftSection={<IconX size={16} />}
                        disabled={disabled}
                    >
                        Hủy
                    </Button>
                </Tooltip>
            </div>
        );
    };

    const statusBody = (row) => (
        <div>
            <Tag value={getStatusLabel(row.status)} severity={getStatusSeverity(row.status)} />
            {row.status === 'CANCELLED' && row.statusReason && (
                <div className="text-xs text-gray-500 mt-1">
                    <i>Lý do: {row.statusReason}</i>
                </div>
            )}
        </div>
    );

    // const header = renderHeader();

    return (
        <div className="card">
            <Toolbar
                className="mb-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm"
                start={leftToolbarTemplate}
                center={centerToolbarTemplate}
                end={endToolbarTemplate}
            />

            {/* DataTable đã dùng danh sách lọc */}
            <DataTable
                value={filteredAppointments}
                paginator
                rows={10}
                dataKey="id"
                loading={loading}
                emptyMessage="Không có lịch hẹn nào."
                globalFilter={globalFilterValue}
                className="shadow-md rounded-lg"
            >
                <Column field="doctorName" header="Bác sĩ" sortable />
                <Column field="appointmentDate" header="Ngày hẹn" body={(r) => dayjs(r.appointmentDate).format('DD/MM/YYYY HH:mm')} sortable />
                <Column field="reason" header="Lý do khám" sortable />
                <Column field="location" header="Địa điểm" />
                <Column header="Trạng thái" body={statusBody} sortable />
                <Column field="notes" header="Ghi chú" />
                <Column header="Hành động" body={actionBody} />
            </DataTable>

            {/* Modal đặt lịch */}
            <Modal opened={opened} onClose={close} size="lg" title={<div className="text-xl font-semibold text-green-400">Đặt lịch</div>} centered>

            <LoadingOverlay
                visible={visible}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
                loaderProps={{ color: 'pink', type: 'bars' }}
            />
                <form onSubmit={form.onSubmit(handleSubmit)} className="grid grid-cols-1 gap-5">

                    {/* Dropdown bác sĩ */}
                    <div>
                        <label htmlFor="doctor" className="font-semibold">
                            Bác sĩ <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                            id="doctor"
                            value={form.values.doctorId}
                            options={doctors}
                            onChange={(e) => form.setFieldValue('doctorId', e.value)}
                            placeholder="Chọn bác sĩ"
                            className="w-full md:w-30rem"
                        />
                        {form.errors.doctorId && (
                            <p className="text-red-500 text-sm mt-1">{form.errors.doctorId}</p>
                        )}
                    </div>

                    {/* Ngày giờ khám */}
                    <DateTimePicker
                        withAsterisk
                        label="Ngày & giờ khám"
                        placeholder="Chọn ngày và giờ hẹn"
                        minDate={new Date()}
                        value={form.values.appointmentDate}
                        onChange={(val) => form.setFieldValue('appointmentDate', val)}
                        error={form.errors.appointmentDate}
                    />

                    {/* Lý do */}
                    <div>
                        <label htmlFor="reason" className="font-semibold">
                            Lý do khám <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                            id="reason"
                            value={form.values.reason}
                            options={visitReasons.map((r) => ({ label: r, value: r }))}
                            onChange={(e) => form.setFieldValue('reason', e.value)}
                            placeholder="Chọn lý do khám"
                            className="w-full md:w-30rem"
                        />
                        {form.errors.reason && (
                            <p className="text-red-500 text-sm mt-1">{form.errors.reason}</p>
                        )}
                    </div>


                    {/* Ghi chú */}
                    <Textarea
                        label="Ghi chú"
                        placeholder="Viết ghi chú (không bắt buộc)"
                        {...form.getInputProps('notes')}
                    />

                    {/* Nút Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-md"
                    >
                        {loading ? 'Đang gửi...' : 'Đặt lịch'}
                    </button>
                </form>
            </Modal>

            {/* Modal chỉnh sửa */}
            <Modal opened={editOpened} onClose={closeEdit} size="lg" title={<div className="text-xl font-semibold text-blue-400">Cập nhật lịch hẹn</div>} centered>
                <form onSubmit={editForm.onSubmit(handleUpdate)} className="grid grid-cols-1 gap-5">
                    <DateTimePicker label="Ngày & giờ khám" value={editForm.values.appointmentDate || new Date()} minDate={new Date()} onChange={(val) => editForm.setFieldValue('appointmentDate', val)} />
                    <Dropdown value={editForm.values.reason} options={visitReasons.map(r => ({ label: r, value: r }))} onChange={(e) => editForm.setFieldValue('reason', e.value)} placeholder="Lý do khám" />
                    <Textarea label="Ghi chú" {...editForm.getInputProps('notes')} />
                    <Button type="submit" color="blue">Lưu thay đổi</Button>
                </form>
            </Modal>

            {/* Modal xác nhận hủy */}
            <Modal
                opened={cancelConfirmOpened}
                onClose={() => setCancelConfirmOpened(false)}
                centered
                title={<div className="text-lg font-semibold text-red-500">Xác nhận hủy lịch hẹn</div>}
            >
                <p className="mb-3">Vui lòng chọn hoặc nhập lý do hủy lịch hẹn:</p>
                <Select
                    data={cancelReasons}
                    placeholder="Chọn lý do hủy"
                    value={cancelReason}
                    onChange={setCancelReason}
                    clearable
                    required
                />
                {cancelReason === 'Khác' && (
                    <Textarea
                        label="Lý do chi tiết"
                        placeholder="Nhập lý do hủy..."
                        value={customReason}
                        onChange={(e) => setCustomReason(e.currentTarget.value)}
                        required
                        mt="sm"
                    />
                )}
                <div className="flex justify-end mt-4 gap-3">
                    <Button variant="default" onClick={() => setCancelConfirmOpened(false)}>
                        Không
                    </Button>
                    <Button color="red" onClick={handleConfirmCancel}>
                        Đồng ý hủy
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default Appointment;