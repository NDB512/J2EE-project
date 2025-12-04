// DoctorPendingQuestionsPage.jsx
import React, { useEffect, useState } from "react";
import { Card, Badge, Button, Loader, Text, Alert } from "@mantine/core";
import { useAuth } from "../../../Content/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DoctorPendingQuestionsPage() {
    const { user, getDoctorInfo, listPendingQuestionsApi, assignDoctorApi } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [doctorInfo, setDoctorInfo] = useState([]);
    const navigate = useNavigate();

    const loadData = async () => {
        try {
            setLoading(true);
            const doctorInfo = await getDoctorInfo(user.profileId);
            setDoctorInfo(doctorInfo);
            const res = await listPendingQuestionsApi(doctorInfo.specialization);
            console.log("Pending Questions:", res);
            setQuestions(res || []);
        } catch (err) {
            setError("Không tải được danh sách câu hỏi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAssign = async (questionId) => {
        try {
            const res = await assignDoctorApi(questionId, user.profileId);

            navigate(`/doctor/chat/${res.roomId}`);
        } catch (err) {
            setError("Không thể nhận câu hỏi");
        }
    };


    if (loading) return (
        <div className="w-full h-screen flex items-center justify-center">
            <Loader size="xl" />
        </div>
    );

    return (
        <div className="w-full p-4 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-semibold mb-4">Câu hỏi đang chờ</h1>
                <Button
                    variant="outline"
                    className="rounded-xl mb-4"
                    onClick={() => navigate("/doctor/question/assigned")}
                >
                    Xem câu hỏi đã nhận
                </Button>
               <Text component="span" size="sm" c="dimmed" className="mb-4">
                    Chuyên khoa: <Badge color="blue">{doctorInfo.specialization}</Badge>
                </Text>

                {error && (
                    <Alert color="red" className="mb-4">{error}</Alert>
                )}

                {questions.length === 0 ? (
                    <Card className="p-6 text-center">
                        <Text>Không có câu hỏi nào.</Text>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {questions.map((q) => (
                            <Card key={q.id} className="p-4 rounded-xl shadow-md">
                                <h3 className="text-lg font-semibold">{q.title}</h3>
                                <Text size="sm" c="dimmed" className="mb-2">
                                    {q.description?.substring(0, 100)}...
                                </Text>

                                <div className="flex items-center gap-3 mb-2">
                                    <Badge color="yellow">PENDING</Badge>
                                </div>

                                <Text size="xs" c="dimmed">
                                    Tạo lúc: {new Date(q.createdAt).toLocaleString("vi-VN")}
                                </Text>

                                <Button
                                    className="mt-3 rounded-xl bg-blue-500 hover:bg-blue-600"
                                    onClick={() => handleAssign(q.id)}
                                >
                                    Nhận câu hỏi
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
