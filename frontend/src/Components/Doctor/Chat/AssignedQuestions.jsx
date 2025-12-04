import React, { useEffect, useState } from "react";
import { Card, Badge, Button, Loader, Text } from "@mantine/core";
import { useAuth } from "../../../Content/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AssignedQuestionsPage() {
    const { user, getDoctorAssignedApi } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getDoctorAssignedApi(user.profileId);
                setQuestions(res || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading)
        return <div className="w-full h-screen flex justify-center items-center"><Loader /></div>;

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-xl font-semibold mb-4">Câu hỏi đã nhận</h1>

            {questions.length === 0 ? (
                <Card className="p-4">
                    <Text c="dimmed" className="text-center">Chưa có câu hỏi nào.</Text>
                </Card>
            ) : (
                <div className="space-y-4">
                    {questions.map((q) => (
                        <Card key={q.id} className="p-4 shadow-md">
                            <div className="flex justify-between">
                                <div>
                                    <h2 className="text-lg font-medium">{q.title}</h2>
                                    <Text size="sm" c="dimmed">
                                        {q.description.substring(0, 100)}...
                                    </Text>
                                    <div className="flex gap-2 mt-2">
                                        <Badge color="green">ASSIGNED</Badge>
                                        <Badge color="blue">{q.specialty}</Badge>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => navigate(`/doctor/chat/question-${q.id}`)}
                                    variant="outline"
                                    className="rounded-xl"
                                >
                                    Vào chat
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
