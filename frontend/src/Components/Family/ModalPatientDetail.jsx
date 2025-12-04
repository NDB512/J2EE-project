import React from "react";
import { Modal, Text, Title, Paper, Stack, Group, Avatar, Divider, Flex, Button } from "@mantine/core";
import { 
    IconUser, 
    IconAt, 
    IconPhone, 
    IconCalendar, 
    IconGenderAgender, 
    IconMapPin, 
    IconId, 
    IconDroplet, 
    IconAlertCircle, 
    IconStethoscope, 
    IconPhoneCall, 
    IconShield, 
    IconClipboard, 
    IconX, 
    IconEdit  // THÊM: Icon cho nút sửa
} from "@tabler/icons-react";

const ModalPatientDetail = ({ opened, onClose, patient, isHeadOrAdmin }) => {  // THÊM: Prop isHeadOrAdmin
    if (!patient) return null;

    // Hàm hiển thị giá trị với fallback
    const displayValue = (value) => {
        if (value === null || value === undefined || value === '') {
            return <span className="text-gray-500 italic">Chưa cập nhật</span>;
        }
        return value;
    };

    // Format date
    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        return new Date(dateStr).toLocaleDateString('vi-VN');
    };

    // Format allergies nếu là string
    const formatAllergies = (allergies) => {
        if (!allergies) return null;
        return allergies.split(",").map(a => a.trim()).join(', ');
    };

    // Component cho từng field - Tương tự Profile nhưng chỉ view mode
    const PatientField = ({ icon: Icon, label, value, className = "" }) => (
        <Paper shadow="xs" p="md" radius="md" className={`bg-white border border-gray-100 overflow-hidden ${className}`}>
            <Stack gap="xs">
                <Group gap="xs" className="text-teal-700 font-semibold">
                    <Icon size={18} />
                    <Text size="sm" fw={600}>{label}</Text>
                </Group>
                <Text size="lg" c="dark" className="font-medium">
                    {displayValue(value)}
                </Text>
            </Stack>
        </Paper>
    );

    // THÊM: Logic cho nút sửa (chỉ dependent và head/admin)
    const showEditButton = isHeadOrAdmin && patient.isDependent;

    return (
        <Modal 
            opened={opened} 
            onClose={onClose} 
            title={
                <Flex align="center" gap="md">
                    <Avatar size="md" color="teal" radius={100}>
                        <IconUser size={24} />
                    </Avatar>
                    <div>
                        <Title order={3} c="dark">{patient.name || 'Không xác định'}</Title>
                        <Text size="sm" c="dimmed">Thông tin chi tiết hồ sơ sức khỏe</Text>
                    </div>
                </Flex>
            } 
            centered 
            size="xl"  // Tăng size để fit nhiều fields
            radius="lg"
            padding="xl"
        >
            <Stack gap="md">
                {/* Basic Info */}
                <div>
                    <Title order={4} c="gray" mb="xs">Thông tin cơ bản</Title>
                    <Stack gap="sm">
                        <PatientField
                            icon={IconAt}
                            label="Email"
                            value={patient.email}
                        />
                        <PatientField
                            icon={IconPhone}
                            label="Số điện thoại"
                            value={patient.phone}
                        />
                        <PatientField
                            icon={IconCalendar}
                            label="Ngày sinh"
                            value={formatDate(patient.dateOfBirth)}
                        />
                        <PatientField
                            icon={IconGenderAgender}
                            label="Giới tính"
                            value={patient.gender}
                        />
                        <PatientField
                            icon={IconMapPin}
                            label="Địa chỉ"
                            value={patient.address}
                        />
                        <PatientField
                            icon={IconId}
                            label="CCCD"
                            value={patient.citizenId}
                        />
                    </Stack>
                </div>

                <Divider />

                {/* Health Info */}
                <div>
                    <Title order={4} c="gray" mb="xs">Thông tin sức khỏe</Title>
                    <Stack gap="sm">
                        <PatientField
                            icon={IconDroplet}
                            label="Nhóm máu"
                            value={patient.bloodType}
                        />
                        <PatientField
                            icon={IconAlertCircle}
                            label="Dị ứng"
                            value={formatAllergies(patient.allergies)}
                        />
                        <PatientField
                            icon={IconStethoscope}
                            label="Bệnh mãn tính"
                            value={patient.chronicDisease}
                        />
                        <PatientField
                            icon={IconClipboard}
                            label="Tiền sử bệnh"
                            value={patient.medicalHistory}
                        />
                        <PatientField
                            icon={IconPhoneCall}
                            label="Liên hệ khẩn cấp"
                            value={patient.emergencyContact}
                        />
                        <PatientField
                            icon={IconShield}
                            label="Thông tin bảo hiểm"
                            value={patient.insuranceDetails}
                        />
                    </Stack>
                </div>

                <Divider />

                {/* Action - THÊM: Nút Sửa cho dependent */}
                <Group justify="flex-end" mt="lg">
                    {showEditButton && (
                        <Button 
                            variant="light" 
                            color="teal" 
                            onClick={() => { /* Mở edit modal, ví dụ: onEdit(patient) từ prop nếu cần */ }}
                            leftSection={<IconEdit size={18} />}
                            size="md"
                            className="font-medium"
                        >
                            Sửa
                        </Button>
                    )}
                    <Button 
                        variant="outline" 
                        color="gray" 
                        onClick={onClose}
                        leftSection={<IconX size={18} />}
                        size="md"
                        className="font-medium"
                    >
                        Đóng
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default ModalPatientDetail;