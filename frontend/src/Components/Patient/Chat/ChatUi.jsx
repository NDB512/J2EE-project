import React, { useState, useEffect, useRef } from "react";
import { Card, TextInput, Button, Loader, Badge, Text } from "@mantine/core";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Content/AuthContext";
import { useQuestionDetail } from "./useQuestionDetail";
import { useChatSocket } from "../../../hook/useChatSocket";

export default function ChatUI() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user, getHistoryApi, sendMessageApi } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const bottomRef = useRef(null);

    const questionId = roomId ? roomId.replace("question-", "") : null;
    const { question, loading: questionLoading, error: questionError } = useQuestionDetail(questionId);

    // Load lịch sử chat
    useEffect(() => {
        if (!roomId || !questionId) {
            setError("Invalid room ID");
            setLoading(false);
            return;
        }

        const loadHistory = async () => {
            try {
                const res = await getHistoryApi(roomId);
                setMessages(res || []);
            } catch (err) {
                console.error("Error loading history:", err);
                setError("Cannot load chat history");
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, [roomId, questionId, getHistoryApi]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // SỬA: Bỏ manual append, chỉ gọi API và chờ WS broadcast (tránh duplicate)
    const sendMessage = async () => {
        if (!input.trim() || !roomId || !question) return;

        if (user.role !== "Patient") {
            setError("Only patients can chat in this room");
            return;
        }

        const receiverId = question.assignedDoctorId;
        if (!receiverId) {
            setError("No doctor assigned yet");
            return;
        }

        try {
            const payload = {
                senderId: user.profileId,
                senderRole: user.role,
                receiverId,
                roomId,
                content: input,
            };

            // Chỉ gọi API, không append manual → WS sẽ handle cho tất cả
            await sendMessageApi(payload);
            setInput("");  // Clear input ngay

            // Optional: Optimistic update (append tạm cho sender, remove nếu fail - nhưng không cần vì WS nhanh)
            // const tempId = Date.now();
            // const tempMsg = { ...payload, id: tempId, timestamp: new Date().toISOString() };
            // setMessages(prev => [...prev, tempMsg]);
            // Sau broadcast, WS sẽ append real msg (check id để remove temp nếu cần)

        } catch (err) {
            console.error("Error sending message:", err);
            setError("Failed to send message");
        }
    };

    // WS callback: Append message mới (từ broadcast)
    useChatSocket(roomId, (msg) => {
        setMessages(prev => [...prev, msg]);
    });

    // Loading
    if (loading || questionLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    // Error UI
    if (error || questionError) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Card className="p-4">
                    <Text className="text-red-500">{error || questionError}</Text>
                    <Button onClick={() => navigate("/questions/list")} className="mt-4">
                        Quay lại danh sách
                    </Button>
                </Card>
            </div>
        );
    }

    // Nếu chưa được assign bác sĩ
    if (!question || question.status !== "ASSIGNED") {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Card className="p-6 text-center">
                    <Text className="text-yellow-500 mb-2">Chat chưa được bắt đầu.</Text>
                    <Text size="sm" c="dimmed" className="mb-4">
                        Vui lòng chờ bác sĩ được phân công và trả lời.
                    </Text>
                    <Badge color="yellow">Trạng thái: {question.status}</Badge>
                    <Button onClick={() => navigate("/questions/list")} className="mt-4">
                        Quay lại danh sách
                    </Button>
                </Card>
            </div>
        );
    }

    // UI chat
    return (
        <div className="w-full h-screen flex flex-col bg-gray-100 p-4">
            <Card className="w-full max-w-2xl flex flex-col h-full rounded-2xl shadow-lg mx-auto p-4">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-semibold">Chat: {question.title}</h1>
                    <Button 
                        variant="subtle" 
                        size="xs" 
                        onClick={() => navigate("/questions/list")}
                    >
                        ← Quay lại
                    </Button>
                </div>

                <Text size="sm" c="dimmed" className="mb-4">
                    Chuyên khoa: {question.specialty} | <Badge color="green">Đang chat</Badge>
                </Text>

                {/* Message list */}
                <div className="flex-1 overflow-y-auto space-y-2 p-2 bg-white rounded-xl shadow-inner mb-4">
                    {messages.length === 0 ? (
                        <Text className="text-center text-gray-500 italic">
                            Chưa có tin nhắn nào. Bắt đầu cuộc trò chuyện!
                        </Text>
                    ) : (
                        messages.map((msg, i) => (
                            <motion.div
                                key={msg.id || i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-3 w-fit max-w-[70%] rounded-2xl text-sm shadow ${
                                    msg.senderId == user.profileId
                                        ? "bg-blue-500 text-white ml-auto"
                                        : "bg-gray-200 text-gray-900"
                                }`}
                            >
                                <div className="font-bold text-xs mb-1">{msg.senderRole}</div>
                                <div>{msg.content}</div>
                                <div className="text-xs opacity-75 mt-1">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </div>
                            </motion.div>
                        ))
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input box */}
                <div className="flex gap-2">
                    <TextInput
                        placeholder="Nhập tin nhắn..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 rounded-xl"
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button onClick={sendMessage} className="rounded-xl px-6" disabled={!input.trim()}>
                        Gửi
                    </Button>
                </div>

            </Card>
        </div>
    );
}