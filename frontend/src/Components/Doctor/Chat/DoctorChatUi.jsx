import React, { useState, useEffect, useRef } from "react";
import { Card, TextInput, Button, Loader, Badge, Text } from "@mantine/core";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Content/AuthContext";
import { useQuestionDetail } from "./useQuestionDetail";
import { useChatSocket } from "../../../hooks/useChatSocket";

export default function DoctorChatUI() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user, getHistoryApi, sendMessageApi } = useAuth();

    const questionId = roomId.replace("question-", "");
    const { question, loading: questionLoading } = useQuestionDetail(questionId);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            const res = await getHistoryApi(roomId);
            setMessages(res || []);
            setLoading(false);
        };
        load();
    }, [roomId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // SỬA: Bỏ manual append, chỉ gọi API và chờ WS broadcast
    const sendMessage = async () => {
        if (!input.trim()) return;

        const receiverId = question.patientId;  // Patient ID làm receiver

        try {
            const payload = {
                senderId: user.profileId,
                senderRole: "DOCTOR",
                receiverId,
                roomId,
                content: input
            };

            // Chỉ gọi API, không append manual → WS sẽ handle
            await sendMessageApi(payload);
            setInput("");  // Clear input

        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    // WS callback: Append message mới
    useChatSocket(roomId, (msg) => {
        setMessages(prev => [...prev, msg]);
    });

    if (loading || questionLoading)
        return <div className="w-full h-screen flex items-center justify-center"><Loader /></div>;

    return (
        <div className="w-full h-screen flex flex-col bg-gray-100 p-4">
            <Card className="w-full max-w-2xl flex flex-col h-full rounded-2xl shadow-lg mx-auto p-4">

                <div className="flex justify-between mb-4">
                    <h1 className="text-xl font-semibold">{question.title}</h1>
                    <Button variant="subtle" size="xs" onClick={() => navigate("/doctor/assigned")}>
                        ← Quay lại
                    </Button>
                </div>

                <Text size="sm" c="dimmed" className="mb-4">
                    Bệnh nhân: {question.patientId} | <Badge color="green">Đang chat</Badge>
                </Text>

                <div className="flex-1 overflow-y-auto p-2 bg-white rounded-xl shadow-inner mb-4 space-y-2">
                    {messages.length === 0 ? (
                        <Text className="text-center text-gray-500 italic">
                            Chưa có tin nhắn nào.
                        </Text>
                    ) : (
                        messages.map((msg, i) => (
                            <motion.div
                                key={msg.id || i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-3 w-fit max-w-[70%] rounded-2xl text-sm shadow ${
                                    msg.senderId == user.profileId
                                        ? "bg-green-500 text-white ml-auto"
                                        : "bg-gray-200 text-gray-900"
                                }`}
                            >
                                <div className="font-bold text-xs">{msg.senderRole}</div>
                                <div>{msg.content}</div>
                                <div className="text-xs opacity-75 mt-1">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </div>
                            </motion.div>
                        ))
                    )}
                    <div ref={bottomRef} />
                </div>

                <div className="flex gap-2">
                    <TextInput
                        value={input}
                        placeholder="Nhập tin nhắn..."
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button onClick={sendMessage} disabled={!input.trim()}>
                        Gửi
                    </Button>
                </div>
            </Card>
        </div>
    );
}