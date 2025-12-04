import { useState, useEffect } from "react";
import { useAuth } from "../../../Content/AuthContext";

export function useQuestionDetail(rawQuestionId) {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getQuestionApi } = useAuth();

    // Tự động FIX trường hợp truyền vào roomId = "question-12"
    const questionId = rawQuestionId?.replace("question-", "").trim();

    useEffect(() => {
        if (!questionId || isNaN(questionId)) {
            console.warn("Invalid questionId:", questionId);
            setLoading(false);
            return;
        }

        const loadQuestion = async () => {
            try {
                const res = await getQuestionApi(questionId);
                setQuestion(res);
            } catch (err) {
                console.error("Error loading question:", err);
                setError("Cannot load question details");
            } finally {
                setLoading(false);
            }
        };

        loadQuestion();
    }, [questionId, getQuestionApi]);

    return { question, loading, error };
}