import React, { useEffect } from "react";
import { Modal, Button, TextInput, Stack, NumberInput, Textarea, Group } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Select } from "@mantine/core";
import { useForm } from '@mantine/form';
import { genders, bloodGroups } from '../../../Data/DropdownData';
import { IconCheck, IconX } from '@tabler/icons-react';

const ModalEditDependent = ({ opened, onClose, patient, onSubmit }) => {
    const form = useForm({
        initialValues: {
            name: patient?.name || '',
            phone: patient?.phone || '',
            address: patient?.address || '',
            gender: patient?.gender || '',
            dateOfBirth: patient?.dateOfBirth ? new Date(patient.dateOfBirth) : null,
            citizenId: patient?.citizenId || '',
            bloodType: patient?.bloodType || '',
            allergies: patient?.allergies || '',
            medicalHistory: patient?.medicalHistory || '',
            emergencyContact: patient?.emergencyContact || '',
            insuranceDetails: patient?.insuranceDetails || '',
            roleInFamily: patient?.roleInFamily || '',
        },
        validate: {
            name: (value) => value ? null : 'Tên bắt buộc',
        }
    });

    useEffect(() => {
        if (patient) {
            form.setValues({
                name: patient.name || '',
                phone: patient.phone || '',
                address: patient.address || '',
                gender: patient.gender || '',
                dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth) : null,
                citizenId: patient.citizenId || '',
                bloodType: patient.bloodType || '',
                allergies: patient.allergies || '',
                medicalHistory: patient.medicalHistory || '',
                emergencyContact: patient.emergencyContact || '',
                insuranceDetails: patient.insuranceDetails || '',
                roleInFamily: patient.roleInFamily || '',
            });
        }
    }, [patient]);

    const handleSubmit = (values) => {
        onSubmit(values);
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Chỉnh sửa profile phụ thuộc" centered size="xl">
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="sm">
                    <TextInput label="Họ tên" {...form.getInputProps('name')} required />
                    <DateInput 
                        label="Ngày sinh" 
                        {...form.getInputProps('dateOfBirth')} 
                        valueFormat="DD/MM/YYYY" 
                        clearable 
                    />
                    <TextInput 
                        label="Vai trò trong gia đình" 
                        {...form.getInputProps('roleInFamily')} 
                    />
                    <TextInput label="Số điện thoại" {...form.getInputProps('phone')} />
                    <TextInput label="Địa chỉ" {...form.getInputProps('address')} />
                    <Select 
                        label="Giới tính" 
                        data={genders} 
                        searchable 
                        {...form.getInputProps('gender')} 
                    />
                    <NumberInput 
                        label="CCCD" 
                        {...form.getInputProps('citizenId')} 
                        hideControls 
                    />
                    <Select 
                        label="Nhóm máu" 
                        data={bloodGroups} 
                        searchable 
                        {...form.getInputProps('bloodType')} 
                    />
                    <Textarea 
                        label="Dị ứng" 
                        {...form.getInputProps('allergies')} 
                    />
                    <Textarea 
                        label="Tiền sử bệnh" 
                        {...form.getInputProps('medicalHistory')} 
                    />
                    <TextInput 
                        label="Liên hệ khẩn cấp" 
                        {...form.getInputProps('emergencyContact')} 
                    />
                    <TextInput 
                        label="Thông tin bảo hiểm" 
                        {...form.getInputProps('insuranceDetails')} 
                    />
                </Stack>
                <Group justify="flex-end" mt="xl">
                    <Button variant="outline" onClick={onClose} leftSection={<IconX />}>
                        Hủy
                    </Button>
                    <Button type="submit" leftSection={<IconCheck />}>
                        Cập nhật
                    </Button>
                </Group>
            </form>
        </Modal>
    );
};

export default ModalEditDependent;