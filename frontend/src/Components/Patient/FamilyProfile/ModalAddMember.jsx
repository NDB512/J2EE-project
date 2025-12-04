import React, { useEffect, useState } from "react";
import { Modal, Button, Select, TextInput, NumberInput, Textarea, Group, Divider, Title } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from '@mantine/form';
import { useAuth } from "../../../Content/AuthContext";
import { errorNotification, successNotification } from "../../../Utils/Notification";
import { genders, bloodGroups } from '../../../Data/DropdownData';
import { IconCheck, IconX } from '@tabler/icons-react';

const ModalAddMember = ({ opened, onClose, familyId, onAdded, members }) => {
    const { getPatientDropdowns, addMemberToFamily, user } = useAuth();

    const [addType, setAddType] = useState('existing');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);

    const newForm = useForm({
        initialValues: {
            name: '',
            phone: '',
            address: '',
            gender: '',
            dateOfBirth: null,
            citizenId: '',
            bloodType: '',
            allergies: '',
            medicalHistory: '',
            emergencyContact: '',
            insuranceDetails: '',
            roleInFamily: '',
            selectedPatient: '',
        },
        validate: {
            name: (value) => value ? null : 'Tên bắt buộc',
            dateOfBirth: (value) => value ? null : 'Ngày sinh bắt buộc',
            roleInFamily: (value) => value ? null : 'Vai trò trong gia đình bắt buộc',
        }
    });

    useEffect(() => {
        const loadPatients = async () => {
            try {
                const res = await getPatientDropdowns();
                const existingIds = members.map(m => m.id);

                setPatients(
                    res
                        .filter(p => !existingIds.includes(p.id))
                        .map(p => ({
                            value: p.id.toString(),
                            label: `${p.name} (${p.phone || 'Không có số'})`,
                        }))
                );
            } catch (err) {
                errorNotification("Không thể tải danh sách bệnh nhân!");
            }
        };

        if (opened && addType === 'existing') loadPatients();
    }, [opened, addType, members]);

    const handleAddExisting = async () => {
        const selectedPatientId = newForm.values.selectedPatient;

        if (!selectedPatientId) 
            return errorNotification("Vui lòng chọn thành viên.");

        setLoading(true);
        try {
            await addMemberToFamily({
                familyId: Number(familyId),
                patientId: Number(selectedPatientId),
                roleInFamily: newForm.values.roleInFamily || "Member",
                isDependent: false,
            });

            successNotification("Thêm thành viên thành công!");
            onAdded();
            onClose();

        } catch (err) {
            errorNotification("Lỗi khi thêm thành viên!");
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = newForm.onSubmit(async (values) => {
        setLoading(true);
        try {
            await addMemberToFamily({
                familyId: Number(familyId),
                requesterId: user.id,
                requesterRole: 'HEAD',
                ...values,
                isDependent: true,
            });

            successNotification("Tạo profile thành công!");
            onAdded();
            onClose();

        } catch (err) {
            errorNotification("Lỗi khi tạo profile!");
        } finally {
            setLoading(false);
        }
    });

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Thêm thành viên vào gia đình"
            centered
            size={addType === 'new' ? 'xl' : 'md'}
        >
            {/* THAY Stack → div */}
            <div className="flex flex-col gap-4">

                <Select
                    label="Loại thành viên"
                    data={[
                        { value: 'existing', label: 'Thêm từ tài khoản có sẵn' },
                        { value: 'new', label: 'Tạo profile mới (phụ thuộc)' }
                    ]}
                    value={addType}
                    onChange={(v) => setAddType(v)}
                />

                {addType === "existing" ? (
                    <>
                        <Select
                            label="Chọn bệnh nhân"
                            searchable
                            placeholder="Tìm kiếm..."
                            data={patients}
                            value={newForm.values.selectedPatient}
                            onChange={(v) => newForm.setFieldValue("selectedPatient", v)}
                        />

                        <TextInput
                            label="Vai trò trong gia đình"
                            placeholder="Ví dụ: Vợ, Chồng..."
                            {...newForm.getInputProps("roleInFamily")}
                        />

                        <Button
                            fullWidth
                            onClick={handleAddExisting}
                            loading={loading}
                            leftSection={<IconCheck />}
                        >
                            Thêm thành viên
                        </Button>
                    </>
                ) : (
                    <>
                        <Divider />
                        <Title order={4}>Thông tin profile mới</Title>

                        {/* THAY Stack → div */}
                        <div className="flex flex-col gap-3">

                            <TextInput label="Họ tên" required {...newForm.getInputProps("name")} />
                            <DateInput label="Ngày sinh" required {...newForm.getInputProps("dateOfBirth")} />

                            <TextInput label="Vai trò trong gia đình" required {...newForm.getInputProps("roleInFamily")} />

                            <TextInput label="Số điện thoại" {...newForm.getInputProps("phone")} />
                            <TextInput label="Địa chỉ" {...newForm.getInputProps("address")} />

                            <Select label="Giới tính" data={genders} {...newForm.getInputProps("gender")} />

                            <NumberInput label="CCCD" hideControls {...newForm.getInputProps("citizenId")} />

                            <Select label="Nhóm máu" data={bloodGroups} {...newForm.getInputProps("bloodType")} />

                            <Textarea label="Dị ứng" {...newForm.getInputProps("allergies")} />
                            <Textarea label="Tiền sử bệnh" {...newForm.getInputProps("medicalHistory")} />

                            <TextInput label="Liên hệ khẩn cấp" {...newForm.getInputProps("emergencyContact")} />
                            <TextInput label="Thông tin bảo hiểm" {...newForm.getInputProps("insuranceDetails")} />
                        </div>

                        <Button
                            fullWidth
                            loading={loading}
                            leftSection={<IconCheck />}
                            onClick={handleAddNew}
                        >
                            Tạo profile & Thêm
                        </Button>
                    </>
                )}

                <Group justify="flex-end">
                    <Button 
                        variant="outline" 
                        onClick={onClose}
                        leftSection={<IconX />}
                    >
                        Hủy
                    </Button>
                </Group>
            </div>
        </Modal>
    );
};

export default ModalAddMember;
