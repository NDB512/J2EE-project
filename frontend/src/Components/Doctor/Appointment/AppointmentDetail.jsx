import React, { useEffect, useState } from 'react';
import { Breadcrumbs, Card, Text, Title, Divider, Badge, Group, Tabs } from '@mantine/core';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Content/AuthContext';
import dayjs from 'dayjs';
import { IconPhoto, IconMessageCircle, IconSettings, IconClipboardHeart, IconStethoscope, IconVaccine } from '@tabler/icons-react';
import ApReport from './ApReport';
import Prescriptions from './Prescriptions';

const AppointmentDetail = () => {
    const { id } = useParams();
    const { getAppointmentDetailsWithName } = useAuth();
    const [appointment, setAppointment] = useState(null);

    // Hàm map trạng thái -> label tiếng Việt
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

    // Hàm map trạng thái -> màu Mantine
    const getStatusColor = (status) => {
        switch (status) {
        case 'PENDING': return 'yellow';
        case 'SCHEDULED': return 'blue';
        case 'RESCHEDULED': return 'violet';
        case 'CANCELLED': return 'red';
        case 'COMPLETED': return 'green';
        case 'NO_SHOW': return 'gray';
        default: return 'dark';
        }
    };

    useEffect(() => {
        if (!id) return;
        getAppointmentDetailsWithName(id)
        .then((res) => setAppointment(res))
        .catch((err) => console.error('Lỗi khi tải chi tiết lịch hẹn:', err));
    }, [id]);

    if (!appointment) {
        return (
        <div className="p-6">
            <Breadcrumbs mb="md">
            <Link className="text-blue-400 hover:underline" to="/doctor/dashboard">Dashboard</Link>
            <Link className="text-blue-400 hover:underline" to="/doctor/appointments">Cuộc hẹn</Link>
            <Text c="dimmed">Chi tiết</Text>
            </Breadcrumbs>
            <Text>Đang tải dữ liệu...</Text>
        </div>
        );
    }

    return (
        <div className="p-6">
            {/* Breadcrumb */}
            <Breadcrumbs mb="md">
                <Link className="text-blue-400 hover:underline" to="/doctor/dashboard">Dashboard</Link>
                <Link className="text-blue-400 hover:underline" to="/doctor/appointments">Cuộc hẹn</Link>
                <Text c="dimmed">Chi tiết</Text>
            </Breadcrumbs>

            {/* Card thông tin */}
            <Card shadow="md" radius="lg" withBorder>
                <Group position="apart" mb="sm">
                    <Title order={3} c="blue">Chi tiết cuộc hẹn</Title>
                    <Badge color={getStatusColor(appointment.status)} size="lg" variant="filled">
                        {getStatusLabel(appointment.status)}
                    </Badge>
                </Group>

                <Divider mb="sm" />

                <div className="space-y-2 text-sm">
                    <Text><b>Bệnh nhân:</b> {appointment.patientName || `#${appointment.patientId}`}</Text>
                    <Text><b>Bác sĩ phụ trách:</b> {appointment.doctorName || `#${appointment.doctorId}`}</Text>
                    <Text><b>Ngày hẹn:</b> {dayjs(appointment.appointmentDate).format('DD/MM/YYYY HH:mm')}</Text>
                    <Text><b>Địa điểm:</b> {appointment.location || 'Chưa xác định'}</Text>
                    <Text><b>Lý do khám:</b> {appointment.reason || 'Không có'}</Text>
                    <Text><b>Ghi chú:</b> {appointment.notes || 'Không có'}</Text>

                    {/* Thông tin trạng thái bổ sung */}
                    {appointment.statusReason && (
                        <Text c="dimmed">
                        <b>Lý do hủy/đổi:</b> {appointment.statusReason}
                        </Text>
                    )}
                    {appointment.cancelledAt && (
                        <Text c="dimmed">
                        <b>Thời điểm hủy:</b> {dayjs(appointment.cancelledAt).format('DD/MM/YYYY HH:mm')}
                        </Text>
                    )}
                    {appointment.completedAt && (
                        <Text c="dimmed">
                        <b>Thời điểm hoàn thành:</b> {dayjs(appointment.completedAt).format('DD/MM/YYYY HH:mm')}
                        </Text>
                    )}
                </div>
            </Card>

            <Tabs variant="pills" my="md" defaultValue="medical">
                <Tabs.List>
                    <Tabs.Tab value="medical" leftSection={<IconStethoscope size={20} />}>
                        Lịch sử khám
                    </Tabs.Tab>
                    <Tabs.Tab value="prescription" leftSection={<IconVaccine size={20} />}>
                        Đơn thuốc
                    </Tabs.Tab>
                    <Tabs.Tab value="report" leftSection={<IconClipboardHeart size={20} />}>
                        Báo cáo
                    </Tabs.Tab>
                </Tabs.List>
                
                <Divider my="md" />

                <Tabs.Panel value="medical">
                    Lịch sử khám
                </Tabs.Panel>

                <Tabs.Panel value="prescription">
                    {appointment && <Prescriptions {...appointment} />}
                </Tabs.Panel>

                <Tabs.Panel value="report">
                    {appointment && <ApReport {...appointment} />}
                </Tabs.Panel>
            </Tabs>
        </div>
    );
};

export default AppointmentDetail;
