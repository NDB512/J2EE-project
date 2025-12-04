// ListQuestionsPage.jsx - Trang danh sách câu hỏi cho Patient
import React, { useState, useEffect } from "react";
import { Card, Loader, Alert, Badge, Anchor, Button, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Content/AuthContext";

export default function ListQuestionsPage() {
    const { user, listQuestionsApi } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const familyId = user?.familyId;

    // Hàm loadQuestions đưa ra ngoài để dùng được trong useEffect và handleRetry
    const loadQuestions = async () => {
        if (!user || !familyId) {
            setError("Đang tải thông tin người dùng. Vui lòng chờ hoặc đăng nhập lại.");
            setLoading(false);
            return;
        }

        try {
            setError(null); // Xóa lỗi trước khi gọi API
            setLoading(true);
            console.log("Loading questions for familyId:", familyId);
            const data = await listQuestionsApi(familyId);
            setQuestions(Array.isArray(data) ? data : []); // Bảo vệ nếu data null
            console.log("Loaded questions:", data.length);
        } catch (err) {
            console.error("Error loading questions:", err);
            setError(`Không thể tải danh sách câu hỏi: ${err.message || 'Lỗi không xác định'}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQuestions();
    }, [user, familyId, listQuestionsApi]);

    const handleRetry = () => {
        setQuestions([]);
        loadQuestions();
    };

    const handleChat = (questionId) => {
        const roomId = `question-${questionId}`;
        navigate(`/chat/${roomId}`);
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-100">
                <Loader size="xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-100">
                <Card className="p-6 w-full max-w-md">
                    <Text className="text-red-500 mb-4 text-center">{error}</Text>
                    <Button fullWidth onClick={handleRetry} className="mb-2 rounded-xl">
                        Thử lại
                    </Button>
                    <Button 
                        fullWidth 
                        variant="outline" 
                        onClick={() => navigate("/patient/dashboard")} 
                        className="rounded-xl"
                    >
                        Về trang chủ
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-100 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Danh sách câu hỏi của bạn</h1>
                    <Anchor 
                        href="/question" 
                        className="underline text-blue-600 font-medium hover:text-blue-800"
                        size="sm"
                    >
                        Đặt câu hỏi mới
                    </Anchor>
                </div>

                {questions.length === 0 ? (
                    <Card className="p-6 text-center shadow-md rounded-xl">
                        <Alert 
                            title="Chưa có câu hỏi" 
                            color="blue" 
                            icon="ℹ️"
                            className="mb-4"
                        >
                            Bạn chưa đặt câu hỏi nào. 
                            <Anchor href="/question" className="underline ml-1">Đặt câu hỏi ngay!</Anchor> để nhận tư vấn từ bác sĩ.
                        </Alert>
                        <Button 
                            fullWidth 
                            onClick={() => navigate("/question")} 
                            className="rounded-xl bg-blue-500 hover:bg-blue-600"
                        >
                            Bắt đầu đặt câu hỏi
                        </Button>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {questions.map((q) => (
                            <Card key={q.id} className="p-4 rounded-xl shadow-md">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium mb-1 text-gray-800">{q.title}</h3>
                                        <Text size="sm" c="dimmed" className="mb-2">
                                            {q.description?.substring(0, 100) || 'Không có mô tả'}...
                                        </Text>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge color="blue" variant="light">{q.specialty || 'Chưa chọn chuyên khoa'}</Badge>
                                            <Badge 
                                                color={
                                                    q.status === "ASSIGNED" ? "green" :
                                                    q.status === "PENDING" ? "yellow" : "gray"
                                                }
                                                variant="light"
                                            >
                                                {q.status || 'UNKNOWN'}
                                            </Badge>
                                            {q.assignedDoctorId && (
                                                <Badge color="indigo" variant="light">Đã assign bác sĩ</Badge>
                                            )}
                                        </div>
                                        <Text size="xs" c="dimmed">
                                            Tạo lúc: {q.createdAt ? new Date(q.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                                        </Text>
                                    </div>
                                    {q.status === "ASSIGNED" && (
                                        <Button 
                                            onClick={() => handleChat(q.id)} 
                                            variant="outline" 
                                            className="ml-4 rounded-xl border-blue-500 text-blue-500 hover:bg-blue-50"
                                        >
                                            Chat ngay
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
