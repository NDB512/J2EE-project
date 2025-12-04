import React, { useEffect, useState } from "react";
import { Modal, Button, Select, TextInput, Stack, DateInput, NumberInput, Textarea, Group, Divider, Title } from "@mantine/core";
import { useForm } from '@mantine/form';
import { useAuth } from "../../../Content/AuthContext";
import { errorNotification, successNotification } from "../../../Utils/Notification";
import { genders, bloodGroups } from '../../../Data/DropdownData';  // Giả sử có dropdown data từ trước
import { IconCheck, IconX } from '@tabler/icons-react';

const ModalAddMember = ({ opened, onClose, familyId, onAdded, members }) => {
    const { getPatientDropdowns, addMemberToFamily } = useAuth();

    const [addType, setAddType] = useState('existing');  // 'existing' cho tài khoản có sẵn, 'new' cho tạo mới (dependent)
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form cho tạo mới (dependent)
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

                console.log("Existing IDs:", existingIds);

                setPatients(
                    res
                        .filter(p => !existingIds.includes(p.id))
                        .map(p => ({
                            value: p.id.toString(),
                            label: `${p.name} (${p.phone || 'Không có số điện thoại'})`,
                        }))
                );
            } catch (err) {
                errorNotification("Không thể tải danh sách bệnh nhân!");
            }
        };
        if (opened && addType === 'existing') {
            loadPatients();
        }
    }, [opened, addType, members]);

    const handleAddExisting = async () => {
        const selectedPatientId = newForm.values.selectedPatient;  // Sử dụng state riêng cho selected
        if (!selectedPatientId) return errorNotification("Vui lòng chọn thành viên.");

        setLoading(true);
        try {
            await addMemberToFamily({
                familyId: Number(familyId),
                patientId: Number(selectedPatientId),
                roleInFamily: newForm.values.roleInFamily || "Member",
                isDependent: false,  // Existing là independent
            });
            successNotification("Thêm thành viên thành công!");
            onAdded();
            onClose();
        } catch (err) {
            errorNotification("Lỗi khi thêm thành viên: " + (err.message || err));
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = newForm.onSubmit(async (values) => {
        setLoading(true);
        try {
            await addMemberToFamily({
                familyId: Number(familyId),
                requesterId: user.id,  // Từ AuthContext
                requesterRole: 'HEAD',
                name: values.name,
                phone: values.phone,
                address: values.address,
                gender: values.gender,
                dateOfBirth: values.dateOfBirth,
                citizenId: values.citizenId,
                bloodType: values.bloodType,
                allergies: values.allergies,
                medicalHistory: values.medicalHistory,
                emergencyContact: values.emergencyContact,
                insuranceDetails: values.insuranceDetails,
                roleInFamily: values.roleInFamily,
                isDependent: true,  // Tạo mới là dependent
            });
            successNotification("Tạo profile thành công!");
            onAdded();
            onClose();
        } catch (err) {
            errorNotification("Lỗi khi tạo profile: " + (err.message || err));
        } finally {
            setLoading(false);
        }
    });

    const switchAddType = (type) => {
        setAddType(type);
        newForm.reset();  // Reset form khi switch
        if (type === 'existing') {
            // Load patients nếu chưa
        }
    };

    return (
        <Modal 
            opened={opened} 
            onClose={onClose} 
            title="Thêm thành viên vào gia đình" 
            centered 
            size={addType === 'new' ? 'xl' : 'md'}
        >
            <Stack gap="md">
                {/* Chọn loại thêm */}
                <Select
                    label="Loại thành viên"
                    data={[
                        { value: 'existing', label: 'Thêm từ tài khoản có sẵn (invite)' },
                        { value: 'new', label: 'Tạo profile mới (phụ thuộc, như trẻ em/lớn tuổi)' }
                    ]}
                    value={addType}
                    onChange={switchAddType}
                    mb="md"
                />

                {addType === 'existing' ? (
                    // Phần thêm từ existing (tài khoản có sẵn)
                    <>
                        <Select
                            label="Chọn bệnh nhân"
                            placeholder="Tìm kiếm..."
                            searchable
                            data={patients}
                            value={newForm.values.selectedPatient}  // Sử dụng form value
                            onChange={(val) => newForm.setFieldValue('selectedPatient', val)}
                            mb="md"
                        />

                        <TextInput
                            label="Vai trò trong gia đình"
                            placeholder="Ví dụ: Vợ, Chồng..."
                            {...newForm.getInputProps('roleInFamily')}
                            mb="md"
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
                    // Phần tạo mới (dependent profile)
                    <>
                        <Divider />
                        <Title order={4}>Thông tin profile mới</Title>
                        <Stack gap="sm">
                            <TextInput label="Họ tên" {...newForm.getInputProps('name')} required />
                            <DateInput 
                                label="Ngày sinh" 
                                {...newForm.getInputProps('dateOfBirth')} 
                                valueFormat="DD/MM/YYYY" 
                                clearable 
                                required 
                            />
                            <TextInput 
                                label="Vai trò trong gia đình" 
                                placeholder="Con, Bố/Mẹ..." 
                                {...newForm.getInputProps('roleInFamily')} 
                                required 
                            />
                            <TextInput label="Số điện thoại" {...newForm.getInputProps('phone')} />
                            <TextInput label="Địa chỉ" {...newForm.getInputProps('address')} />
                            <Select 
                                label="Giới tính" 
                                data={genders} 
                                searchable 
                                {...newForm.getInputProps('gender')} 
                            />
                            <NumberInput 
                                label="CCCD" 
                                {...newForm.getInputProps('citizenId')} 
                                hideControls 
                            />
                            <Select 
                                label="Nhóm máu" 
                                data={bloodGroups} 
                                searchable 
                                {...newForm.getInputProps('bloodType')} 
                            />
                            <Textarea 
                                label="Dị ứng" 
                                placeholder="Liệt kê dị ứng, cách nhau bởi dấu phẩy" 
                                {...newForm.getInputProps('allergies')} 
                            />
                            <Textarea 
                                label="Tiền sử bệnh" 
                                {...newForm.getInputProps('medicalHistory')} 
                            />
                            <TextInput 
                                label="Liên hệ khẩn cấp" 
                                {...newForm.getInputProps('emergencyContact')} 
                            />
                            <TextInput 
                                label="Thông tin bảo hiểm" 
                                {...newForm.getInputProps('insuranceDetails')} 
                            />
                        </Stack>

                        <Button 
                            fullWidth 
                            type="submit" 
                            onClick={handleAddNew} 
                            loading={loading}
                            leftSection={<IconCheck />}
                        >
                            Tạo profile & Thêm
                        </Button>
                    </>
                )}

                <Group justify="flex-end" mt="xs">
                    <Button 
                        variant="outline" 
                        onClick={onClose} 
                        leftSection={<IconX />}
                        disabled={loading}
                    >
                        Hủy
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default ModalAddMember;