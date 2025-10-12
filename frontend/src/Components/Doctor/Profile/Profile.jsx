import { Avatar, Button, Divider, Table, TextInput, NumberInput, Select, TagsInput, Modal } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../Content/AuthContext';
import { IconEdit } from '@tabler/icons-react';
import '@mantine/dates/styles.css';
import { doctorSpecializations, genders } from '../../../Data/DropdownData';
import { useDisclosure } from '@mantine/hooks';

const Profile = () => {
    const { user, getDoctorInfo, updateDoctorInfo } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [formData, setFormData] = useState(null);
    const [opened, {open, close}] = useDisclosure(false);
    const [loading, setLoading] = useState(true);

    // Lấy tên hiển thị: ưu tiên name, nếu không có thì lấy phần trước @ của email, nếu không có email thì hiện "Khách"
    const userName = user?.name || user?.email?.split('@')[0] || 'Khách';

    // Gọi API
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await getDoctorInfo(user?.id);
                setProfileData(res);
                setFormData(res);
            } catch (err) {
                console.error("Lỗi khi lấy thông tin bác sĩ:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) fetchProfile();
    }, [user]);
    
    const handleChange = (field, value) => {
        setFormData((prev) => ({
        ...prev,
        [field]: value,
        }));
    };

    const handleCancel = () => {
        setFormData({
        ...profileData,
        });
        setEditMode(false);
    };

    const handleSave = async () => {
        try {
            const updated = await updateDoctorInfo(user?.id, formData);
            setProfileData(updated);
            setFormData(updated);
            setEditMode(false);
        } catch (err) {
            console.error("Lỗi khi cập nhật thông tin bác sĩ:", err);
        }
    };

    if (!formData) return <div className="p-10">Đang tải...</div>;

    if (loading) return <div className="p-10">Đang tải thông tin bác sĩ...</div>;

    return (
        <div className="p-10">
            {/* --- Header --- */}
            <div className="flex justify-between items-center mb-5">
                <div className="flex gap-5 items-center">
                <div className="flex flex-col items-center gap-3">
                    <Avatar variant="filled" src="/vite.svg" size={120} alt="Avatar" />
                    {editMode && <Button size="sm" onClick={open} variant='filled'>Cập nhập ảnh</Button>}
                </div>
                <div className="flex flex-col gap-3">
                    <div className="text-3xl font-medium text-neutral-900">
                    Xin chào, {userName}!
                    </div>
                    <div className="text-xl text-neutral-700">{user.email}</div>
                </div>
                </div>
                <Button
                    variant={editMode ? 'outline' : 'filled'}
                    color={editMode ? 'gray' : 'red'}
                    leftSection={<IconEdit />}
                    onClick={() => (editMode ? handleCancel() : setEditMode(true))}
                    >
                {editMode ? 'Hủy' : 'Chỉnh sửa'}
                </Button>
            </div>

            <Divider my="xl" />

            {/* --- Thông tin cá nhân --- */}
            <div>
                <div className="text-2xl font-medium text-neutral-900 mb-5">
                Thông tin cá nhân
                </div>

                <Table striped stripedColor="teal.0" verticalSpacing="md" withRowBorders={false}>
                    <Table.Tbody className="[&>tr]:!mb-3">

                        {/* Họ và tên */}
                        <Table.Tr>
                        <Table.Td className="font-semibold text-lg w-1/4">Họ và tên</Table.Td>
                        <Table.Td className="text-lg w-3/4">
                            {editMode ? (
                                <TextInput
                                value={formData.name}
                                maxLength={50}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Nhập họ tên"
                                />
                            ) : formData.name}
                        </Table.Td>
                        </Table.Tr>

                        {/* Ngày sinh */}
                        <Table.Tr>
                        <Table.Td className="font-semibold text-lg">Ngày sinh</Table.Td>
                        <Table.Td className="text-lg">
                            {editMode ? (
                            <DateInput
                                value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                                onChange={(value) => handleChange('dateOfBirth', value || null)}
                                valueFormat="DD/MM/YYYY"
                                label="Chọn ngày sinh"
                                clearable
                            />
                            ) : (
                                new Date(formData.dateOfBirth).toLocaleDateString('vi-VN')
                            )}
                        </Table.Td>
                        </Table.Tr>

                        {/* Số điện thoại */}
                        <Table.Tr>
                        <Table.Td className="font-semibold text-lg">Số điện thoại</Table.Td>
                        <Table.Td className="text-lg">
                            {editMode ? (
                            <NumberInput
                                value={formData.phone}
                                onChange={(val) => handleChange('phone', val)}
                                hideControls
                                maxLength={10}
                                placeholder='Nhập số điện thoại'
                            />
                            ) : (
                            formData.phone
                            )}
                        </Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Td className="font-semibold text-lg">Giới tính</Table.Td>
                            <Table.Td className="text-lg">
                                {editMode ? (
                                <Select
                                    data={genders}
                                    value={formData.gender}
                                    onChange={(val) => handleChange('gender', val)}
                                    placeholder="Chọn giới tính"
                                />
                                ) : (
                                formData.gender
                                )}
                            </Table.Td>
                        </Table.Tr>

                        {/* Địa chỉ */}
                        <Table.Tr>
                            <Table.Td className="font-semibold text-lg">Địa chỉ</Table.Td>
                            <Table.Td className="text-lg">
                                {editMode ? (
                                <TextInput
                                    value={formData.address}
                                    maxLength={100}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    placeholder='Nhập địa chỉ'
                                />
                                ) : (
                                formData.address
                                )}
                            </Table.Td>
                        </Table.Tr>

                        {/* CCCD */}
                        <Table.Tr>
                            <Table.Td className="font-semibold text-lg">CCCD</Table.Td>
                            <Table.Td className="text-lg">
                                {editMode ? (
                                <NumberInput
                                    value={formData.citizenId}
                                    hideControls
                                    maxLength={12}
                                    onChange={(val) => handleChange('citizenId', val)}
                                    placeholder='Nhập số CCCD'
                                />
                                ) : (
                                formData.citizenId
                                )}
                            </Table.Td>
                        </Table.Tr>

                        {/* --- Thông tin chuyên môn --- */}
                        <Table.Tr>
                            <Table.Td className="font-semibold text-lg">Chuyên khoa</Table.Td>
                            <Table.Td className="text-lg">
                                {editMode ? (
                                <Select
                                    data={doctorSpecializations}
                                    value={formData.specialization}
                                    onChange={(val) => handleChange('specialization', val)}
                                    placeholder="Chọn chuyên khoa"
                                />
                                ) : (
                                formData.specialization
                                )}
                            </Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Td className="font-semibold text-lg">Bằng cấp</Table.Td>
                            <Table.Td className="text-lg">
                                {editMode ? (
                                <TextInput
                                    value={formData.qualification}
                                    onChange={(e) => handleChange('qualification', e.target.value)}
                                    placeholder="VD: BS, ThS, TS..."
                                />
                                ) : (
                                formData.qualification
                                )}
                            </Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Td className="font-semibold text-lg">Số năm kinh nghiệm</Table.Td>
                            <Table.Td className="text-lg">
                                {editMode ? (
                                <NumberInput
                                    value={formData.yearsOfExperience}
                                    onChange={(val) => handleChange('yearsOfExperience', val)}
                                    hideControls
                                    placeholder="Nhập số năm kinh nghiệm"
                                    maxLength={2}
                                    max={70}
                                />
                                ) : (
                                `${formData.yearsOfExperience || 0} năm`
                                )}
                            </Table.Td>
                        </Table.Tr>

                        {/* --- Thông tin cơ sở làm việc --- */}
                        <Table.Tr>
                            <Table.Td className="font-semibold text-lg">Bệnh viện</Table.Td>
                            <Table.Td className="text-lg">
                                {editMode ? (
                                <TextInput
                                    value={formData.hospitalName}
                                    onChange={(e) => handleChange('hospitalName', e.target.value)}
                                    placeholder="Tên bệnh viện hoặc phòng khám"
                                />
                                ) : (
                                formData.hospitalName
                                )}
                            </Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Td className="font-semibold text-lg">Khoa</Table.Td>
                            <Table.Td className="text-lg">
                                {editMode ? (
                                <TextInput
                                    value={formData.department}
                                    onChange={(e) => handleChange('department', e.target.value)}
                                    placeholder="Ví dụ: Khoa Tim mạch, Khoa Nội..."
                                />
                                ) : (
                                formData.department
                                )}
                            </Table.Td>
                        </Table.Tr>

                        {/* --- Mã hành nghề --- */}
                        <Table.Tr>
                            <Table.Td className="font-semibold text-lg">Mã hành nghề</Table.Td>
                            <Table.Td className="text-lg">
                                {editMode ? (
                                <TextInput
                                    value={formData.licenseNumber}
                                    onChange={(e) => handleChange('licenseNumber', e.target.value)}
                                    placeholder="Nhập mã hành nghề"
                                />
                                ) : (
                                formData.licenseNumber
                                )}
                            </Table.Td>
                        </Table.Tr>

                        {/* --- Trạng thái hành nghề --- */}
                        <Table.Tr>
                            <Table.Td className="font-semibold text-lg">Trạng thái</Table.Td>
                            <Table.Td className="text-lg">
                                {formData.active ? 'Đang hành nghề' : 'Ngừng hành nghề'}
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>

                {editMode && (
                <div className="flex justify-end mt-6">
                    <Button color="teal" onClick={handleSave}>
                    Lưu thay đổi
                    </Button>
                </div>
                )}
            </div>
            <Modal opened={opened} onClose={close} title={<span className='text-xl font-medium'>Cập nhập hình ảnh</span>} centered>
                
            </Modal>
        </div>
    );
};

export default Profile;
