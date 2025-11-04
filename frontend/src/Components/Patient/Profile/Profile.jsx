import { Avatar, Button, Divider, Table, TextInput, NumberInput, Select, TagsInput, Modal } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../Content/AuthContext';
import { IconEdit } from '@tabler/icons-react';
import '@mantine/dates/styles.css';
import { bloodGroups, genders } from '../../../Data/DropdownData';
import { useDisclosure } from '@mantine/hooks';
import { DropzoneButton } from '../../Utils/Dropzone/Dropzonebutton';
import { useForm } from '@mantine/form';

const Profile = () => {
    const { user, getPatientInfo, updatePatientInfo, getMedia, saveImageId } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [formData, setFormData] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [loading, setLoading] = useState(true);
    const [avatarSrc, setAvatarSrc] = useState('/vite.svg');

    const form = useForm({
        initialValues: {}, // Set sau khi fetch
        validate: {}, // Thêm validation nếu cần
    });

    // Gọi API - Giữ nguyên getPatientInfo nhưng nếu cần chuyển sang getUserInfo thì thay ở đây
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await getPatientInfo(user?.profileId); // Thay profileId bằng id vì lưu bên user

                // Convert chuỗi dị ứng "Bụi, Phấn hoa" -> ["Bụi", "Phấn hoa"]
                const formattedData = {
                    ...res,
                    allergies: res.allergies
                        ? res.allergies.split(",").map((a) => a.trim())
                        : [],
                };

                form.setValues(formattedData);
                setProfileData(formattedData);
                setFormData(formattedData);
            } catch (err) {
                console.error("Lỗi khi lấy thông tin bệnh nhân:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) fetchProfile();
    }, [user]);

    useEffect(() => {
        const loadAvatar = async () => {
            if (form.values.profileImageUrlId) {
                try {
                    const mediaData = await getMedia(form.values.profileImageUrlId);
                    // Giả sử getMedia trả blob hoặc arrayBuffer, tạo URL
                    const blob = new Blob([mediaData], { type: 'image/jpeg' }); // Adjust type nếu cần
                    const url = URL.createObjectURL(blob);
                    setAvatarSrc(url);
                } catch (err) {
                    console.error('Lỗi load avatar:', err);
                    setAvatarSrc('/vite.svg');
                }
            } else {
                setAvatarSrc('/vite.svg');
            }
        };
        loadAvatar();
    }, [form.values.profileImageUrlId]);

    // Hàm thay đổi form
    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Xử lý cập nhật ảnh sau khi upload
    const handleImageUpdate = useCallback(async (imageId) => {
        setLoading(true);
        try {
            await saveImageId(user?.id, imageId);
            setProfileData((prev) => ({ ...prev, profileImageUrlId: imageId }));
            form.setFieldValue('profileImageUrlId', imageId);
            console.log("Image ID sau khi lưu:", imageId);
        } catch (err) {
            console.error('Lỗi cập nhật ảnh:', err);
            // Revert form nếu cần
            form.setFieldValue('profileImageUrlId', profileData?.profileImageUrlId || null);
        } finally {
            setLoading(false);
        }
    }, [user?.id, form, profileData?.profileImageUrlId]);

    // Hủy chỉnh sửa -> khôi phục từ profileData gốc
    const handleCancel = () => {
        setFormData({
            ...profileData,
            allergies: profileData.allergies
                ? Array.isArray(profileData.allergies)
                    ? profileData.allergies
                    : profileData.allergies.split(",").map((a) => a.trim())
                : [],
        });
        setEditMode(false);
    };

    // Lưu thay đổi
    const handleSave = async () => {
        try {
            // Convert ["Bụi", "Phấn hoa"] -> "Bụi, Phấn hoa"
            const payload = {
                ...formData,
                allergies: Array.isArray(formData.allergies)
                    ? formData.allergies.join(", ")
                    : formData.allergies,
            };

            console.log("Payload gửi đi:", payload);

            const updated = await updatePatientInfo(user?.id, payload); // Thay profileId bằng id

            console.log("Dữ liệu cập nhật trả về:", updated);

            // Sau khi backend trả về, format lại cho đúng kiểu mảng
            const formattedUpdated = {
                ...updated,
                allergies: updated.allergies
                    ? updated.allergies.split(",").map((a) => a.trim())
                    : [],
            };

            setProfileData(formattedUpdated);
            setFormData(formattedUpdated);
            setEditMode(false);
        } catch (err) {
            console.error("Lỗi khi cập nhật thông tin người dùng", err);
        }
    };

    // Lấy tên hiển thị: ưu tiên name, nếu không có thì lấy phần trước @ của email, nếu không có email thì hiện "Khách"
    const userName = formData?.name || user?.name || user?.email?.split('@')[0] || 'Khách';

    if (!formData) return <div className="p-10">Đang tải...</div>;
    if (loading) return <div className="p-10">Đang tải thông tin...</div>;


    return (
        <div className="p-10">
            {/* --- Header --- */}
            <div className="flex justify-between items-center mb-5">
                <div className="flex gap-5 items-center">
                    <div className="flex flex-col items-center gap-3">
                        <Avatar variant="filled" src={avatarSrc} size={120} alt="Avatar" />
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
                                        placeholder='Nhập họ tên'
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
                                        onChange={(val) => handleChange('gender', val)} // Sửa lỗi: onChange gọi handleChange('gender', val) thay vì 'bloodType'
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

                        {/* Nhóm máu */}
                        <Table.Tr>
                            <Table.Td className="font-semibold text-lg">Nhóm máu</Table.Td>
                            <Table.Td className="text-lg">
                                {editMode ? (
                                    <Select
                                        data={bloodGroups}
                                        value={formData.bloodType}
                                        onChange={(val) => handleChange('bloodType', val)}
                                        placeholder="Chọn nhóm máu"
                                    />
                                ) : (
                                    formData.bloodType
                                )}
                            </Table.Td>
                        </Table.Tr>

                        {/* Dị ứng */}
                        <Table.Tr>
                            <Table.Td className="font-semibold text-lg">Dị ứng</Table.Td>
                            <Table.Td className="text-lg">
                                {editMode ? (
                                    <TagsInput
                                        placeholder="Nhập thông tin dị ứng"
                                        value={formData.allergies || []} // Phải là mảng
                                        onChange={(value) => handleChange('allergies', value)}
                                    />
                                ) : (
                                    (Array.isArray(formData.allergies)
                                        ? formData.allergies.join(', ')
                                        : formData.allergies)
                                )}
                            </Table.Td>
                        </Table.Tr>

                        {/* Bệnh mãn tính */}
                        <Table.Tr>
                            <Table.Td className="font-semibold text-lg">Bệnh mãn tính</Table.Td>
                            <Table.Td className="text-lg">
                                {editMode ? (
                                    <TextInput
                                        value={formData.chronicDisease}
                                        maxLength={80}
                                        onChange={(e) => handleChange('chronicDisease', e.target.value)}
                                        placeholder='Nhập thông tin bệnh mãn tính'
                                    />
                                ) : (
                                    formData.chronicDisease
                                )}
                            </Table.Td>
                        </Table.Tr>

                        {/* Liên hệ khẩn cấp */}
                        <Table.Tr>
                            <Table.Td className="font-semibold text-lg">Liên hệ khẩn cấp</Table.Td>
                            <Table.Td className="text-lg">
                                {editMode ? (
                                    <TextInput
                                        value={formData.emergencyContact}
                                        maxLength={80}
                                        onChange={(e) => handleChange('emergencyContact', e.target.value)}
                                        placeholder='Nhập thông tin liên hệ khẩn cấp'
                                    />
                                ) : (
                                    formData.emergencyContact
                                )}
                            </Table.Td>
                        </Table.Tr>

                        {/* Thông tin bảo hiểm */}
                        <Table.Tr>
                            <Table.Td className="font-semibold text-lg">Thông tin bảo hiểm</Table.Td>
                            <Table.Td className="text-lg">
                                {editMode ? (
                                    <TextInput
                                        value={formData.insuranceDetails}
                                        maxLength={80}
                                        onChange={(e) => handleChange('insuranceDetails', e.target.value)}
                                        placeholder='Nhập thông tin bảo hiểm'
                                    />
                                ) : (
                                    formData.insuranceDetails
                                )}
                            </Table.Td>
                        </Table.Tr>

                        {/* Tiền sử bệnh */}
                        <Table.Tr>
                            <Table.Td className="font-semibold text-lg">Tiền sử bệnh</Table.Td>
                            <Table.Td className="text-lg">
                                {editMode ? (
                                    <TextInput
                                        value={formData.medicalHistory}
                                        maxLength={100}
                                        onChange={(e) => handleChange('medicalHistory', e.target.value)}
                                        placeholder='Nhập tiền sử bệnh'
                                    />
                                ) : (
                                    formData.medicalHistory
                                )}
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
                <DropzoneButton close={close} form={form} fieldName="profileImageUrlId" onUploadComplete={handleImageUpdate} />
            </Modal>
        </div>
    );
};

export default Profile;