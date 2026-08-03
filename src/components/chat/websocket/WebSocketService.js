import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (token, onMessage) => {
  stompClient = new Client({
    webSocketFactory: () =>
      new SockJS("http://localhost:8080/ws"),

    connectHeaders: {
      Authorization: `Bearer ${token}`
    },

    debug: (str) => console.log(str),

    onConnect: () => {
      console.log("✅ WebSocket connected");

      stompClient.subscribe("/topic/messages", (msg) => {
        onMessage(JSON.parse(msg.body));
      });
    },

    onStompError: (frame) => {
      console.error("❌ Broker error", frame);
    }
  });

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    console.log("🔌 WebSocket disconnected");
  }
};

export const sendMessage = (message) => {
  if (!stompClient || !stompClient.connected) return;

  stompClient.publish({
    destination: "/app/chat.send",
    body: JSON.stringify(message)
  });
};