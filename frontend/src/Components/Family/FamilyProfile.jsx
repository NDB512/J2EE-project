import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Content/AuthContext";
import { Loader, Button, Card, Title, Text, Avatar, Badge, Group, ActionIcon, Paper, Flex, Modal } from "@mantine/core";
import { IconHome, IconUserPlus, IconUsers, IconEdit, IconTrash, IconUserCheck } from "@tabler/icons-react";
import ModalAddMember from "./ModalAddMember";
import ModalCreateFamily from "./ModalCreateFamily";
import ModalPatientDetail from "./ModalPatientDetail";
import ModalEditDependent from "./ModalEditDependent";
import { errorNotification, successNotification } from "../../../Utils/Notification";  // Import notifications nếu chưa có

const FamilyProfile = () => {
    const { user, getFamilyDetail, getFamilyMembers, getPatientInfo, updatePatientInfo, removeMemberFromFamily, updateMemberRoleApi } = useAuth();  // Bỏ isHeadOrAdmin nếu chưa có

    const [family, setFamily] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Tách state riêng cho từng modal để tránh conflict
    const [openedCreate, setOpenedCreate] = useState(false);
    const [openedAdd, setOpenedAdd] = useState(false);
    const [openedEdit, setOpenedEdit] = useState(false);  // Modal edit cho dependent
    const [selectedPatientForEdit, setSelectedPatientForEdit] = useState(null);
    const [openedRoleEdit, setOpenedRoleEdit] = useState(false);  // MỚI: Modal edit role cho non-dependent
    const [selectedMemberForRole, setSelectedMemberForRole] = useState(null);

    const loadFamilyData = async () => {
        try {
            const familyData = await getFamilyDetail(user.familyId);
            const memberData = await getFamilyMembers(user.familyId);
            console.log("Family Data:", familyData);            
            setFamily(familyData);
            setMembers(memberData);
        } catch (error) {
            setFamily(null);
        } finally {
            setLoading(false);
        }
    };

    const [detailOpened, setDetailOpened] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const handleOpenDetail = async (profilePatientId) => {
        try {
            const data = await getPatientInfo(profilePatientId);
            setSelectedPatient(data);
            setDetailOpened(true);
        } catch (err) {
            console.error(err);
        }
    };

    // Xử lý xóa member (chỉ head/admin)
    const handleDeleteMember = async (patientId) => {
        if (!confirm("Bạn có chắc muốn xóa thành viên này?")) return;
        try {
            await removeMemberFromFamily(user.familyId, patientId);
            loadFamilyData();
            successNotification("Xóa thành viên thành công!");
        } catch (err) {
            errorNotification("Lỗi khi xóa: " + (err.message || err));
        }
    };

    // Mở edit modal cho dependent
    const handleOpenEdit = async (member) => {
        // Logic check head/admin inline (dựa trên user.id === family.creatorId hoặc user.role)
        const isHeadOrAdmin = user.profileId === family?.creatorId || user.role === 'ADMIN';  // Cấu trúc logic đơn giản
        if (!isHeadOrAdmin) {
            errorNotification("Chỉ chủ hộ hoặc admin mới được chỉnh sửa.");
            return;
        }
        if (!member.isDependent) {
            errorNotification("Chỉ chỉnh sửa profile phụ thuộc.");
            return;
        }

        const profileEdit = await getPatientInfo(member.id);

        setSelectedPatientForEdit(profileEdit);
        setOpenedEdit(true);
    };

    // MỚI: Mở edit role modal cho non-dependent
    const handleOpenRoleEdit = (member) => {
        const isHeadOrAdmin = user.profileId === family?.creatorId || user.role === 'ADMIN';
        if (!isHeadOrAdmin) {
            errorNotification("Chỉ chủ hộ hoặc admin mới được chỉnh sửa vai trò.");
            return;
        }
        if (member.isDependent) {
            errorNotification("Profile phụ thuộc không chỉnh sửa vai trò ở đây.");
            return;
        }
        setSelectedMemberForRole(member);
        setOpenedRoleEdit(true);
    };

    // Xử lý update patient (gọi API updatePatientInfo)
    const handleUpdatePatient = async (updatedData) => {
        try {
            await updatePatientInfo(selectedPatientForEdit.id, updatedData);
            loadFamilyData();  // Refresh
            setOpenedEdit(false);
            successNotification("Cập nhật profile thành công!");
        } catch (err) {
            errorNotification("Lỗi cập nhật: " + (err.message || err));
        }
    };

    // MỚI: Xử lý update role
    const handleUpdateRole = async (newRole) => {
        if (!selectedMemberForRole) return;
        try {
            await updateMemberRoleApi({
                patientId: selectedMemberForRole.id,
                roleInFamily: newRole,
                requesterId: user.profileId,
                requesterRole: 'HEAD'  // Hoặc từ user.role
            });
            loadFamilyData();  // Refresh
            setOpenedRoleEdit(false);
            successNotification("Cập nhật vai trò thành công!");
        } catch (err) {
            errorNotification("Lỗi cập nhật vai trò: " + (err.message || err));
        }
    };

    useEffect(() => {
        loadFamilyData();
    }, [user.familyId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="flex flex-col items-center gap-4">
                    <Loader size="xl" color="blue" />
                    <Text size="sm" color="dimmed">Đang tải thông tin gia đình...</Text>
                </div>
            </div>
        );
    }

    if (!family) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-red-100">
                <Paper shadow="xl" p="xl" radius="lg" withBorder className="text-center max-w-md w-full">
                    <Title order={2} className="mb-3">Bạn chưa thuộc gia đình nào</Title>
                    <Text size="sm" color="dimmed" className="mb-6">
                        Tạo hồ sơ gia đình để bắt đầu quản lý sức khỏe cùng người thân.
                    </Text>
                    <Button 
                        leftIcon={<IconHome />} 
                        onClick={() => setOpenedCreate(true)} 
                        size="lg" 
                        variant="gradient" 
                        gradient={{ from: 'orange', to: 'red' }}
                        fullWidth
                    >
                        + Tạo hồ sơ gia đình
                    </Button>
                </Paper>
                <ModalCreateFamily
                    opened={openedCreate}
                    onClose={() => setOpenedCreate(false)}
                    onCreated={loadFamilyData}
                />
            </div>
        );
    }

    const isCurrentUserHeadOrAdmin = user.profileId === family.creatorId || user.role === 'ADMIN';

    // MỚI: ModalEditRole component (đã có, nhưng fix requesterId)
    const ModalEditRole = ({ opened, onClose, member, onUpdated }) => {
        const [role, setRole] = useState(member.roleInFamily || "Member");
        const [loading, setLoading] = useState(false);

        const roles = [
            "Head", "Vợ", "Chồng", "Con", "Cha", "Mẹ", "Anh", "Chị", "Em trai", "Em gái", "Khác"
        ];

        const handleSubmit = async () => {
            setLoading(true);
            try {
                await updateMemberRoleApi({
                    patientId: member.id,
                    roleInFamily: role,
                    requesterId: user.profileId,  // SỬA: Dùng user.profileId thay vì member.requesterId
                    requesterRole: 'HEAD'  // Hoặc user.role nếu có
                });
                onUpdated();
                onClose();
            } catch (err) {
                errorNotification("Lỗi cập nhật vai trò: " + (err.message || err));
            } finally {
                setLoading(false);
            }
        };

        return (
            <Modal opened={opened} onClose={onClose} title="Chỉnh sửa vai trò">
                <Select
                    label="Vai trò trong gia đình"
                    data={roles}
                    value={role}
                    onChange={setRole}
                    mb="md"
                />
                <Group position="right">
                    <Button onClick={onClose} variant="outline">Hủy</Button>
                    <Button onClick={handleSubmit} loading={loading}>Lưu</Button>
                </Group>
            </Modal>
        );
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
                {/* Family Info Card - Nâng cấp với avatar và icons */}
                <Card shadow="xl" padding="xl" radius="lg" withBorder className="bg-gradient-to-r from-blue-50 to-indigo-100 border-blue-200">
                    <Group justify="space-between" align="center" mb="md">
                        <Group>
                            <Avatar size="lg" color="blue" radius={100}>
                                <IconHome size={32} />
                            </Avatar>
                            <div>
                                <Title order={1} className="text-blue-800">{family.familyName}</Title>
                                <Text size="sm" color="dimmed">
                                    <IconUsers size={16} className="inline mr-1" /> {members.length} thành viên
                                </Text>
                            </div>
                        </Group>
                        <ActionIcon 
                            variant="filled" 
                            color="blue" 
                            onClick={() => setOpenedAdd(true)}
                            size="lg"
                            className="hover:scale-110 transition-transform"
                        >
                            <IconUserPlus size={24} />
                        </ActionIcon>
                    </Group>
                    <Text size="md" weight={500} className="text-gray-700">
                        Chủ hộ: <span className="text-blue-600 font-bold">{family.headOfFamily}</span>
                    </Text>
                </Card>

                {/* Member List - Nâng cấp cards với highlight current user và nút edit/delete/role */}
                <div>
                    <Group justify="apart" align="center" mb="md">
                        <Title order={2} className="flex items-center gap-2">
                            <IconUsers size={28} className="text-blue-500" /> Thành viên
                        </Title>
                        {members.length === 0 && (
                            <Text size="sm" color="dimmed">Chưa có thành viên nào</Text>
                        )}
                    </Group>
                    {members.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {members.map((m) => {
                                const isCurrentUser = m.id === user.profileId;  // Đánh dấu user hiện tại (dựa trên ID)
                                const showFullEdit = isCurrentUserHeadOrAdmin && m.isDependent;  // Full edit cho dependent
                                const showRoleEdit = isCurrentUserHeadOrAdmin && !m.isDependent;  // Role edit cho non-dependent
                                const showDelete = isCurrentUserHeadOrAdmin;  // Xóa cho tất cả khi là head/admin

                                return (
                                    <Card
                                        key={m.id}
                                        shadow="md" 
                                        padding="lg" 
                                        radius="lg" 
                                        withBorder
                                        className={`bg-white border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden
                                            ${isCurrentUser ? 'ring-2 ring-blue-300 border-blue-200 bg-blue-50' : ''}`}  // Highlight nếu là user hiện tại
                                        onClick={() => handleOpenDetail(m.id)}
                                    >
                                        <div className="flex flex-col items-center text-center">
                                            <div 
                                                className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-lg"
                                            >
                                                {(m.name || 'N/A').charAt(0).toUpperCase()}
                                            </div>
                                            <Title order={4} className="mb-2">{m.name || 'Không có tên'}</Title>
                                            <Text size="sm" color="dimmed" className="mb-3 truncate max-w-full">
                                                {m.email || 'Không có email'}
                                            </Text>
                                            <Group gap="xs" mb="sm">  {/* Badge cho current user và role */}
                                                {isCurrentUser && (
                                                    <Badge 
                                                        size="sm" 
                                                        color="blue" 
                                                        leftSection={<IconUserCheck size={12} />}
                                                        className="font-medium"
                                                    >
                                                        Bạn  {/* Hiển thị "Bạn" nếu là user hiện tại */}
                                                    </Badge>
                                                )}
                                                <Badge 
                                                    size="lg" 
                                                    variant="light" 
                                                    color="blue" 
                                                    leftSection={<IconUserPlus size={12} />}
                                                    className="font-medium"
                                                >
                                                    {m.roleInFamily || 'Thành viên'}
                                                </Badge>
                                                {m.isDependent && (
                                                    <Badge size="sm" color="orange" variant="filled">Phụ thuộc</Badge>
                                                )}
                                            </Group>
                                            
                                            {/* Nút edit/delete/role edit */}
                                            {(showFullEdit || showRoleEdit || showDelete) && (
                                                <Group gap="xs">
                                                    {(showFullEdit || showRoleEdit) && (
                                                        <ActionIcon 
                                                            variant="subtle" 
                                                            color="teal" 
                                                            onClick={(e) => { 
                                                                e.stopPropagation(); 
                                                                if (showFullEdit) {
                                                                    handleOpenEdit(m);
                                                                } else if (showRoleEdit) {
                                                                    handleOpenRoleEdit(m);
                                                                }
                                                            }}
                                                            size="sm"
                                                            title={showFullEdit ? "Chỉnh sửa profile" : "Chỉnh sửa vai trò"}
                                                        >
                                                            <IconEdit size={16} />
                                                        </ActionIcon>
                                                    )}
                                                    {showDelete && (
                                                        <ActionIcon 
                                                            variant="subtle" 
                                                            color="red" 
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteMember(m.id); }}
                                                            size="sm"
                                                            title="Xóa"
                                                        >
                                                            <IconTrash size={16} />
                                                        </ActionIcon>
                                                    )}
                                                </Group>
                                            )}
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Paper p="xl" className="text-center bg-gray-50 rounded-lg">
                            <IconUsers size={48} className="mx-auto mb-4 text-gray-400" />
                            <Text color="dimmed">Chưa có thành viên. Thêm ngay để bắt đầu!</Text>
                        </Paper>
                    )}
                </div>

                <ModalAddMember
                    opened={openedAdd}
                    onClose={() => setOpenedAdd(false)}
                    familyId={user.familyId}
                    onAdded={loadFamilyData}
                    members={members}
                />

                <ModalPatientDetail
                    opened={detailOpened}
                    onClose={() => setDetailOpened(false)}
                    patient={selectedPatient}
                />

                <ModalEditDependent
                    opened={openedEdit}
                    onClose={() => setOpenedEdit(false)}
                    patient={selectedPatientForEdit}
                    onSubmit={handleUpdatePatient}
                />

                {/* MỚI: Render ModalEditRole */}
                {selectedMemberForRole && (
                    <ModalEditRole
                        opened={openedRoleEdit}
                        onClose={() => setOpenedRoleEdit(false)}
                        member={selectedMemberForRole}
                        onUpdated={loadFamilyData}
                    />
                )}

            </div>
        </div>
    );
};

export default FamilyProfile;