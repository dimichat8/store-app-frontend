import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import CreateRoom from "./CreateRoom";
import ApiService from "../ApiService";
import "./ChatScreen.css";
import { useAuth } from '../AuthProvider';

const ChatScreen = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [avatars, setAvatars] = useState({}); 
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { userId } = useAuth();
  const currentUserId = userId || 1;

  const fetchUserAvatar = async (id) => {
    if (!id || avatars[id]) return;

    try {
      const avatarUrl = await ApiService.getUserAvatar(id);
      setAvatars(prev => ({ ...prev, [id]: avatarUrl }));
    } catch (err) {
      console.error("Failed to load avatar for userId:", id, err);
      setAvatars(prev => ({ ...prev, [id]: "https://i.pravatar.cc/150?img=12" }));
    }
  };

  useEffect(() => {
    if (!userId) return;

    const fetchUserRooms = async () => {
      try {
        const res = await ApiService.getUserRooms(userId);
        if (res.status === 200 && Array.isArray(res.data.data)) {
          const rooms = res.data.data.map(chat => ({
            ...chat,
            members: (chat.memberIds || []).map(id => ({ id }))
          }));
          setChats(rooms);

          rooms.forEach(chat => chat.members.forEach(member => fetchUserAvatar(member.id)));
        }
      } catch (err) {
        console.error("Error fetching user rooms:", err);
      }
    };

    fetchUserRooms();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat]);

  const handleSelectChat = async (chat) => {
    if (!chat) return;
    try {
      const res = await ApiService.getMessages(chat.id);
      const messagesData = res.status === 200 ? res.data.data : [];
      const messages = Array.isArray(messagesData) ? messagesData : [];

      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        senderId: msg.senderId,
        sender: msg.senderId === currentUserId ? "Εσύ" : msg.senderUsername,
        text: msg.content
      }));

      setSelectedChat({ ...chat, messages: formattedMessages });
    } catch (err) {
      console.error("Error fetching messages for chat:", chat.id, err);
      setSelectedChat(chat);
    }
  };

  const handleRoomCreated = (newRoom) => {
    if (!newRoom) return;

    const tempRoom = {
      id: newRoom?.id || `temp-${Date.now()}`,
      name: newRoom?.name || "Νέα Συνομιλία",
      members: newRoom?.members || [],
      lastMessage: "",
      time: "",
      messages: []
    };
    setChats(prev => [...prev, tempRoom]);
    setSelectedChat(tempRoom);

    tempRoom.members.forEach(member => fetchUserAvatar(member.id));
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
        const newMsg = {
          id: res.data?.data?.id || Date.now(),
          sender: "Εσύ",
          senderId: currentUserId,
          text: newMessage
        };
        setSelectedChat(prev => ({
          ...prev,
          messages: [...(prev.messages || []), newMsg],
          lastMessage: newMessage,
          time: "Τώρα"
        }));
        setChats(prev => prev.map(c => c.id === selectedChat.id
          ? { ...c, lastMessage: newMessage, time: "Τώρα" }
          : c));
        setNewMessage("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
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
          {chats.map(chat => {
            const otherMemberId = chat.members?.find(m => m.id !== currentUserId)?.id;
            const isGroup = chat.members?.length > 2;
            return (
              <div
                key={chat.id}
                className={`chat-item ${selectedChat?.id === chat.id ? "active-chat" : ""}`}
                onClick={() => handleSelectChat(chat)}
              >
                <img 
                  src={
                    isGroup 
                      ? "https://static.thenounproject.com/png/team-icon-6282673-512.png"   
                      : avatars[otherMemberId] || "https://i.pravatar.cc/150?img=12"
                  } 
                  alt={chat.name || "Avatar"} 
                  className="chat-avatar" 
                />
                <div className="chat-info">
                  <div className="chat-top-row">
                    <span className="chat-name">{chat.name}</span>
                    <span className="chat-time">{chat.time || ""}</span>
                  </div>
                  <p className="chat-last-message">{chat.lastMessage || ""}</p>
                </div>
              </div>
            )
          })}
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
              <img 
                src={avatars[selectedChat.members?.find(m => m.id !== currentUserId)?.id] || "https://i.pravatar.cc/150?img=12"} 
                alt={selectedChat.name || "Avatar"} 
                className="chat-avatar-header" 
              />
              <span className="chat-header-name">{selectedChat.name}</span>
            </div>

            <div className="messages-container">
              {(selectedChat.messages || []).map((msg, index) => (
                <div
                  key={msg.id ? `msg-${msg.id}` : `msg-${index}-${msg.text}` }
                  className={`message-wrapper ${msg.senderId === currentUserId ? "sent-wrapper" : "received-wrapper"}`}
                >
                  <div className="sender-name">{msg.sender}</div>
                  <div className={`message-item ${msg.senderId === currentUserId ? "sent" : "received"}`}>
                    <div className="message-bubble">{msg.text}</div>
                  </div>
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