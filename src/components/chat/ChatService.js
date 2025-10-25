import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connect = (username, onMessageReceived) => {
  const socket = new SockJS("http://localhost:8080/ws");
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: (str) => console.log(str),
  });

  stompClient.onConnect = () => {
    console.log("Connected as", username);
    stompClient.subscribe("/topic/messages", onMessageReceived);
  };

  stompClient.activate();
};

export const sendToRoom = (username, room, content) => {
  if (!stompClient || !stompClient.connected) return;

  const message = { sender: username, roomName: room, content };
  stompClient.publish({
    destination: "/app/chat",
    body: JSON.stringify(message),
  });
};
