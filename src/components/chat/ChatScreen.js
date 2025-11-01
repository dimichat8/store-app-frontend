import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import CreateRoom from "./CreateRoom";
import ApiService from "../ApiService";
import "./ChatScreen.css";

const ChatScreen = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const currentUserId = 1; // Από JWT ή context

  useEffect(() => {
    const fetchUserRooms = async () => {
      try {
        const res = await ApiService.getUserRooms(currentUserId);
        if (res.status === 200) setChats(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserRooms();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat]);

  const handleRoomCreated = (newRoom) => {
  const tempRoom = {
    id: newRoom?.id || `temp-${Date.now()}`,
    name: newRoom?.name || "Νέα Συνομιλία", // ή μπορείς να περάσεις το newRoomName από CreateRoom
    avatar: newRoom?.avatar || "https://i.pravatar.cc/150?img=12",
    lastMessage: "",
    time: "",
    messages: []
  };
  setChats(prev => [...prev, tempRoom]);
  setSelectedChat(newRoom);
};

  const handleSelectChat = async (chat) => {
    try {
      // Φόρτωσε τα μηνύματα από backend
      const res = await ApiService.getMessages(chat.id);
      console.log(res);
      const messages = res.status === 200 ? res.data.data || [] : [];

      // Προσάρμοσε τα μηνύματα ώστε να έχουν πεδίο text για ευκολότερη απεικόνιση
      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        sender: msg.senderUsername,
        text: msg.content
      }));

      setSelectedChat({
        ...chat,
        messages: formattedMessages
      });
    } catch (err) {
      console.error(err);
      setSelectedChat(chat); // fallback
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const messagePayload = {
      senderId: currentUserId,
      senderUsername: "Εσύ",
      content: newMessage,
    };

    try {
      const res = await ApiService.sendMessage(selectedChat.id, messagePayload);
      if (res.status === 200) {
        setSelectedChat(prev => ({
          ...prev,
          messages: [...(prev.messages || []), { sender: "Εσύ", text: newMessage }],
          lastMessage: newMessage,
          time: "Τώρα"
        }));
        setChats(prev => prev.map(c => c.id === selectedChat.id
          ? { ...c, lastMessage: newMessage, time: "Τώρα" }
          : c));
        setNewMessage("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="chat-screen">
      <div className="chat-sidebar">
        <h2 className="chatlist-title">Συνομιλίες</h2>
        <div className="chatlist-items">
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`chat-item ${selectedChat?.id === chat.id ? "active-chat" : ""}`}
              onClick={() => handleSelectChat(chat)}
            >
              <img src={chat.avatar || "https://i.pravatar.cc/150?img=12"} alt={chat.name} className="chat-avatar" />
              <div className="chat-info">
                <div className="chat-top-row">
                  <span className="chat-name">{chat.name}</span>
                  <span className="chat-time">{chat.time || ""}</span>
                </div>
                <p className="chat-last-message">{chat.lastMessage || ""}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-sidebar-buttons">
          <button onClick={() => setCreateDialogVisible(true)}>➕ Νέα Συνομιλία</button>
          <button onClick={() => navigate("/home")}>🏠 Αρχική</button>
          <button onClick={() => navigate(-1)}>⬅️ Πίσω</button>
        </div>
      </div>

      <div className="chat-main">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <img src={selectedChat.avatar || "https://i.pravatar.cc/150?img=12"} alt={selectedChat.name} className="chat-avatar-header" />
              <span className="chat-header-name">{selectedChat.name}</span>
            </div>

            <div className="messages-container">
              {(selectedChat.messages || []).map((msg, index) => (
                <div
                  key={msg.id ? `msg-${msg.id}` : `msg-${index}-${msg.text}`}
                  className={`message-item ${msg.sender === "Εσύ" ? "sent" : "received"}`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
              <input
                type="text"
                placeholder="Γράψε μήνυμα..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="chat-input"
              />
              <button onClick={handleSendMessage} className="chat-send-btn">📤</button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">Επέλεξε μια συνομιλία για να ξεκινήσεις</div>
        )}
      </div>

      <CreateRoom
        visible={createDialogVisible}
        onHide={() => setCreateDialogVisible(false)}
        onRoomCreated={handleRoomCreated}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default ChatScreen;