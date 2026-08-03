import React, { useEffect, useState } from "react";
import { connectWebSocket, disconnectWebSocket, sendMessage } from "./WebSocketService";
import { useAuth } from "../../AuthProvider";

const ChatPage = () => {
  const { accessToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    connectWebSocket(accessToken, (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      disconnectWebSocket();
    };
  }, [accessToken]);

  const handleSend = () => {
    sendMessage({
      content: text
    });
    setText("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat</h2>

      <div style={{
        border: "1px solid #ccc",
        height: 300,
        overflowY: "auto",
        marginBottom: 10
      }}>
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.sender || "anon"}:</b> {m.content}
          </div>
        ))}
      </div>

      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatPage;