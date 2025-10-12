import { Avatar, Button, Divider, Table, TextInput, NumberInput, Select, TagsInput, Modal } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../Content/AuthContext';
import { IconEdit } from '@tabler/icons-react';
import '@mantine/dates/styles.css';
import { bloodGroups } from '../../../Data/DropdownData';
import { useDisclosure } from '@mantine/hooks';

const Profile = () => {
    const { user, getPharmacyInfo, updatePharmacyInfo } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [formData, setFormData] = useState(null);
    const [opened, {open, close}] = useDisclosure(false);
    const [loading, setLoading] = useState(true);
 
    // Gọi API
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await getPharmacyInfo(user?.profileId);
                setProfileData(res);
                setFormData(res);
            } catch (err) {
                console.error("Lỗi khi lấy thông tin:", err);
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
            const updated = await updatePharmacyInfo(user?.profileId, formData);
            setProfileData(updated);
            setFormData(updated);
            setEditMode(false);
        } catch (err) {
            console.error("Lỗi khi cập nhật thông tin:", err);
        }
    };
 
    const userName = formData.name || user?.name || user?.email?.split('@')[0] || 'Khách';

    if (!formData) return <div className="p-10">Đang tải...</div>;
 
    if (loading) return <div className="p-10">Đang tải thông tin...</div>;

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
                        {/* Tên nhà thuốc */}
                        <Table.Tr>
                        <Table.Td className="font-semibold text-lg w-1/4">Tên nhà thuốc</Table.Td>
                        <Table.Td className="text-lg w-3/4">
                            {editMode ? (
                            <TextInput
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Nhập tên nhà thuốc"
                            />
                            ) : (
                            formData.name
                            )}
                        </Table.Td>
                        </Table.Tr>

                        {/* Mã giấy phép kinh doanh */}
                        <Table.Tr>
                        <Table.Td className="font-semibold text-lg">Mã giấy phép</Table.Td>
                        <Table.Td className="text-lg">
                            {editMode ? (
                            <TextInput
                                value={formData.licenseNumber}
                                onChange={(e) => handleChange('licenseNumber', e.target.value)}
                                placeholder="Nhập mã giấy phép"
                            />
                            ) : (
                            formData.licenseNumber
                            )}
                        </Table.Td>
                        </Table.Tr>

                        {/* Số điện thoại */}
                        <Table.Tr>
                        <Table.Td className="font-semibold text-lg">Số điện thoại</Table.Td>
                        <Table.Td className="text-lg">
                            {editMode ? (
                            <TextInput
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                placeholder="Nhập số điện thoại"
                            />
                            ) : (
                            formData.phone
                            )}
                        </Table.Td>
                        </Table.Tr>

                        {/* Email */}
                        <Table.Tr>
                        <Table.Td className="font-semibold text-lg">Email</Table.Td>
                        <Table.Td className="text-lg">
                            {editMode ? (
                            <TextInput
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="Nhập email"
                                readOnly
                            />
                            ) : (
                            formData.email
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
                                onChange={(e) => handleChange('address', e.target.value)}
                                placeholder="Nhập địa chỉ"
                            />
                            ) : (
                            formData.address
                            )}
                        </Table.Td>
                        </Table.Tr>

                        {/* Thành phố */}
                        <Table.Tr>
                        <Table.Td className="font-semibold text-lg">Xã, phường</Table.Td>
                        <Table.Td className="text-lg">
                            {editMode ? (
                            <TextInput
                                value={formData.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                                placeholder="Nhập thành phố"
                            />
                            ) : (
                            formData.city
                            )}
                        </Table.Td>
                        </Table.Tr>

                        {/* Tỉnh / Thành */}
                        <Table.Tr>
                        <Table.Td className="font-semibold text-lg">Tỉnh / Thành</Table.Td>
                        <Table.Td className="text-lg">
                            {editMode ? (
                            <TextInput
                                value={formData.province}
                                onChange={(e) => handleChange('province', e.target.value)}
                                placeholder="Nhập tỉnh / thành"
                            />
                            ) : (
                            formData.province
                            )}
                        </Table.Td>
                        </Table.Tr>

                        {/* Mã bưu điện */}
                        <Table.Tr>
                        <Table.Td className="font-semibold text-lg">Mã bưu điện</Table.Td>
                        <Table.Td className="text-lg">
                            {editMode ? (
                            <TextInput
                                value={formData.postalCode}
                                onChange={(e) => handleChange('postalCode', e.target.value)}
                                placeholder="Nhập mã bưu điện"
                            />
                            ) : (
                            formData.postalCode
                            )}
                        </Table.Td>
                        </Table.Tr>

                        {/* Chủ sở hữu */}
                        <Table.Tr>
                        <Table.Td className="font-semibold text-lg">Chủ sở hữu</Table.Td>
                        <Table.Td className="text-lg">
                            {editMode ? (
                            <TextInput
                                value={formData.ownerName}
                                onChange={(e) => handleChange('ownerName', e.target.value)}
                                placeholder="Nhập tên chủ sở hữu"
                            />
                            ) : (
                            formData.ownerName
                            )}
                        </Table.Td>
                        </Table.Tr>

                        {/* Người phụ trách chuyên môn */}
                        <Table.Tr>
                        <Table.Td className="font-semibold text-lg">Người phụ trách chuyên môn</Table.Td>
                        <Table.Td className="text-lg">
                            {editMode ? (
                            <TextInput
                                value={formData.pharmacistInCharge}
                                onChange={(e) => handleChange('pharmacistInCharge', e.target.value)}
                                placeholder="Nhập tên người phụ trách"
                            />
                            ) : (
                            formData.pharmacistInCharge
                            )}
                        </Table.Td>
                        </Table.Tr>

                        {/* Trạng thái hoạt động */}
                        <Table.Tr>
                        <Table.Td className="font-semibold text-lg">Trạng thái</Table.Td>
                        <Table.Td className="text-lg">
                            {editMode ? (
                            <Select
                                data={[
                                { value: 'true', label: 'Đang hoạt động' },
                                { value: 'false', label: 'Ngừng hoạt động' },
                                ]}
                                value={formData.active ? 'true' : 'false'}
                                onChange={(val) => handleChange('active', val === 'true')}
                            />
                            ) : (
                            formData.active ? 'Đang hoạt động' : 'Ngừng hoạt động'
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
                
            </Modal>
        </div>
    );
};

export default Profile;