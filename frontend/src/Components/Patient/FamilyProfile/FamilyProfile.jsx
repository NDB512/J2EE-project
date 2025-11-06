import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../Content/AuthContext";
import { Loader, Button } from "@mantine/core";
import ModalAddMember from "./ModalAddMember";

const FamilyProfile = () => {
    const { familyId } = useParams();
    const { user, getFamilyDetail, getFamilyMembers} = useAuth();

    const [family, setFamily] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [opened, setOpened] = useState(false);

    const loadFamilyData = async () => {
        try {
            const familyData = await getFamilyDetail(familyId);
            const memberData = await getFamilyMembers(familyId);
            setFamily(familyData);
            setMembers(memberData);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFamilyData();
    }, [familyId]);

    if (loading) return <Loader />;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-2">{family?.familyName}</h1>
            <p className="mb-4">Chủ hộ: {family?.headOfFamily}</p>

            <Button onClick={() => setOpened(true)} className="mb-3">
                + Thêm thành viên
            </Button>

            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Tên</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Quan hệ</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((m) => (
                        <tr key={m.id}>
                            <td className="border p-2">{m.name}</td>
                            <td className="border p-2">{m.email}</td>
                            <td className="border p-2">{m.roleInFamily}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ModalAddMember
                opened={opened}
                onClose={() => setOpened(false)}
                familyId={familyId}
                onAdded={loadFamilyData} // reload list
            />
        </div>
    );
};

export default FamilyProfile;
