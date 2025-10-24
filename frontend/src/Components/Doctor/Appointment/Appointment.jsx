import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, TextInput, Modal, Textarea, Select, Tooltip, ActionIcon } from "@mantine/core";
import { IconSearch, IconInfoCircle, IconEdit, IconEye } from "@tabler/icons-react";
import { Tag } from "primereact/tag";
import { Toolbar } from "primereact/toolbar";
import { useAuth } from "../../../Content/AuthContext";
import dayjs from "dayjs";
import { errorNotification } from "../../../Utils/Notification";
import { DateTimePicker } from "@mantine/dates";
import { useNavigate } from "react-router-dom";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "SCHEDULED", label: "Đã xác nhận" },
  { value: "RESCHEDULED", label: "Đổi lịch" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "NO_SHOW", label: "Không đến" },
];

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filterMode, setFilterMode] = useState("TODAY");
  const [detailModal, setDetailModal] = useState({ opened: false, data: null });
  const [statusModal, setStatusModal] = useState({ opened: false, id: null, status: "" });
  const [statusReason, setStatusReason] = useState("");
  const [newDateTime, setNewDateTime] = useState(null);
  const navigator = useNavigate()

  const { getAppointmentsByDoctor, updateAppointmentStatus, user } = useAuth();

  // --- Load appointments ---
  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAppointmentsByDoctor(user?.profileId);
      setAppointments(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.profileId) loadAppointments();
  }, [user]);

  // --- Utilities ---
  const getStatusSeverity = (status) => {
    switch (status) {
      case "PENDING": return "warning";
      case "SCHEDULED": return "info";
      case "RESCHEDULED": return "help";
      case "CANCELLED": return "danger";
      case "COMPLETED": return "success";
      case "NO_SHOW": return "secondary";
      default: return null;
    }
  };

  const getStatusLabel = (status) => {
    const opt = STATUS_OPTIONS.find(o => o.value === status);
    return opt ? opt.label : (status || "Không xác định");
  };

  // --- Lọc theo loại (hôm nay, sắp tới, đã xong) ---
  const filteredAppointments = appointments.filter((appt) => {
    const apptDate = dayjs(appt.appointmentDate);
    const now = dayjs();

    if (filterMode === "TODAY") return apptDate.isSame(now, "day");
    if (filterMode === "UPCOMING")
      return apptDate.isAfter(now, "day") && !["COMPLETED", "CANCELLED", "NO_SHOW"].includes(appt.status);
    if (filterMode === "FINISHED")
      return ["COMPLETED", "CANCELLED", "NO_SHOW"].includes(appt.status);
    return true;
  });

  // --- Tìm kiếm ---
  const visibleAppointments = filteredAppointments.filter((appt) => {
    const search = globalFilterValue.toLowerCase();
    return (
      appt.patientName?.toLowerCase().includes(search) ||
      appt.reason?.toLowerCase().includes(search) ||
      appt.notes?.toLowerCase().includes(search) ||
      appt.status?.toLowerCase().includes(search) ||
      dayjs(appt.appointmentDate).format("DD/MM/YYYY HH:mm").includes(search)
    );
  });

  // --- Toolbar ---
  const centerToolbarTemplate = () => (
    <div className="flex gap-2 items-center">
      <Button color={filterMode === "TODAY" ? "green" : "gray"} variant={filterMode === "TODAY" ? "filled" : "outline"} onClick={() => setFilterMode("TODAY")}>Hôm nay</Button>
      <Button color={filterMode === "UPCOMING" ? "blue" : "gray"} variant={filterMode === "UPCOMING" ? "filled" : "outline"} onClick={() => setFilterMode("UPCOMING")}>Sắp tới</Button>
      <Button color={filterMode === "FINISHED" ? "red" : "gray"} variant={filterMode === "FINISHED" ? "filled" : "outline"} onClick={() => setFilterMode("FINISHED")}>Đã xong / Hủy / Không đến</Button>
    </div>
  );

  const endToolbarTemplate = () => (
    <div className="flex items-center">
      <TextInput
        leftSection={<IconSearch size={16} />}
        value={globalFilterValue}
        onChange={(e) => setGlobalFilterValue(e.target.value)}
        placeholder="Tìm kiếm (theo tên, lý do, ngày...)"
        className="w-64"
      />
    </div>
  );

  // --- Body columns ---
  const appointmentDateBody = (row) => (
    <div>{dayjs(row.appointmentDate).format("DD/MM/YYYY HH:mm")}</div>
  );

  const patientNameBody = (row) => (
    <div>{row.patientName || `#${row.patientId}`}</div>
  );

  const statusBody = (row) => (
    <div>
      <Tag value={getStatusLabel(row.status)} severity={getStatusSeverity(row.status)} />
      {row.status === "CANCELLED" && row.statusReason && (
        <div className="text-xs text-gray-500 mt-1">Lý do: {row.statusReason}</div>
      )}
    </div>
  );

  const detailBody = (row) => (
    <Button
      size="xs"
      leftSection={<IconInfoCircle size={14} />}
      onClick={() => setDetailModal({ opened: true, data: row })}
    >
      Chi tiết
    </Button>
  );

  const actionBody = (row) => {
    const disabled = ["CANCELLED", "COMPLETED", "NO_SHOW"].includes(row.status);

    return (
      <div className="flex items-center justify-center gap-2">
        <Tooltip label="Xem chi tiết">
          <ActionIcon
            variant="light"
            color="blue"
            onClick={() => navigator("" + row.id)}
          >
            <IconEye size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Cập nhật trạng thái">
          <Button
            size="xs"
            onClick={() => {
              setStatusModal({ opened: true, id: row.id, status: "" });
              setStatusReason("");
            }}
            leftSection={<IconEdit size={14} />}
            disabled={disabled}
          >
            Trạng thái
          </Button>
        </Tooltip>
      </div>
    );
  };


  // --- Cập nhật trạng thái ---
  const performStatusUpdate = async () => {
    const { id, status } = statusModal;
    if (!id || !status) return;

    const needReason = ["CANCELLED", "RESCHEDULED"].includes(status);
    if (needReason && !statusReason.trim()) {
      errorNotification("Vui lòng nhập lý do (bắt buộc cho Hủy/Đổi lịch)");
      return;
    }

    if (status === "RESCHEDULED" && !newDateTime) {
      errorNotification("Vui lòng chọn ngày và giờ hẹn mới");
      return;
    }

    try {
      await updateAppointmentStatus(
        id,
        status,
        needReason ? statusReason : null,
        status === "RESCHEDULED" ? dayjs(newDateTime).format('YYYY-MM-DDTHH:mm:ss'): null
      );
      await loadAppointments();
      setStatusModal({ opened: false, id: null, status: "" });
      setStatusReason("");
      setNewDateTime(null);
    } catch (e) {
      console.error(e);
    }
  };


  // --- JSX ---
  return (
    <div className="card">
      <Toolbar className="mb-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm" center={centerToolbarTemplate} end={endToolbarTemplate} />

      <DataTable
        value={visibleAppointments}
        paginator
        rows={10}
        dataKey="id"
        loading={loading}
        emptyMessage="Không có lịch hẹn nào."
        className="shadow-md rounded-lg"
      >
        <Column header="Ngày hẹn" body={appointmentDateBody} sortable headerClassName="text-center" bodyClassName="text-center" />
        <Column header="Bệnh nhân" body={patientNameBody} sortable headerClassName="text-center" bodyClassName="text-center" />
        <Column header="Trạng thái" body={statusBody} sortable headerClassName="text-center" bodyClassName="text-center" />
        <Column header="Chi tiết" body={detailBody} headerClassName="text-center" bodyClassName="text-center" />
        <Column header="Hành động" body={actionBody} headerClassName="text-center" bodyClassName="text-center" />
      </DataTable>

      {/* Detail modal */}
      <Modal
        opened={detailModal.opened}
        onClose={() => setDetailModal({ opened: false, data: null })}
        centered
        size="lg"
        title={<div className="text-lg font-semibold text-blue-600">Chi tiết cuộc hẹn</div>}
      >
        {detailModal.data && (
          <div className="space-y-2 text-sm">
            <p><b>Bệnh nhân:</b> {detailModal.data.patientName || `#${detailModal.data.patientId}`}</p>
            <p><b>Ngày hẹn:</b> {dayjs(detailModal.data.appointmentDate).format("DD/MM/YYYY HH:mm")}</p>
            <p><b>Lý do khám:</b> {detailModal.data.reason || "Không có"}</p>
            <p><b>Ghi chú:</b> {detailModal.data.notes || "Không có"}</p>
            <p><b>Nơi khám:</b> {detailModal.data.location || "Chưa xác định"}</p>
            <p><b>Trạng thái:</b> {getStatusLabel(detailModal.data.status)}</p>
            {detailModal.data.statusReason && (<p><b>Lý do hủy/đổi:</b> {detailModal.data.statusReason}</p>)}
            {detailModal.data.cancelledAt && (<p><b>Thời điểm hủy:</b> {dayjs(detailModal.data.cancelledAt).format("DD/MM/YYYY HH:mm")}</p>)}
            {detailModal.data.completedAt && (<p><b>Thời điểm hoàn thành:</b> {dayjs(detailModal.data.completedAt).format("DD/MM/YYYY HH:mm")}</p>)}
          </div>
        )}
      </Modal>

      {/* Status update modal */}
      <Modal
        opened={statusModal.opened}
        onClose={() => {
          setStatusModal({ opened: false, id: null, status: "" });
          setStatusReason("");
          setNewDateTime(null);
        }}
        centered
        title={<div className="text-lg font-semibold text-indigo-600">Cập nhật trạng thái</div>}
      >
        <p className="mb-2">Chọn trạng thái mới:</p>

        {/* Dropdown chọn trạng thái */}
        <Select
          data={STATUS_OPTIONS}
          placeholder="Chọn trạng thái"
          value={statusModal.status}
          onChange={(val) => setStatusModal((prev) => ({ ...prev, status: val }))}
        />

        {/* Lý do (bắt buộc cho hủy hoặc đổi lịch) */}
        {["CANCELLED", "RESCHEDULED"].includes(statusModal.status) && (
          <Textarea
            placeholder="Nhập lý do (bắt buộc)"
            value={statusReason}
            onChange={(e) => setStatusReason(e.currentTarget.value)}
            minRows={3}
            mt="sm"
          />
        )}

        {/* Ngày giờ mới (bắt buộc khi đổi lịch) */}
        {statusModal.status === "RESCHEDULED" && (
          <DateTimePicker
            withAsterisk
            label="Ngày & giờ hẹn mới"
            placeholder="Chọn ngày và giờ hẹn"
            minDate={new Date()}
            value={newDateTime}
            onChange={(val) => setNewDateTime(val)}
            mt="sm"
          />
        )}

        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="default"
            onClick={() => {
              setStatusModal({ opened: false, id: null, status: "" });
              setStatusReason("");
              setNewDateTime(null);
            }}
          >
            Hủy
          </Button>

          <Button
            color="blue"
            onClick={performStatusUpdate}
            disabled={
              !statusModal.status ||
              (["CANCELLED", "RESCHEDULED"].includes(statusModal.status) && !statusReason.trim()) ||
              (statusModal.status === "RESCHEDULED" && !newDateTime)
            }
          >
            Cập nhật
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default DoctorAppointments;
