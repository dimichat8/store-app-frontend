import React, { useEffect, useState } from "react";
import { connect, sendToRoom } from "./ChatService";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import "./ChatWindow.css";

const GroupChat = ({ username, roomName }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  

  useEffect(() => {
    connect(username, onMessageReceived);
  }, []);

  const onMessageReceived = (payload) => {
    try {
      const msg = JSON.parse(payload.body);
      if (msg.roomName === roomName) {
        setMessages((prev) => [...prev, msg]);
      }
    } catch (e) {
      console.error("Invalid message received:", payload);
    }
  };
  
  useEffect(() => {
    const otherMessage = {
        sender: "Thomi",
        content: "Γεια σου 😁",
        self: false,
        roomName: roomName
    };

    // Προσοχή: Αυτό τρέχει **μία φορά** όταν φορτώνει το component
    setMessages(prev => [...prev, otherMessage]);
    }, []);

  const sendMessageHandler = () => {
    if (!message.trim()) return;

        const newMsg = {
            sender: username,
            content: message,
            roomName: roomName,
        };

        setMessages((prev) => [...prev, newMsg]);
        sendToRoom(username, roomName, message);
        setMessage("");
    };

  return (
    <div className="chat-group">
        <div className="chat-messages">
            {messages.map((m, i) => (
            <div key={i} className={`chat-message ${m.sender === username ? "self" : "other"}`}>
                <div className="chat-sender">{m.sender}</div>
                <div className="chat-content">{m.content}</div>
            </div>
            ))}
        </div>

        <div className="chat-input-wrapper">
            <InputTextarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Γράψε μήνυμα..."
                className="chat-input-textarea"
                rows={1}
                autoResize
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault(); 
                    sendMessageHandler();
                    }
                }}
            />
            <Button
                icon="pi pi-send"
                className="chat-send-button"
                onClick={sendMessageHandler}
            />
        </div>
    </div>
  );
};

export default GroupChat;