// src/hooks/useChatSocket.js
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";

export function useChatSocket(roomId, onMessageReceived) {
    const clientRef = useRef(null);
    const subscriptionRef = useRef(null);
    const { accessToken } = useSelector((state) => state.auth);
    
    // Stable wrapper cho onMessageReceived
    const stableOnMessage = useCallback((body) => {
        // Optional: Check duplicate (nếu parent pass messages state)
        // if (!messages.some(msg => msg.id === body.id)) {
        //     onMessageReceived(body);
        // }
        onMessageReceived(body);
    }, [onMessageReceived]);

    useEffect(() => {
        if (!roomId || !accessToken) return;

        console.log("[WS] Initializing for room:", roomId);

        const client = new Client({
            brokerURL: "ws://localhost:9500/ws/chat",  // Direct test; sau dùng 9000 cho gateway
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            debug: str => console.log("[WS Debug]", str), 
        });

        client.onConnect = () => {
            console.log("[WS] Connected to server");

            subscriptionRef.current = client.subscribe(
                `/topic/${roomId}`,
                (message) => {
                    try {
                        const body = JSON.parse(message.body);
                        console.log("[WS] Incoming:", body);
                        stableOnMessage(body);
                    } catch (err) {
                        console.error("Parsing error:", err);
                    }
                }
            );

            console.log("[WS] Subscribed to /topic/" + roomId);
        };

        client.onStompError = (frame) => {
            console.error("[WS] STOMP Error:", frame);
        };

        client.activate();
        clientRef.current = client;

        return () => {
            console.log("[WS] Cleaning up...");

            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }

            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }
        };
    }, [roomId, stableOnMessage, accessToken]);
}