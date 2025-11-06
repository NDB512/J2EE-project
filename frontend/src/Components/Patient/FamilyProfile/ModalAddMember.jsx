import React, { useEffect, useState } from "react";
import { Modal, Button, Select, TextInput } from "@mantine/core";
import { useAuth } from "../../../Content/AuthContext";
import { errorNotification } from "../../../Utils/Notification";

const ModalAddMember = ({ opened, onClose, familyId, onAdded }) => {
    const { getPatients, addMemberToFamily } = useAuth();

    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [role, setRole] = useState("");

    useEffect(() => {
        const loadPatients = async () => {
            try {
                const res = await getPatients();
                setPatients(
                    res.map((p) => ({
                        value: p.id.toString(),
                        label: `${p.name} (${p.email})`,
                    }))
                );
            } catch (err) {
                errorNotification("Không thể tải danh sách bệnh nhân!");
            }
        };
        if (opened) loadPatients();
    }, [opened]);

    const handleAdd = async () => {
        if (!selectedPatient) return errorNotification("Vui lòng chọn thành viên.");

        try {
            await addMemberToFamily({
                familyId,
                patientId: Number(selectedPatient),
                roleInFamily: role || "Member",
            });
            successNotification("Thêm thành viên thành công!");
            onAdded(); // báo cho parent reload danh sách
            onClose();
        } catch (err) {
            errorNotification("Không thể thêm thành viên!");
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Thêm thành viên vào gia đình" centered>
            <Select
                label="Chọn bệnh nhân"
                placeholder="Tìm kiếm..."
                searchable
                data={patients}
                value={selectedPatient}
                onChange={setSelectedPatient}
                mb="md"
            />

            <TextInput
                label="Vai trò trong gia đình"
                placeholder="Ví dụ: Con, Vợ, Chồng..."
                value={role}
                onChange={(e) => setRole(e.target.value)}
                mb="md"
            />

            <Button fullWidth onClick={handleAdd}>
                Thêm thành viên
            </Button>
        </Modal>
    );
};

export default ModalAddMember;
