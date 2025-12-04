import React, { useState } from "react";
import { Card, TextInput, Textarea, Button, Select, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Content/AuthContext";
import { doctorSpecializations } from "../../../Data/DropdownData";

export default function CreateQuestionPage() {
    const { user, createQuestionApi } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        if (!title.trim() || !description.trim() || !specialty) {
            setError("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        if (!user || !user.profileId) {
            setError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const payload = {
                patientId: user.profileId,
                title,
                description,
                specialty
            };

            const res = await createQuestionApi(payload);

            // Chuyển sang danh sách câu hỏi hoặc chat
            navigate(`/patient/questions`);
        } catch (err) {
            console.error("Error creating question:", err);
            setError("Không thể tạo câu hỏi. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 p-4 flex justify-center items-start pt-10">
            <Card className="w-full max-w-lg p-6 rounded-xl shadow-md">
                <Text className="text-2xl font-semibold mb-4">Đặt câu hỏi mới</Text>

                {error && (
                    <Text color="red" className="mb-4">{error}</Text>
                )}

                <TextInput
                    label="Tiêu đề"
                    placeholder="Nhập tiêu đề câu hỏi"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mb-4"
                />

                <Textarea
                    label="Mô tả chi tiết"
                    placeholder="Mô tả triệu chứng hoặc thắc mắc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    minRows={4}
                    className="mb-4"
                />

                <Select
                    label="Chuyên khoa"
                    placeholder="Chọn chuyên khoa"
                    value={specialty}
                    onChange={setSpecialty}
                    data={doctorSpecializations.map(s => ({ value: s, label: s }))}
                    className="mb-6"
                />

                <Button
                    fullWidth
                    onClick={handleSubmit}
                    loading={loading}
                    className="rounded-xl bg-blue-500 hover:bg-blue-600"
                >
                    Tạo câu hỏi
                </Button>

                <Button
                    fullWidth
                    variant="outline"
                    onClick={() => navigate("/questions/list")}
                    className="mt-2 rounded-xl"
                >
                    Quay lại danh sách
                </Button>
            </Card>
        </div>
    );
}
