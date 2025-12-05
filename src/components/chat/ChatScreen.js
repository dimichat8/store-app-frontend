import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import CreateRoom from "./CreateRoom";
import ApiService from "../ApiService";
import { useAuth } from '../AuthProvider';
import "./ChatScreen.css";

const ChatScreen = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [avatars, setAvatars] = useState({});
  const navigate = useNavigate();
  const { userId } = useAuth();
  const currentUserId = userId;

  const fetchUserAvatar = async (id) => {
    if (!id || avatars[id]) return;
    try {
      const avatarUrl = await ApiService.getUserAvatar(id);
      setAvatars(prev => ({ ...prev, [id]: avatarUrl }));
    } catch {
      setAvatars(prev => ({ ...prev, [id]: "https://static.thenounproject.com/png/5034901-512.png" }));
    }
  };

  const getChatAvatar = (chat) => {
    const otherMemberId = chat.members?.find(m => m.id !== currentUserId)?.id;
    const isGroup = chat.members?.length > 2;
    if (isGroup) return "https://static.thenounproject.com/png/team-icon-6282673-512.png";
    return avatars[otherMemberId] || "https://i.ibb.co/4fQbM0f/unknown-person.png";
  };

  useEffect(() => {
    if (!userId) return;
    const fetchUserRooms = async () => {
      try {
        const res = await ApiService.getUserRooms(userId);
        if (res.status === 200 && Array.isArray(res.data.data)) {
          const rooms = res.data.data.map(chat => ({
            ...chat,
            members: (chat.memberIds || []).map(id => ({ id })),
            avatar: undefined
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

  const handleSelectChat = async (chat) => {
    if (!chat) return;
    try {
      const res = await ApiService.getMessages(chat.id);
      const messages = Array.isArray(res.data.data) ? res.data.data : [];
      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        senderId: msg.senderId,
        sender: msg.senderId === currentUserId ? "Εσύ" : msg.senderUsername,
        text: msg.content
      }));
      setSelectedChat({ ...chat, messages: formattedMessages, avatar: getChatAvatar(chat) });
    } catch {
      setSelectedChat({ ...chat, avatar: getChatAvatar(chat) });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    const messagePayload = { senderId: currentUserId, senderUsername: "Εσύ", content: newMessage };
    try {
      const res = await ApiService.sendMessage(selectedChat.id, messagePayload);
      if (res.status === 200) {
        const newMsg = { id: res.data?.data?.id || Date.now(), sender: "Εσύ", senderId: currentUserId, text: newMessage };
        setSelectedChat(prev => ({ ...prev, messages: [...(prev.messages || []), newMsg], lastMessage: newMessage, time: "Τώρα" }));
        setChats(prev => prev.map(c => c.id === selectedChat.id ? { ...c, lastMessage: newMessage, time: "Τώρα" } : c));
        setNewMessage("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
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
      messages: [],
      avatar: undefined
    };
    setChats(prev => [...prev, tempRoom]);
    setSelectedChat(tempRoom);
    tempRoom.members.forEach(member => fetchUserAvatar(member.id));
  };

  return (
    <div className="chat-screen">
      <div className="chat-sidebar">
        <h2 className="chatlist-title">Συνομιλίες</h2>
        <ChatList 
          chats={chats} 
          selectedChat={selectedChat} 
          onSelectChat={handleSelectChat} 
          getChatAvatar={getChatAvatar} 
          currentUserId={currentUserId} 
        />

        <div className="chat-sidebar-buttons">
          <button onClick={() => setCreateDialogVisible(true)}>➕ Νέα Συνομιλία</button>
          <button onClick={() => navigate("/home")}>🏠 Αρχική</button>
          <button onClick={() => navigate(-1)}>⬅️ Πίσω</button>
        </div>
      </div>

      <div className="chat-main">
        <ChatWindow
          selectedChat={selectedChat}
          currentUserId={currentUserId}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
        />
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