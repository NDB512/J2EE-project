import { Avatar, Button, Divider, TextInput, NumberInput, Select, TagsInput, Modal, Paper, Stack, Text, Group, Flex, Badge, Transition, Container } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../Content/AuthContext';
import { IconEdit, IconUser, IconCalendar, IconPhone, IconGenderMale, IconMapPin, IconId, IconDroplet, IconStethoscope, IconPhoneCall, IconShield, IconClipboard, IconPencil, IconAlertCircle } from '@tabler/icons-react';
import '@mantine/dates/styles.css';
import { bloodGroups, genders } from '../../../Data/DropdownData';
import { useDisclosure } from '@mantine/hooks';
import { DropzoneButton } from '../../Utils/Dropzone/Dropzonebutton';
import { useForm } from '@mantine/form';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../../Slices/AuthSlices';

const Profile = () => {
    const dispatch = useDispatch();
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
                const res = await getPatientInfo(user?.profileId);

                console.log("data: ", res)

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
        form.setFieldValue(field, value);  // THÊM: Sync với form để consistent
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Xử lý cập nhật ảnh sau khi upload
    const handleImageUpdate = useCallback(async (imageId) => {
        setLoading(true);
        try {
            // Lưu ảnh lên server
            await saveImageId(user?.id, imageId);

            // Cập nhật profileData và formData
            setProfileData((prev) => ({ ...prev, profileImageUrlId: imageId }));
            form.setFieldValue('profileImageUrlId', imageId);

            // Cập nhật avatar Redux user
            dispatch(setAuth({
                accessToken: localStorage.getItem('accessToken'),
                refreshToken: localStorage.getItem('refreshToken'),
                user: { ...user, profileImageUrlId: imageId }
            }));

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
        form.setValues(profileData);  // SỬA: Sync form với profileData
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
            // SỬA: Dùng form.values để lấy data (đã sync), convert allergies
            const payload = {
                ...form.values,
                allergies: Array.isArray(form.values.allergies)
                    ? form.values.allergies.join(", ")
                    : form.values.allergies,
            };

            console.log("Payload gửi đi:", payload);

            const updated = await updatePatientInfo(user?.id, payload);

            console.log("Dữ liệu cập nhật trả về:", updated);

            // Sau khi backend trả về, format lại cho đúng kiểu mảng
            const formattedUpdated = {
                ...updated,
                allergies: updated.allergies
                    ? updated.allergies.split(",").map((a) => a.trim())
                    : [],
            };

            form.setValues(formattedUpdated);  // THÊM: Sync form
            setProfileData(formattedUpdated);
            setFormData(formattedUpdated);
            setEditMode(false);
        } catch (err) {
            console.error("Lỗi khi cập nhật thông tin người dùng", err);
        }
    };

    // Lấy tên hiển thị: ưu tiên name, nếu không có thì lấy phần trước @ của email, nếu không có email thì hiện "Khách"
    const userName = formData?.name || user?.name || user?.email?.split('@')[0] || 'Khách';

    // Hàm hiển thị giá trị với fallback
    const displayValue = (value) => {
        if (value === null || value === undefined || value === '') {
            return <span className="text-gray-500 italic">Chưa cập nhật</span>;
        }
        return value;
    };

    // Component cho từng field - FIX: mounted={true} để tránh hide khi editMode=false
    const ProfileField = ({ icon: Icon, label, value, editComponent, className = "" }) => (
        <Paper shadow="xs" p="md" radius="md" className={`bg-white border border-gray-100 overflow-hidden ${className}`}>
            <Stack gap="xs">
                <Group gap="xs" className="text-teal-700 font-semibold">
                    <Icon size={18} />
                    <Text size="sm" fw={600}>{label}</Text>
                </Group>
                <Transition 
                    mounted={true}  // FIX: Luôn mounted=true để content luôn visible, tránh out transition hide
                    transition={{
                        in: { 
                            opacity: 1, 
                            transform: 'translateY(0) scale(1)', 
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
                        },
                        out: { 
                            opacity: 0, 
                            transform: 'translateY(-10px) scale(0.98)', 
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' 
                        }
                    }}
                    timingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
                >
                    {(styles) => (
                        <div style={styles}>
                            {editMode ? (
                                <div className="w-full">{editComponent}</div>
                            ) : (
                                <Text size="lg" c="dark" className="font-medium">
                                    {displayValue(value)}
                                </Text>
                            )}
                        </div>
                    )}
                </Transition>
            </Stack>
        </Paper>
    );

    if (!formData) return <div className="p-10">Đang tải...</div>;
    if (loading) return <div className="p-10">Đang tải thông tin...</div>;

    return (
        <Container size="xl" className="p-6 md:p-10">
            {/* --- Header --- */}
            <Transition 
                mounted={true} 
                transition="slide-down" 
                duration={500}
                timingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
            >
                {(styles) => (
                    <Paper 
                        shadow="xl" 
                        p="xl" 
                        withBorder 
                        radius="xl" 
                        className="bg-gradient-to-r from-teal-50 via-blue-50 to-indigo-50 mb-8" 
                        style={styles}
                    >
                        <Flex justify="space-between" align="center" direction={{ base: "column", md: "row" }} gap="md">
                            <Flex align="center" gap="lg" className="w-full md:w-auto">
                                <div className="relative">
                                    <Transition 
                                        mounted={true} 
                                        transition={{
                                            in: { transform: 'scale(1)', transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' },
                                            out: { transform: 'scale(0.95)', transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }
                                        }}
                                    >
                                        {(avatarStyles) => (
                                            <Avatar 
                                                src={avatarSrc} 
                                                size={140} 
                                                alt="Avatar" 
                                                className="ring-8 ring-white shadow-2xl border-4 border-white" 
                                                style={avatarStyles}
                                            />
                                        )}
                                    </Transition>
                                    {editMode && (
                                        <Transition 
                                            mounted={editMode} 
                                            transition="pop" 
                                            duration={300}
                                            timingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
                                        >
                                            {(buttonStyles) => (
                                                <Button 
                                                    size="sm" 
                                                    onClick={open} 
                                                    variant="filled" 
                                                    color="teal" 
                                                    leftSection={<IconPencil size={14} />}
                                                    className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 shadow-lg"
                                                    style={buttonStyles}
                                                >
                                                    Ảnh
                                                </Button>
                                            )}
                                        </Transition>
                                    )}
                                </div>
                                <Stack gap="xs">
                                    <Transition 
                                        mounted={true} 
                                        transition="fade" 
                                        duration={600}
                                        timingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
                                    >
                                        {(textStyles) => (
                                            <Text 
                                                size="3xl" 
                                                fw={700} 
                                                c="dark" 
                                                className="text-gradient bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
                                                style={textStyles}
                                            >
                                                Xin chào, {userName}!
                                            </Text>
                                        )}
                                    </Transition>
                                    <Group gap="xs">
                                        <IconClipboard size={20} className="text-teal-600" />
                                        <Text size="lg" c="gray.6">{user.email}</Text>
                                    </Group>
                                </Stack>
                            </Flex>
                            <Transition 
                                mounted={true} 
                                transition="slide-right" 
                                duration={400}
                                timingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
                            >
                                {(buttonStyles) => (
                                    <Button
                                        variant={editMode ? 'outline' : 'gradient'}
                                        gradient={editMode ? undefined : { from: 'red', to: 'pink', deg: 45 }}
                                        leftSection={<IconEdit />}
                                        onClick={() => (editMode ? handleCancel() : setEditMode(true))}
                                        size="lg"
                                        className="shadow-xl font-semibold"
                                        style={buttonStyles}
                                    >
                                        {editMode ? 'Hủy bỏ' : 'Chỉnh sửa hồ sơ'}
                                    </Button>
                                )}
                            </Transition>
                        </Flex>
                    </Paper>
                )}
            </Transition>

            <Divider my="xl" className="border-gray-200" />

            {/* --- Thông tin cá nhân --- */}
            <Transition 
                mounted={true} 
                transition="scale-y" 
                duration={600}
                timingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
            >
                {(formStyles) => (
                    <Paper 
                        shadow="md" 
                        p="xl" 
                        withBorder 
                        radius="xl" 
                        className="bg-white" 
                        style={formStyles}
                    >
                        <Text 
                            size="2xl" 
                            fw={700} 
                            c="dark" 
                            mb="xl" 
                            className="flex items-center gap-3"
                        >
                            <IconUser size={30} className="text-teal-600" />
                            Thông tin cá nhân
                        </Text>

                        <Transition 
                            mounted={editMode} 
                            transition="fade" 
                            duration={300}
                            timingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
                        >
                            {(editStyles) => editMode && <div style={editStyles} />}
                        </Transition>

                        <Stack gap="lg">
                            {/* Họ và tên */}
                            <ProfileField
                                icon={IconUser}
                                label="Họ và tên"
                                value={formData.name}
                                editComponent={
                                    <TextInput
                                        value={formData.name || ''}
                                        maxLength={50}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        placeholder='Nhập họ tên'
                                        size="lg"
                                        leftSection={<IconUser size={18} className="text-teal-600" />}
                                        radius="md"
                                    />
                                }
                            />

                            {/* Ngày sinh */}
                            <ProfileField
                                icon={IconCalendar}
                                label="Ngày sinh"
                                value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString('vi-VN') : null}
                                editComponent={
                                    <DateInput
                                        value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                                        onChange={(value) => handleChange('dateOfBirth', value || null)}
                                        valueFormat="DD/MM/YYYY"
                                        placeholder="Chọn ngày sinh"
                                        size="lg"
                                        leftSection={<IconCalendar size={18} className="text-teal-600" />}
                                        radius="md"
                                        clearable
                                    />
                                }
                            />

                            {/* Số điện thoại */}
                            <ProfileField
                                icon={IconPhone}
                                label="Số điện thoại"
                                value={formData.phone}
                                editComponent={
                                    <NumberInput
                                        value={formData.phone || ''}
                                        onChange={(val) => handleChange('phone', val)}
                                        hideControls
                                        maxLength={10}
                                        placeholder='Nhập số điện thoại'
                                        size="lg"
                                        leftSection={<IconPhone size={18} className="text-teal-600" />}
                                        radius="md"
                                    />
                                }
                            />

                            {/* Giới tính */}
                            <ProfileField
                                icon={IconGenderMale}
                                label="Giới tính"
                                value={formData.gender}
                                editComponent={
                                    <Select
                                        data={genders}
                                        value={formData.gender}
                                        onChange={(val) => handleChange('gender', val)}
                                        placeholder="Chọn giới tính"
                                        size="lg"
                                        leftSection={<IconGenderMale size={18} className="text-teal-600" />}
                                        radius="md"
                                    />
                                }
                            />

                            {/* Địa chỉ */}
                            <ProfileField
                                icon={IconMapPin}
                                label="Địa chỉ"
                                value={formData.address}
                                editComponent={
                                    <TextInput
                                        value={formData.address || ''}
                                        maxLength={100}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        placeholder='Nhập địa chỉ'
                                        size="lg"
                                        leftSection={<IconMapPin size={18} className="text-teal-600" />}
                                        radius="md"
                                    />
                                }
                            />

                            {/* CCCD */}
                            <ProfileField
                                icon={IconId}
                                label="CCCD"
                                value={formData.citizenId}
                                editComponent={
                                    <NumberInput
                                        value={formData.citizenId || ''}
                                        hideControls
                                        maxLength={12}
                                        onChange={(val) => handleChange('citizenId', val)}
                                        placeholder='Nhập số CCCD'
                                        size="lg"
                                        leftSection={<IconId size={18} className="text-teal-600" />}
                                        radius="md"
                                    />
                                }
                            />

                            {/* Nhóm máu */}
                            <ProfileField
                                icon={IconDroplet}
                                label="Nhóm máu"
                                value={formData.bloodType}
                                editComponent={
                                    <Select
                                        data={bloodGroups}
                                        value={formData.bloodType}
                                        onChange={(val) => handleChange('bloodType', val)}
                                        placeholder="Chọn nhóm máu"
                                        size="lg"
                                        leftSection={<IconDroplet size={18} className="text-teal-600" />}
                                        radius="md"
                                    />
                                }
                            />

                            {/* Dị ứng */}
                            <ProfileField
                                icon={IconAlertCircle}
                                label="Dị ứng"
                                value={Array.isArray(formData.allergies) ? formData.allergies.join(', ') : formData.allergies}
                                editComponent={
                                    <TagsInput
                                        placeholder="Nhập thông tin dị ứng"
                                        value={formData.allergies || []}
                                        onChange={(value) => handleChange('allergies', value)}
                                        size="lg"
                                        leftSection={<IconAlertCircle size={18} className="text-teal-600" />}
                                        radius="md"
                                    />
                                }
                            />

                            {/* Bệnh mãn tính */}
                            <ProfileField
                                icon={IconStethoscope}
                                label="Bệnh mãn tính"
                                value={formData.chronicDisease}
                                editComponent={
                                    <TextInput
                                        value={formData.chronicDisease || ''}
                                        maxLength={80}
                                        onChange={(e) => handleChange('chronicDisease', e.target.value)}
                                        placeholder='Nhập thông tin bệnh mãn tính'
                                        size="lg"
                                        leftSection={<IconStethoscope size={18} className="text-teal-600" />}
                                        radius="md"
                                    />
                                }
                            />

                            {/* Liên hệ khẩn cấp */}
                            <ProfileField
                                icon={IconPhoneCall}
                                label="Liên hệ khẩn cấp"
                                value={formData.emergencyContact}
                                editComponent={
                                    <TextInput
                                        value={formData.emergencyContact || ''}
                                        maxLength={80}
                                        onChange={(e) => handleChange('emergencyContact', e.target.value)}
                                        placeholder='Nhập thông tin liên hệ khẩn cấp'
                                        size="lg"
                                        leftSection={<IconPhoneCall size={18} className="text-teal-600" />}
                                        radius="md"
                                    />
                                }
                            />

                            {/* Thông tin bảo hiểm */}
                            <ProfileField
                                icon={IconShield}
                                label="Thông tin bảo hiểm"
                                value={formData.insuranceDetails}
                                editComponent={
                                    <TextInput
                                        value={formData.insuranceDetails || ''}
                                        maxLength={80}
                                        onChange={(e) => handleChange('insuranceDetails', e.target.value)}
                                        placeholder='Nhập thông tin bảo hiểm'
                                        size="lg"
                                        leftSection={<IconShield size={18} className="text-teal-600" />}
                                        radius="md"
                                    />
                                }
                            />

                            {/* Tiền sử bệnh */}
                            <ProfileField
                                icon={IconClipboard}
                                label="Tiền sử bệnh"
                                value={formData.medicalHistory}
                                editComponent={
                                    <TextInput
                                        value={formData.medicalHistory || ''}
                                        maxLength={100}
                                        onChange={(e) => handleChange('medicalHistory', e.target.value)}
                                        placeholder='Nhập tiền sử bệnh'
                                        size="lg"
                                        leftSection={<IconClipboard size={18} className="text-teal-600" />}
                                        radius="md"
                                    />
                                }
                            />
                        </Stack>

                        {editMode && (
                            <Transition 
                                mounted={editMode} 
                                transition="slide-up" 
                                duration={400}
                                timingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
                            >
                                {(saveStyles) => (
                                    <Group justify="flex-end" mt="xl" style={saveStyles}>
                                        <Button 
                                            variant="gradient" 
                                            gradient={{ from: 'teal', to: 'cyan', deg: 45 }} 
                                            onClick={handleSave} 
                                            size="lg" 
                                            leftSection={<IconPencil size={18} />}
                                            className="shadow-xl font-semibold"
                                        >
                                            Lưu thay đổi
                                        </Button>
                                    </Group>
                                )}
                            </Transition>
                        )}
                    </Paper>
                )}
            </Transition>

            <Modal 
                opened={opened} 
                onClose={close} 
                title={<span className='text-xl font-medium'>Cập nhật hình ảnh đại diện</span>} 
                centered 
                size="sm"
                transitionProps={{
                    transition: 'fade',
                    duration: 300,
                    timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <DropzoneButton close={close} form={form} fieldName="profileImageUrlId" onUploadComplete={handleImageUpdate} />
            </Modal>
        </Container>
    );
};

export default Profile;