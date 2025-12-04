import React, { useState } from "react";
import { Modal, Button, TextInput, Group } from "@mantine/core";
import { successNotification, errorNotification } from "../../../Utils/Notification";
import { useAuth } from "../../../Content/AuthContext";

const ModalCreateFamily = ({ opened, onClose, onCreated }) => {
    const { createFamily, user } = useAuth();

    const [familyName, setFamilyName] = useState("");
    const [familyAddress, setFamilyAddress] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateFamily = async () => {
        setLoading(true);
        try {
            const data = {
                familyName: familyName,
                familyAddress: familyAddress
            };

            await createFamily(user.profileId, data);

            successNotification("Tạo hồ sơ gia đình thành công!");
            onCreated();
            onClose();

        } catch (err) {
            errorNotification("Không thể tạo hồ sơ gia đình!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Tạo hồ sơ gia đình" centered>
            <TextInput
                label="Tên gia đình"
                placeholder="Nhập tên gia đình"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                required
            />

            <TextInput
                label="Địa chỉ"
                placeholder="Nhập địa chỉ gia đình"
                value={familyAddress}
                onChange={(e) => setFamilyAddress(e.target.value)}
                required
                mt="md"
            />

            <Group position="right" mt="md">
                <Button variant="outline" onClick={onClose}>Hủy</Button>
                <Button loading={loading} onClick={handleCreateFamily}>
                    Tạo gia đình
                </Button>
            </Group>
        </Modal>
    );
};

export default ModalCreateFamily;
